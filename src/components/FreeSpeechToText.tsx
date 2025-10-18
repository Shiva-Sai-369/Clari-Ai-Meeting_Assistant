import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Alert, AlertDescription } from "./ui/alert";
import {
  Mic,
  MicOff,
  Download,
  Trash2,
  Settings,
  Users,
  Clock,
  Zap,
  DollarSign,
  CheckCircle,
} from "lucide-react";
import {
  useFreeSpeechToText,
  SpeechProvider,
} from "../hooks/useFreeSpeechToText";
import FreeSpeechToTextService, {
  TranscriptionSegment,
} from "../../backend/services/freeSpeechToTextService";

interface FreeSpeechToTextProps {
  onTranscriptionUpdate?: (segments: TranscriptionSegment[]) => void;
  className?: string;
}

const FreeSpeechToTextComponent: React.FC<FreeSpeechToTextProps> = ({
  onTranscriptionUpdate,
  className = "",
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<
    "unknown" | "granted" | "denied" | "prompt"
  >("unknown");
  const [showPermissionGuide, setShowPermissionGuide] = useState(false);
  const [config, setConfig] = useState({
    enableSpeakerDiarization: true,
    languageCode: "en-US",
    enableAutomaticPunctuation: true,
    continuous: true,
    interimResults: true,
    maxAlternatives: 1,
  });

  const {
    transcription,
    isRecording,
    startRecording,
    stopRecording,
    clearTranscription,
    error,
    isSupported,
    provider,
    switchProvider,
    supportedProviders,
  } = useFreeSpeechToText({
    provider: "web-speech-api",
    config,
    onError: (error) => {
      console.error("Speech recognition error:", error);
      if (
        error.includes("microphone") ||
        error.includes("permission") ||
        error.includes("not-allowed")
      ) {
        setPermissionStatus("denied");
        setShowPermissionGuide(true);
      }
    },
  });

  // Check microphone permission on component mount
  useEffect(() => {
    const checkMicrophonePermission = async () => {
      try {
        if (navigator.permissions) {
          const permission = await navigator.permissions.query({
            name: "microphone" as PermissionName,
          });
          setPermissionStatus(permission.state);

          permission.addEventListener("change", () => {
            setPermissionStatus(permission.state);
            if (permission.state === "granted") {
              setShowPermissionGuide(false);
            }
          });
        }
      } catch (error) {
        console.log("Permission API not supported");
      }
    };

    checkMicrophonePermission();
  }, []);

  const handleStartRecording = async () => {
    try {
      await startRecording();
      setPermissionStatus("granted");
      setShowPermissionGuide(false);
    } catch (error) {
      console.error("Failed to start recording:", error);
      setPermissionStatus("denied");
      setShowPermissionGuide(true);
    }
  };

  useEffect(() => {
    onTranscriptionUpdate?.(transcription);
  }, [transcription, onTranscriptionUpdate]);

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const getSpeakerColor = (speaker: string) => {
    const colors = [
      "bg-blue-100 text-blue-800",
      "bg-green-100 text-green-800",
      "bg-purple-100 text-purple-800",
      "bg-orange-100 text-orange-800",
      "bg-pink-100 text-pink-800",
      "bg-indigo-100 text-indigo-800",
    ];
    const speakerNumber = parseInt(speaker.replace(/\D/g, "")) || 1;
    return colors[(speakerNumber - 1) % colors.length];
  };

  const exportTranscription = () => {
    const exportData = {
      provider,
      timestamp: new Date().toISOString(),
      transcription: transcription.map((segment) => ({
        timestamp: formatTime(segment.timestamp),
        speaker: segment.speaker,
        text: segment.text,
        confidence: (segment.confidence * 100).toFixed(1) + "%",
        isFinal: segment.isFinal,
      })),
      statistics: {
        totalSegments: transcription.length,
        finalSegments: transcription.filter((s) => s.isFinal).length,
        uniqueSpeakers: new Set(transcription.map((s) => s.speaker)).size,
        averageConfidence:
          transcription.length > 0
            ? (
                (transcription.reduce((acc, s) => acc + s.confidence, 0) /
                  transcription.length) *
                100
              ).toFixed(1) + "%"
            : "0%",
      },
    };

    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `free-transcription-${
      new Date().toISOString().split("T")[0]
    }.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!isSupported) {
    return (
      <Alert className={`${className} border-red-200 bg-red-50`}>
        <AlertDescription>
          <div className="space-y-2">
            <p className="font-medium text-red-800">
              Browser Compatibility Issue:
            </p>
            <p className="text-red-700">
              The Web Speech API is not supported in this browser. Please use
              Chrome, Edge, or Safari for the best experience.
            </p>
            <p className="text-sm text-red-600">
              Alternatively, you can switch to a different provider in the
              settings.
            </p>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  // Permission Guide Component
  const PermissionGuide = () => (
    <Alert className="border-orange-200 bg-orange-50">
      <Mic className="h-4 w-4" />
      <AlertDescription>
        <div className="space-y-3">
          <p className="font-medium text-orange-800">
            🎤 Microphone Access Required
          </p>
          <p className="text-orange-700">
            This page needs microphone permission to transcribe your speech.
          </p>
          <div className="space-y-2 text-sm text-orange-600">
            <p className="font-medium">How to enable microphone access:</p>
            <div className="ml-4 space-y-1">
              <p>
                • Click the 🔒 lock icon or 🎤 microphone icon in your address
                bar
              </p>
              <p>• Set microphone to "Allow"</p>
              <p>• Refresh the page if needed</p>
            </div>
            <p className="mt-2">
              <strong>Alternative:</strong> Go to your browser Settings →
              Privacy & Security → Site Settings → Microphone and add this site
              to allowed sites.
            </p>
          </div>
          <div className="flex gap-2 mt-3">
            <Button
              size="sm"
              onClick={() => setShowPermissionGuide(false)}
              variant="outline"
            >
              I've enabled it
            </Button>
            <Button
              size="sm"
              onClick={handleStartRecording}
              className="bg-orange-600 hover:bg-orange-700"
            >
              Try again
            </Button>
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Show permission guide if needed */}
      {(showPermissionGuide || permissionStatus === "denied") && (
        <PermissionGuide />
      )}

      {/* Provider Selection & Info */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Mic className="h-5 w-5" />
              Free Speech-to-Text
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="text-green-600 border-green-200"
              >
                <DollarSign className="h-3 w-3 mr-1" />
                FREE
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Provider Selection */}
          <div className="space-y-2">
            <Label>Speech Recognition Provider</Label>
            <Select
              value={provider}
              onValueChange={(value: SpeechProvider) => switchProvider(value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {supportedProviders.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    <div className="flex items-center gap-2">
                      <span>{p.name}</span>
                      {p.free && (
                        <Badge
                          variant="outline"
                          className="text-xs text-green-600"
                        >
                          FREE
                        </Badge>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {supportedProviders.find((p) => p.id === provider)?.description}
            </p>
          </div>

          {/* Current Provider Info */}
          <div className="flex items-center gap-4 p-3 bg-green-50 rounded-lg">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div>
              <p className="font-medium text-green-800">
                {supportedProviders.find((p) => p.id === provider)?.name} Active
              </p>
              <p className="text-sm text-green-600">
                {provider === "web-speech-api"
                  ? "Browser native API - No API keys required!"
                  : "External API - Check your configuration"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Control Panel */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Recording Controls
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSettings(!showSettings)}
              >
                <Settings className="h-4 w-4" />
              </Button>
              {transcription.length > 0 && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={exportTranscription}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearTranscription}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Main Controls */}
          <div className="flex items-center justify-center gap-4">
            <Button
              size="lg"
              onClick={isRecording ? stopRecording : handleStartRecording}
              className={`w-32 ${
                isRecording
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {isRecording ? (
                <>
                  <MicOff className="h-5 w-5 mr-2" />
                  Stop
                </>
              ) : (
                <>
                  <Mic className="h-5 w-5 mr-2" />
                  Start
                </>
              )}
            </Button>
          </div>

          {/* Status */}
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              Speaker Detection:{" "}
              {config.enableSpeakerDiarization ? "Enabled" : "Disabled"}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              Segments: {transcription.length} (
              {transcription.filter((s) => s.isFinal).length} final)
            </div>
          </div>

          {/* Recording Status */}
          {isRecording && (
            <div className="flex items-center justify-center gap-2 text-green-600">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <span className="font-medium">Listening... Speak now!</span>
            </div>
          )}

          {/* Settings Panel */}
          {showSettings && (
            <>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="speaker-detection">Speaker Detection</Label>
                    <Switch
                      id="speaker-detection"
                      checked={config.enableSpeakerDiarization}
                      onCheckedChange={(checked) =>
                        setConfig((prev) => ({
                          ...prev,
                          enableSpeakerDiarization: checked,
                        }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="continuous">Continuous Recognition</Label>
                    <Switch
                      id="continuous"
                      checked={config.continuous}
                      onCheckedChange={(checked) =>
                        setConfig((prev) => ({ ...prev, continuous: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="interim">Show Interim Results</Label>
                    <Switch
                      id="interim"
                      checked={config.interimResults}
                      onCheckedChange={(checked) =>
                        setConfig((prev) => ({
                          ...prev,
                          interimResults: checked,
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <Label htmlFor="language">Language</Label>
                    <Select
                      value={config.languageCode}
                      onValueChange={(value) =>
                        setConfig((prev) => ({ ...prev, languageCode: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {FreeSpeechToTextService.getSupportedLanguages().map(
                          (lang) => (
                            <SelectItem key={lang} value={lang}>
                              {lang}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="alternatives">
                      Max Alternatives: {config.maxAlternatives}
                    </Label>
                    <input
                      type="range"
                      id="alternatives"
                      min="1"
                      max="5"
                      value={config.maxAlternatives}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          maxAlternatives: parseInt(e.target.value),
                        }))
                      }
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Error Display */}
          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">
                <div className="space-y-2">
                  <p className="font-medium">Error:</p>
                  <p>{error}</p>
                  {(error.includes("microphone") ||
                    error.includes("permission") ||
                    error.includes("not-allowed")) && (
                    <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded">
                      <p className="font-medium text-orange-800 mb-2">
                        💡 Quick Fix:
                      </p>
                      <div className="text-sm text-orange-700 space-y-1">
                        <p>1. Click the 🔒 or 🎤 icon in your address bar</p>
                        <p>2. Change microphone setting to "Allow"</p>
                        <p>3. Try the "Start" button again</p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="mt-2"
                        onClick={() => setShowPermissionGuide(true)}
                      >
                        Show detailed guide
                      </Button>
                    </div>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Transcription Display */}
      <Card>
        <CardHeader>
          <CardTitle>Live Transcription</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96 w-full">
            {transcription.length === 0 ? (
              <div className="flex items-center justify-center h-32 text-muted-foreground">
                {isRecording
                  ? "Listening... Start speaking to see transcription."
                  : "Click 'Start' to begin free speech recognition."}
              </div>
            ) : (
              <div className="space-y-3">
                {transcription.map((segment, index) => (
                  <div
                    key={index}
                    className={`border rounded-lg p-3 space-y-2 ${
                      segment.isFinal ? "" : "border-dashed bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge className={getSpeakerColor(segment.speaker)}>
                          {segment.speaker}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatTime(segment.timestamp)}
                        </span>
                        {!segment.isFinal && (
                          <Badge variant="outline" className="text-xs">
                            Interim
                          </Badge>
                        )}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {(segment.confidence * 100).toFixed(0)}% confidence
                      </Badge>
                    </div>
                    <p
                      className={`text-sm leading-relaxed ${
                        segment.isFinal ? "" : "italic text-gray-600"
                      }`}
                    >
                      {segment.text}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Usage Tips */}
      <Card>
        <CardHeader>
          <CardTitle>💡 Tips for Best Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <h4 className="font-medium">Audio Quality</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Use a quiet environment</li>
                <li>• Speak clearly and at normal pace</li>
                <li>• Keep microphone close (not too close)</li>
                <li>• Avoid background noise</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Speaker Detection</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Pause between speakers</li>
                <li>• Use questions/responses pattern</li>
                <li>• Avoid overlapping speech</li>
                <li>• Wait for "final" results</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FreeSpeechToTextComponent;
