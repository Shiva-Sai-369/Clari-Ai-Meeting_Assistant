/**
 * Free Speech-to-Text Service using Web Speech API
 * This is completely free and works directly in the browser
 */

export interface TranscriptionSegment {
  text: string;
  speaker: string;
  timestamp: number;
  confidence: number;
  startTime: number;
  endTime: number;
  isFinal: boolean;
}

export interface SpeechRecognitionConfig {
  enableSpeakerDiarization: boolean;
  languageCode: string;
  enableAutomaticPunctuation: boolean;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
}

// Extend Window interface for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

class FreeSpeechToTextService {
  private recognition: any = null;
  private isRecording = false;
  private config: SpeechRecognitionConfig;
  private onTranscriptionCallback?: (segment: TranscriptionSegment) => void;
  private onErrorCallback?: (error: string) => void;
  private speakerCounter = 1;
  private lastSpeakerChangeTime = 0;
  private currentTranscript = '';

  constructor(config: Partial<SpeechRecognitionConfig> = {}) {
    this.config = {
      enableSpeakerDiarization: true,
      languageCode: 'en-US',
      enableAutomaticPunctuation: true,
      continuous: true,
      interimResults: true,
      maxAlternatives: 1,
      ...config
    };

    this.initializeSpeechRecognition();
  }

  private initializeSpeechRecognition(): void {
    // Check if Web Speech API is supported
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      throw new Error('Web Speech API is not supported in this browser');
    }

    this.recognition = new SpeechRecognition();
    this.setupRecognitionConfig();
    this.setupEventHandlers();
  }

  private setupRecognitionConfig(): void {
    if (!this.recognition) return;

    this.recognition.continuous = this.config.continuous;
    this.recognition.interimResults = this.config.interimResults;
    this.recognition.lang = this.config.languageCode;
    this.recognition.maxAlternatives = this.config.maxAlternatives;
  }

  private setupEventHandlers(): void {
    if (!this.recognition) return;

    this.recognition.onstart = () => {
      console.log('Speech recognition started');
      this.isRecording = true;
    };

    this.recognition.onresult = (event: any) => {
      this.handleRecognitionResult(event);
    };

    this.recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      this.onErrorCallback?.(event.error);
      
      // Auto-restart on certain errors
      if (event.error === 'no-speech' || event.error === 'audio-capture') {
        setTimeout(() => {
          if (this.isRecording) {
            this.recognition?.start();
          }
        }, 1000);
      }
    };

    this.recognition.onend = () => {
      console.log('Speech recognition ended');
      
      // Auto-restart if we're supposed to be recording
      if (this.isRecording) {
        setTimeout(() => {
          this.recognition?.start();
        }, 100);
      }
    };
  }

  private handleRecognitionResult(event: any): void {
    const now = Date.now();
    
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const result = event.results[i];
      const transcript = result[0].transcript;
      const confidence = result[0].confidence || 0.9;
      const isFinal = result.isFinal;

      if (transcript.trim()) {
        const speaker = this.determineSpeaker(transcript, now);
        
        this.onTranscriptionCallback?.({
          text: transcript.trim(),
          speaker,
          timestamp: now,
          confidence,
          startTime: now - (transcript.length * 50), // Estimate based on text length
          endTime: now,
          isFinal
        });

        if (isFinal) {
          this.currentTranscript = '';
        } else {
          this.currentTranscript = transcript;
        }
      }
    }
  }

  private determineSpeaker(text: string, timestamp: number): string {
    if (!this.config.enableSpeakerDiarization) {
      return 'Speaker 1';
    }

    // Simple heuristics for speaker detection
    const timeSinceLastChange = timestamp - this.lastSpeakerChangeTime;
    const isNewSpeaker = this.detectSpeakerChange(text, timeSinceLastChange);

    if (isNewSpeaker && timeSinceLastChange > 2000) { // 2 second minimum between speaker changes
      this.speakerCounter = this.speakerCounter === 1 ? 2 : 1; // Toggle between 2 speakers
      this.lastSpeakerChangeTime = timestamp;
    }

    return `Speaker ${this.speakerCounter}`;
  }

  private detectSpeakerChange(text: string, timeSinceLastChange: number): boolean {
    const textLower = text.toLowerCase();
    
    // Detect speaker change indicators
    const questionWords = ['what', 'how', 'when', 'where', 'why', 'who', 'which', 'can', 'could', 'would', 'should'];
    const responseWords = ['yes', 'no', 'yeah', 'okay', 'sure', 'right', 'exactly', 'well', 'so', 'actually'];
    const changeIndicators = ['but', 'however', 'although', 'on the other hand', 'meanwhile'];

    const hasQuestion = questionWords.some(word => textLower.includes(word)) && textLower.includes('?');
    const hasResponse = responseWords.some(word => textLower.startsWith(word + ' '));
    const hasChangeIndicator = changeIndicators.some(indicator => textLower.includes(indicator));
    
    // Long pause indicator
    const hasLongPause = timeSinceLastChange > 3000;

    return hasQuestion || hasResponse || hasChangeIndicator || hasLongPause;
  }

  async startRecording(
    onTranscription: (segment: TranscriptionSegment) => void,
    onError: (error: string) => void
  ): Promise<void> {
    this.onTranscriptionCallback = onTranscription;
    this.onErrorCallback = onError;

    if (!this.recognition) {
      throw new Error('Speech recognition not initialized');
    }

    try {
      this.isRecording = true;
      this.recognition.start();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      this.onErrorCallback?.(errorMessage);
      throw new Error(`Failed to start recording: ${errorMessage}`);
    }
  }

  stopRecording(): void {
    this.isRecording = false;
    
    if (this.recognition) {
      this.recognition.stop();
    }
  }

  isCurrentlyRecording(): boolean {
    return this.isRecording;
  }

  updateConfig(newConfig: Partial<SpeechRecognitionConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.setupRecognitionConfig();
  }

  getConfig(): SpeechRecognitionConfig {
    return { ...this.config };
  }

  // Check if Web Speech API is supported
  static isSupported(): boolean {
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  }

  // Get supported languages
  static getSupportedLanguages(): string[] {
    return [
      'en-US', 'en-GB', 'en-AU', 'en-CA', 'en-IN', 'en-NZ', 'en-ZA',
      'es-ES', 'es-MX', 'es-AR', 'es-CO', 'es-CL', 'es-VE', 'es-PE',
      'fr-FR', 'fr-CA', 'fr-BE', 'fr-CH',
      'de-DE', 'de-AT', 'de-CH',
      'it-IT', 'it-CH',
      'pt-PT', 'pt-BR',
      'ru-RU',
      'ja-JP',
      'ko-KR',
      'zh-CN', 'zh-TW', 'zh-HK',
      'ar-SA', 'ar-EG',
      'hi-IN',
      'th-TH',
      'vi-VN',
      'tr-TR',
      'pl-PL',
      'nl-NL', 'nl-BE',
      'sv-SE',
      'da-DK',
      'no-NO',
      'fi-FI',
      'hu-HU',
      'cs-CZ',
      'sk-SK',
      'sl-SI',
      'hr-HR',
      'bg-BG',
      'ro-RO',
      'et-EE',
      'lv-LV',
      'lt-LT'
    ];
  }
}

export default FreeSpeechToTextService;