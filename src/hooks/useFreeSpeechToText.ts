import { useState, useCallback, useRef, useEffect } from 'react';
import FreeSpeechToTextService, { TranscriptionSegment, SpeechRecognitionConfig } from '../../backend/services/freeSpeechToTextService';

export type SpeechProvider = 'web-speech-api' | 'openai-whisper' | 'assemblyai';

export interface UseSpeechToTextOptions {
  provider?: SpeechProvider;
  config?: Partial<SpeechRecognitionConfig>;
  onTranscription?: (segment: TranscriptionSegment) => void;
  onError?: (error: string) => void;
}

export interface UseSpeechToTextReturn {
  transcription: TranscriptionSegment[];
  isRecording: boolean;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  clearTranscription: () => void;
  error: string | null;
  isSupported: boolean;
  provider: SpeechProvider;
  switchProvider: (newProvider: SpeechProvider) => void;
  supportedProviders: { id: SpeechProvider; name: string; free: boolean; description: string }[];
}

export const useFreeSpeechToText = (options: UseSpeechToTextOptions = {}): UseSpeechToTextReturn => {
  const [transcription, setTranscription] = useState<TranscriptionSegment[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [provider, setProvider] = useState<SpeechProvider>(options.provider || 'web-speech-api');
  
  const serviceRef = useRef<FreeSpeechToTextService | null>(null);

  // Available speech-to-text providers
  const supportedProviders = [
    {
      id: 'web-speech-api' as SpeechProvider,
      name: 'Web Speech API',
      free: true,
      description: 'Browser native API - completely free, works offline'
    },
    {
      id: 'openai-whisper' as SpeechProvider,
      name: 'OpenAI Whisper',
      free: false,
      description: 'High accuracy AI - $0.006/minute'
    },
    {
      id: 'assemblyai' as SpeechProvider,
      name: 'AssemblyAI',
      free: true,
      description: 'Free tier: 5 hours/month, then $0.37/hour'
    }
  ];

  // Check if the current provider is supported
  const isSupported = provider === 'web-speech-api' 
    ? FreeSpeechToTextService.isSupported()
    : true; // Other providers can be checked here

  // Initialize the service based on provider
  useEffect(() => {
    if (provider === 'web-speech-api' && isSupported) {
      try {
        serviceRef.current = new FreeSpeechToTextService(options.config);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to initialize speech service');
      }
    }
    
    return () => {
      if (serviceRef.current?.isCurrentlyRecording()) {
        serviceRef.current.stopRecording();
      }
    };
  }, [provider, options.config, isSupported]);

  const handleTranscription = useCallback((segment: TranscriptionSegment) => {
    setTranscription(prev => {
      // For interim results, update the last segment if it's not final
      if (!segment.isFinal && prev.length > 0 && !prev[prev.length - 1].isFinal) {
        const newTranscription = [...prev];
        newTranscription[newTranscription.length - 1] = segment;
        return newTranscription;
      }
      // For final results, add as new segment
      return [...prev, segment];
    });
    options.onTranscription?.(segment);
  }, [options.onTranscription]);

  const handleError = useCallback((errorMessage: string) => {
    setError(errorMessage);
    setIsRecording(false);
    options.onError?.(errorMessage);
  }, [options.onError]);

  const startRecording = useCallback(async () => {
    if (!serviceRef.current || !isSupported) {
      const errorMsg = !isSupported 
        ? `${supportedProviders.find(p => p.id === provider)?.name} is not supported in this browser`
        : 'Speech service not initialized';
      handleError(errorMsg);
      return;
    }

    try {
      setError(null);
      setIsRecording(true);
      await serviceRef.current.startRecording(handleTranscription, handleError);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to start recording';
      handleError(errorMessage);
    }
  }, [handleTranscription, handleError, isSupported, provider, supportedProviders]);

  const stopRecording = useCallback(() => {
    if (serviceRef.current) {
      serviceRef.current.stopRecording();
      setIsRecording(false);
    }
  }, []);

  const clearTranscription = useCallback(() => {
    setTranscription([]);
    setError(null);
  }, []);

  const switchProvider = useCallback((newProvider: SpeechProvider) => {
    if (isRecording) {
      stopRecording();
    }
    setProvider(newProvider);
    setError(null);
    clearTranscription();
  }, [isRecording, stopRecording, clearTranscription]);

  return {
    transcription,
    isRecording,
    startRecording,
    stopRecording,
    clearTranscription,
    error,
    isSupported,
    provider,
    switchProvider,
    supportedProviders
  };
};