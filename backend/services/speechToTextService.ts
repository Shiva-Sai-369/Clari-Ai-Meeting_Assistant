import RecordRTC from 'recordrtc';
import OpenAI from 'openai';

export interface TranscriptionSegment {
  text: string;
  speaker: string;
  timestamp: number;
  confidence: number;
  startTime: number;
  endTime: number;
}

export interface SpeechRecognitionConfig {
  enableSpeakerDiarization: boolean;
  languageCode: string;
  enableAutomaticPunctuation: boolean;
  profanityFilter: boolean;
  responseFormat: 'json' | 'text' | 'srt' | 'verbose_json' | 'vtt';
  temperature: number;
}

class SpeechToTextService {
  private recorder: RecordRTC | null = null;
  private stream: MediaStream | null = null;
  private isRecording = false;
  private config: SpeechRecognitionConfig;
  private onTranscriptionCallback?: (segment: TranscriptionSegment) => void;
  private onErrorCallback?: (error: string) => void;
  private openai: OpenAI;
  private recordingTimer: NodeJS.Timeout | null = null;
  private speakerCounter = 1;

  constructor(config: Partial<SpeechRecognitionConfig> = {}) {
    this.config = {
      enableSpeakerDiarization: true,
      languageCode: 'en',
      enableAutomaticPunctuation: true,
      profanityFilter: false,
      responseFormat: 'verbose_json',
      temperature: 0,
      ...config
    };

    // Initialize OpenAI client
    this.openai = new OpenAI({
      apiKey: import.meta.env.VITE_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true // Note: In production, use a backend proxy
    });
  }

  async startRecording(
    onTranscription: (segment: TranscriptionSegment) => void,
    onError: (error: string) => void
  ): Promise<void> {
    try {
      this.onTranscriptionCallback = onTranscription;
      this.onErrorCallback = onError;

      // Request microphone access
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      // Start recording with RecordRTC
      this.recorder = new RecordRTC(this.stream, {
        type: 'audio',
        mimeType: 'audio/webm', // WebM format for better compatibility
        sampleRate: 16000,
        numberOfAudioChannels: 1,
        timeSlice: 5000, // Process every 5 seconds for better accuracy
        ondataavailable: (blob: Blob) => {
          this.processAudioChunk(blob);
        }
      });

      this.recorder.startRecording();
      this.isRecording = true;

      // Start periodic processing
      this.startPeriodicProcessing();

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      this.onErrorCallback?.(errorMessage);
      throw new Error(`Failed to start recording: ${errorMessage}`);
    }
  }

  stopRecording(): void {
    if (this.recordingTimer) {
      clearInterval(this.recordingTimer);
      this.recordingTimer = null;
    }

    if (this.recorder && this.isRecording) {
      this.recorder.stopRecording(() => {
        // Process the final recording
        if (this.recorder) {
          const finalBlob = this.recorder.getBlob();
          this.processAudioChunk(finalBlob);
        }
      });
      this.isRecording = false;
    }

    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
  }

  private startPeriodicProcessing(): void {
    // Process audio chunks every 5 seconds
    this.recordingTimer = setInterval(() => {
      if (this.recorder && this.isRecording) {
        // Get current recording and process it
        const currentBlob = this.recorder.getBlob();
        if (currentBlob.size > 0) {
          this.processAudioChunk(currentBlob);
        }
      }
    }, 5000);
  }

  private async processAudioChunk(audioBlob: Blob): Promise<void> {
    if (audioBlob.size === 0) return;

    try {
      // Convert blob to File object (required by OpenAI API)
      const audioFile = new File([audioBlob], 'audio.webm', { type: 'audio/webm' });

      // Make API call to OpenAI Whisper
      const transcription = await this.openai.audio.transcriptions.create({
        file: audioFile,
        model: 'whisper-1', // Using whisper-1 model (gpt-4o-transcribe might not be available yet)
        language: this.config.languageCode,
        response_format: this.config.responseFormat,
        temperature: this.config.temperature,
        prompt: this.config.enableAutomaticPunctuation 
          ? "Please include proper punctuation and formatting." 
          : undefined
      });

      this.processTranscriptionResult(transcription);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('Whisper API Error:', error);
      this.onErrorCallback?.(errorMessage);
    }
  }

  private processTranscriptionResult(result: any): void {
    const now = Date.now();

    if (this.config.responseFormat === 'verbose_json' && result.segments) {
      // Process segments with timestamps
      result.segments.forEach((segment: any, index: number) => {
        const speakerName = this.config.enableSpeakerDiarization 
          ? this.assignSpeaker(segment.text, segment.start)
          : 'Speaker 1';

        this.onTranscriptionCallback?.({
          text: segment.text.trim(),
          speaker: speakerName,
          timestamp: now,
          confidence: 0.95, // Whisper doesn't provide confidence scores, using high default
          startTime: Math.floor(segment.start * 1000),
          endTime: Math.floor(segment.end * 1000)
        });
      });
    } else {
      // Simple text response
      const text = typeof result === 'string' ? result : result.text;
      if (text && text.trim()) {
        const speakerName = this.config.enableSpeakerDiarization 
          ? this.assignSpeaker(text, 0)
          : 'Speaker 1';

        this.onTranscriptionCallback?.({
          text: text.trim(),
          speaker: speakerName,
          timestamp: now,
          confidence: 0.95,
          startTime: 0,
          endTime: 0
        });
      }
    }
  }

  // Simple speaker diarization simulation
  // Note: OpenAI Whisper doesn't natively support speaker diarization
  // For true speaker diarization, you'd need to use additional libraries like pyannote-audio
  private assignSpeaker(text: string, startTime: number): string {
    // Simple heuristic: assign speakers based on text patterns or timing
    // This is a basic implementation - real speaker diarization requires more sophisticated analysis
    
    // Check for speaker change indicators (long pauses, question/answer patterns, etc.)
    const isNewSpeaker = this.detectSpeakerChange(text, startTime);
    
    if (isNewSpeaker && this.speakerCounter < 6) {
      this.speakerCounter++;
    }

    return `Speaker ${Math.min(this.speakerCounter, 6)}`;
  }

  private detectSpeakerChange(text: string, startTime: number): boolean {
    // Simple heuristics for speaker change detection
    const questionIndicators = ['?', 'what', 'how', 'when', 'where', 'why', 'who'];
    const responseIndicators = ['yes', 'no', 'well', 'actually', 'I think', 'in my opinion'];
    
    const textLower = text.toLowerCase();
    
    // Check if text contains question indicators followed by response indicators in next segment
    const hasQuestion = questionIndicators.some(indicator => textLower.includes(indicator));
    const hasResponse = responseIndicators.some(indicator => textLower.includes(indicator));
    
    // Simple logic: alternate speakers for questions and responses
    return hasQuestion || hasResponse;
  }

  isCurrentlyRecording(): boolean {
    return this.isRecording;
  }

  updateConfig(newConfig: Partial<SpeechRecognitionConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  getConfig(): SpeechRecognitionConfig {
    return { ...this.config };
  }
}

export default SpeechToTextService;