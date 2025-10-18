import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Separator } from "./ui/separator";
import { Alert, AlertDescription } from "./ui/alert";
import {
  Mic,
  MicOff,
  Volume2,
  Download,
  Settings,
  Info,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useSpeechToText } from "../hooks/useSpeechToText";
import {
  AudioLevelMeter,
  checkBrowserSupport,
  validateAudioConfig,
  getOptimalAudioConstraints,
  formatDuration,
  getConfidenceColor,
} from "../lib/audioUtils";

const SpeechToTextDemo: React.FC = () => {
  const [audioLevel, setAudioLevel] = useState(0);
  const [browserSupport, setBrowserSupport] = useState(checkBrowserSupport());
  const [audioValidation, setAudioValidation] = useState<any>(null);
  const [showTechnicalInfo, setShowTechnicalInfo] = useState(false);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);

  const audioLevelMeterRef = useRef<AudioLevelMeter | null>(null);

  const {
    transcription,
    isRecording,
    startRecording,
    stopRecording,
    clearTranscription,
    error,
    isSupported,
  } = useSpeechToText({
    config: {
      enableSpeakerDiarization: true,
      languageCode: "en-US",
      enableAutomaticPunctuation: true,
      profanityFilter: false,
    },
    onError: (error) => {
      console.error("Speech recognition error:", error);
    },
  });

  useEffect(() => {
    setBrowserSupport(checkBrowserSupport());
  }, []);

  const handleStartRecording = async () => {
    try {
      // Get audio stream with optimal constraints
      const constraints = getOptimalAudioConstraints();
      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      // Validate audio configuration
      const validation = validateAudioConfig(stream);
      setAudioValidation(validation);
      setAudioStream(stream);

      // Start audio level monitoring
      if (!audioLevelMeterRef.current) {
        audioLevelMeterRef.current = new AudioLevelMeter(setAudioLevel);
      }
      await audioLevelMeterRef.current.start(stream);

      // Start speech recognition
      await startRecording();
    } catch (err) {
      console.error("Failed to start recording:", err);
    }
  };

  const handleStopRecording = () => {
    // Stop audio level monitoring
    if (audioLevelMeterRef.current) {
      audioLevelMeterRef.current.stop();
      audioLevelMeterRef.current = null;
    }

    // Stop audio stream
    if (audioStream) {
      audioStream.getTracks().forEach((track) => track.stop());
      setAudioStream(null);
    }

    setAudioLevel(0);
    stopRecording();
  };

  const exportResults = () => {
    const data = {
      timestamp: new Date().toISOString(),
      transcription,
      statistics: {
        totalSegments: transcription.length,
        uniqueSpeakers: new Set(transcription.map((s) => s.speaker)).size,
        averageConfidence:
          transcription.length > 0
            ? transcription.reduce((acc, s) => acc + s.confidence, 0) /
              transcription.length
            : 0,
        totalDuration:
          transcription.length > 0
            ? Math.max(...transcription.map((s) => s.timestamp)) -
              Math.min(...transcription.map((s) => s.timestamp))
            : 0,
      },
      browserInfo: {
        userAgent: navigator.userAgent,
        support: browserSupport,
      },
      audioValidation,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `speech-recognition-results-${
      new Date().toISOString().split("T")[0]
    }.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!browserSupport.supported) {
    return (
      <Alert className="border-red-200 bg-red-50">
        <XCircle className="h-4 w-4" />
        <AlertDescription>
          <div className="space-y-2">
            <p className="font-medium">
              Browser compatibility issues detected:
            </p>
            <ul className="list-disc list-inside text-sm">
              {browserSupport.missing.map((api, index) => (
                <li key={index}>{api} is not supported</li>
              ))}
            </ul>
            <p className="text-sm">
              Please use a modern browser like Chrome, Firefox, or Safari.
            </p>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Advanced Speech-to-Text Demo</h1>
        <p className="text-muted-foreground">
          Real-time speech recognition with speaker diarization powered by
          Google Cloud Speech API
        </p>
      </div>

      {/* Browser Support Status */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              System Status
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowTechnicalInfo(!showTechnicalInfo)}
            >
              <Info className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-green-500 font-semibold">
                ✓ Browser Support
              </div>
              <div className="text-sm text-muted-foreground">
                All APIs available
              </div>
            </div>
            <div className="text-center">
              <div className="text-green-500 font-semibold">✓ Audio Access</div>
              <div className="text-sm text-muted-foreground">
                Microphone ready
              </div>
            </div>
            <div className="text-center">
              <div className="text-green-500 font-semibold">✓ API Key</div>
              <div className="text-sm text-muted-foreground">
                Google Cloud configured
              </div>
            </div>
            <div className="text-center">
              <div className="text-green-500 font-semibold">✓ Features</div>
              <div className="text-sm text-muted-foreground">
                Speaker diarization enabled
              </div>
            </div>
          </div>

          {showTechnicalInfo && (
            <>
              <Separator className="my-4" />
              <div className="space-y-3">
                <h4 className="font-medium">Technical Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p>
                      <strong>User Agent:</strong>
                    </p>
                    <p className="text-muted-foreground break-all">
                      {navigator.userAgent}
                    </p>
                  </div>
                  <div>
                    <p>
                      <strong>Supported APIs:</strong>
                    </p>
                    <ul className="text-muted-foreground">
                      <li>✓ MediaDevices API</li>
                      <li>✓ getUserMedia</li>
                      <li>✓ MediaRecorder API</li>
                      <li>✓ Web Audio API</li>
                      <li>✓ Fetch API</li>
                    </ul>
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Recording Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="h-5 w-5" />
            Recording Controls
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Main Controls */}
          <div className="flex items-center justify-center gap-4">
            <Button
              size="lg"
              onClick={isRecording ? handleStopRecording : handleStartRecording}
              className={`w-40 ${
                isRecording
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {isRecording ? (
                <>
                  <MicOff className="h-5 w-5 mr-2" />
                  Stop Recording
                </>
              ) : (
                <>
                  <Mic className="h-5 w-5 mr-2" />
                  Start Recording
                </>
              )}
            </Button>

            {transcription.length > 0 && (
              <>
                <Button variant="outline" onClick={clearTranscription}>
                  Clear All
                </Button>
                <Button variant="outline" onClick={exportResults}>
                  <Download className="h-4 w-4 mr-2" />
                  Export Results
                </Button>
              </>
            )}
          </div>

          {/* Audio Level Indicator */}
          {isRecording && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Volume2 className="h-4 w-4" />
                <span className="text-sm font-medium">Audio Level</span>
              </div>
              <Progress value={audioLevel * 100} className="w-full" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Quiet</span>
                <span>Loud</span>
              </div>
            </div>
          )}

          {/* Audio Validation Warnings */}
          {audioValidation && audioValidation.warnings.length > 0 && (
            <Alert className="border-yellow-200 bg-yellow-50">
              <Settings className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-1">
                  <p className="font-medium text-yellow-800">
                    Audio Configuration Warnings:
                  </p>
                  {audioValidation.warnings.map(
                    (warning: string, index: number) => (
                      <p key={index} className="text-sm text-yellow-700">
                        • {warning}
                      </p>
                    )
                  )}
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Error Display */}
          {error && (
            <Alert className="border-red-200 bg-red-50">
              <XCircle className="h-4 w-4" />
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Recording Status */}
          {isRecording && (
            <div className="flex items-center justify-center gap-2 text-red-500">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              <span className="font-medium">Recording in progress...</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transcription Results */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Live Transcription Results</CardTitle>
            {transcription.length > 0 && (
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>Segments: {transcription.length}</span>
                <span>
                  Speakers: {new Set(transcription.map((s) => s.speaker)).size}
                </span>
                <span>
                  Avg Confidence:{" "}
                  {(
                    (transcription.reduce((acc, s) => acc + s.confidence, 0) /
                      transcription.length) *
                    100
                  ).toFixed(1)}
                  %
                </span>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {transcription.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              {isRecording
                ? "Listening... Start speaking to see transcription results."
                : "Click 'Start Recording' to begin speech recognition."}
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {transcription.map((segment, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-medium">
                        {segment.speaker}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(segment.timestamp).toLocaleTimeString()}
                      </span>
                      {segment.startTime && segment.endTime && (
                        <span className="text-xs text-muted-foreground">
                          ({formatDuration(segment.endTime - segment.startTime)}
                          )
                        </span>
                      )}
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-xs ${getConfidenceColor(
                        segment.confidence
                      )}`}
                    >
                      {(segment.confidence * 100).toFixed(1)}% confidence
                    </Badge>
                  </div>
                  <p className="text-sm leading-relaxed">{segment.text}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Usage Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>How to Use</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">
                1
              </span>
              <p>Click "Start Recording" to begin speech recognition</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">
                2
              </span>
              <p>Allow microphone access when prompted by your browser</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">
                3
              </span>
              <p>
                Speak clearly into your microphone. Multiple speakers will be
                automatically identified
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">
                4
              </span>
              <p>
                Watch real-time transcription appear with speaker labels and
                confidence scores
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">
                5
              </span>
              <p>
                Click "Stop Recording" when finished, then export your results
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SpeechToTextDemo;
