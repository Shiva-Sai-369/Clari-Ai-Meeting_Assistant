/**
 * Audio utilities for speech-to-text functionality
 */

export interface AudioValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface AudioMetrics {
  duration: number;
  sampleRate: number;
  channels: number;
  bitRate?: number;
  format: string;
}

/**
 * Validates audio configuration for optimal speech recognition
 */
export const validateAudioConfig = (stream: MediaStream): AudioValidationResult => {
  const result: AudioValidationResult = {
    isValid: true,
    errors: [],
    warnings: []
  };

  if (!stream) {
    result.isValid = false;
    result.errors.push('No audio stream provided');
    return result;
  }

  const audioTracks = stream.getAudioTracks();
  
  if (audioTracks.length === 0) {
    result.isValid = false;
    result.errors.push('No audio tracks found in stream');
    return result;
  }

  const audioTrack = audioTracks[0];
  const settings = audioTrack.getSettings();

  // Check sample rate
  if (settings.sampleRate && settings.sampleRate < 16000) {
    result.warnings.push(`Sample rate ${settings.sampleRate}Hz is below recommended 16kHz`);
  }

  // Check channel count
  if (settings.channelCount && settings.channelCount > 1) {
    result.warnings.push(`Multiple channels detected (${settings.channelCount}). Mono is recommended for speech recognition.`);
  }

  // Check if echo cancellation is enabled
  if (!settings.echoCancellation) {
    result.warnings.push('Echo cancellation is disabled. This may affect recognition accuracy.');
  }

  // Check if noise suppression is enabled
  if (!settings.noiseSuppression) {
    result.warnings.push('Noise suppression is disabled. This may affect recognition accuracy.');
  }

  return result;
};

/**
 * Gets optimal audio constraints for speech recognition
 */
export const getOptimalAudioConstraints = (): MediaStreamConstraints => {
  return {
    audio: {
      sampleRate: { ideal: 16000, min: 8000 },
      channelCount: { ideal: 1 },
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true
    }
  };
};

/**
 * Analyzes audio blob for metadata
 */
export const analyzeAudioBlob = async (blob: Blob): Promise<AudioMetrics> => {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    const url = URL.createObjectURL(blob);
    
    audio.addEventListener('loadedmetadata', () => {
      const metrics: AudioMetrics = {
        duration: audio.duration,
        sampleRate: 0, // Not directly available from Audio element
        channels: 0,   // Not directly available from Audio element
        format: blob.type
      };
      
      URL.revokeObjectURL(url);
      resolve(metrics);
    });

    audio.addEventListener('error', () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to analyze audio blob'));
    });

    audio.src = url;
  });
};

/**
 * Converts audio blob to different format if needed
 */
export const convertAudioFormat = async (
  blob: Blob, 
  targetMimeType: string = 'audio/webm'
): Promise<Blob> => {
  if (blob.type === targetMimeType) {
    return blob;
  }

  // This is a simplified conversion - in production, you might want to use
  // a more sophisticated audio conversion library
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    const url = URL.createObjectURL(blob);
    
    audio.addEventListener('canplaythrough', () => {
      // For now, we'll just return the original blob
      // In a real implementation, you'd use Web Audio API or a conversion library
      URL.revokeObjectURL(url);
      resolve(blob);
    });

    audio.addEventListener('error', () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to convert audio format'));
    });

    audio.src = url;
  });
};

/**
 * Checks if the browser supports the required Web APIs
 */
export const checkBrowserSupport = (): { supported: boolean; missing: string[] } => {
  const missing: string[] = [];

  if (!navigator.mediaDevices) {
    missing.push('MediaDevices API');
  }

  if (!navigator.mediaDevices?.getUserMedia) {
    missing.push('getUserMedia API');
  }

  if (!window.MediaRecorder) {
    missing.push('MediaRecorder API');
  }

  if (!window.AudioContext && !(window as any).webkitAudioContext) {
    missing.push('Web Audio API');
  }

  if (!window.fetch) {
    missing.push('Fetch API');
  }

  return {
    supported: missing.length === 0,
    missing
  };
};

/**
 * Measures audio levels for visual feedback
 */
export class AudioLevelMeter {
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private dataArray: Uint8Array | null = null;
  private source: MediaStreamAudioSourceNode | null = null;
  private animationId: number | null = null;

  constructor(private onLevelUpdate: (level: number) => void) {}

  async start(stream: MediaStream): Promise<void> {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.audioContext = new AudioContextClass();
      this.source = this.audioContext.createMediaStreamSource(stream);
      this.analyser = this.audioContext.createAnalyser();
      
      this.analyser.fftSize = 256;
      this.analyser.smoothingTimeConstant = 0.8;
      
      const bufferLength = this.analyser.frequencyBinCount;
      this.dataArray = new Uint8Array(bufferLength);
      this.source.connect(this.analyser);
      
      this.updateLevel();
    } catch (error: any) {
      throw new Error(`Failed to start audio level meter: ${error.message}`);
    }
  }

  stop(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }

    if (this.source) {
      this.source.disconnect();
      this.source = null;
    }

    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }

    this.analyser = null;
    this.dataArray = null;
  }

  private updateLevel = (): void => {
    if (!this.analyser || !this.dataArray) return;

    // Create a new array to avoid TypeScript issues
    const frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(frequencyData);
    
    // Calculate RMS (Root Mean Square) for better level representation
    let sum = 0;
    for (let i = 0; i < frequencyData.length; i++) {
      sum += frequencyData[i] * frequencyData[i];
    }
    
    const rms = Math.sqrt(sum / frequencyData.length);
    const level = rms / 255; // Normalize to 0-1
    
    this.onLevelUpdate(level);
    this.animationId = requestAnimationFrame(this.updateLevel);
  };
}

/**
 * Formats duration in milliseconds to human-readable string
 */
export const formatDuration = (milliseconds: number): string => {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `${hours}:${(minutes % 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
  }
  
  return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
};

/**
 * Calculates confidence score color based on value
 */
export const getConfidenceColor = (confidence: number): string => {
  if (confidence >= 0.8) return 'text-green-600';
  if (confidence >= 0.6) return 'text-yellow-600';
  return 'text-red-600';
};

/**
 * Debounce function for API calls
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};