// Example: Using OpenAI Whisper API directly (for reference)

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Use environment variable in production
});

// Example 1: Basic transcription
async function basicTranscription(audioFile: File) {
  try {
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-1",
    });
    
    console.log(transcription.text);
  } catch (error) {
    console.error('Transcription error:', error);
  }
}

// Example 2: Detailed transcription with timestamps
async function detailedTranscription(audioFile: File) {
  try {
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-1",
      response_format: "verbose_json",
      timestamp_granularities: ["segment"]
    });
    
    console.log('Full transcription:', transcription.text);
    
    // Process segments with timestamps
    transcription.segments?.forEach((segment, index) => {
      console.log(`Segment ${index + 1}: ${segment.text}`);
      console.log(`Time: ${segment.start}s - ${segment.end}s`);
    });
  } catch (error) {
    console.error('Transcription error:', error);
  }
}

// Example 3: Multi-language transcription
async function multiLanguageTranscription(audioFile: File) {
  try {
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-1",
      language: "es", // Spanish - or omit for auto-detection
      response_format: "verbose_json"
    });
    
    console.log('Language:', transcription.language);
    console.log('Text:', transcription.text);
  } catch (error) {
    console.error('Transcription error:', error);
  }
}

// Example 4: Generate subtitles
async function generateSubtitles(audioFile: File, format: 'srt' | 'vtt' = 'srt') {
  try {
    const subtitles = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-1",
      response_format: format
    });
    
    console.log('Subtitles:', subtitles);
    
    // Save to file
    const blob = new Blob([subtitles as string], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `subtitles.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Subtitle generation error:', error);
  }
}

// Example 5: Real-time transcription with RecordRTC
import RecordRTC from 'recordrtc';

class RealTimeWhisperTranscription {
  private recorder: RecordRTC | null = null;
  private stream: MediaStream | null = null;
  private openai: OpenAI;
  
  constructor(apiKey: string) {
    this.openai = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true // Only for demo - use backend proxy in production
    });
  }
  
  async startRecording(onTranscription: (text: string) => void) {
    try {
      // Get microphone access
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Start recording
      this.recorder = new RecordRTC(this.stream, {
        type: 'audio',
        mimeType: 'audio/webm',
        timeSlice: 5000, // Process every 5 seconds
        ondataavailable: async (blob: Blob) => {
          await this.processAudioChunk(blob, onTranscription);
        }
      });
      
      this.recorder.startRecording();
    } catch (error) {
      console.error('Recording error:', error);
    }
  }
  
  stopRecording() {
    if (this.recorder) {
      this.recorder.stopRecording();
    }
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
    }
  }
  
  private async processAudioChunk(audioBlob: Blob, onTranscription: (text: string) => void) {
    try {
      if (audioBlob.size === 0) return;
      
      const audioFile = new File([audioBlob], 'chunk.webm', { type: 'audio/webm' });
      
      const transcription = await this.openai.audio.transcriptions.create({
        file: audioFile,
        model: 'whisper-1',
        response_format: 'text'
      });
      
      if (transcription && transcription.trim()) {
        onTranscription(transcription.trim());
      }
    } catch (error) {
      console.error('Chunk processing error:', error);
    }
  }
}

// Usage example
const transcriber = new RealTimeWhisperTranscription('your-api-key');

transcriber.startRecording((text) => {
  console.log('Real-time transcription:', text);
  // Update UI with transcription
});

// Stop after 30 seconds
setTimeout(() => {
  transcriber.stopRecording();
}, 30000);

export {
  basicTranscription,
  detailedTranscription,
  multiLanguageTranscription,
  generateSubtitles,
  RealTimeWhisperTranscription
};