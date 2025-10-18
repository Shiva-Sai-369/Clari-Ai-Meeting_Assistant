import { useState, useCallback, useRef, useEffect } from 'react';
import SpeechToTextService, { TranscriptionSegment, SpeechRecognitionConfig } from '../../backend/services/speechToTextService';

export interface UseSpeechToTextOptions {
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
}

export const useSpeechToText = (options: UseSpeechToTextOptions = {}): UseSpeechToTextReturn => {
  const [transcription, setTranscription] = useState<TranscriptionSegment[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const serviceRef = useRef<SpeechToTextService | null>(null);

  // Check if the browser supports the required APIs
  const isSupported = !!(
    navigator.mediaDevices && 
    navigator.mediaDevices.getUserMedia && 
    window.MediaRecorder
  );

  // Initialize the service
  useEffect(() => {
    if (isSupported) {
      serviceRef.current = new SpeechToTextService(options.config);
    }
    
    return () => {
      if (serviceRef.current?.isCurrentlyRecording()) {
        serviceRef.current.stopRecording();
      }
    };
  }, [options.config, isSupported]);

  const handleTranscription = useCallback((segment: TranscriptionSegment) => {
    setTranscription(prev => [...prev, segment]);
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
        ? 'Speech recognition is not supported in this browser'
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
  }, [handleTranscription, handleError, isSupported]);

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

  return {
    transcription,
    isRecording,
    startRecording,
    stopRecording,
    clearTranscription,
    error,
    isSupported
  };
};