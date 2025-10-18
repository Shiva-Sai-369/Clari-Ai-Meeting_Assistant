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
} from "lucide-react";
import { useSpeechToText } from "../hooks/useSpeechToText";
import { TranscriptionSegment } from "../../backend/services/speechToTextService";

interface SpeechToTextProps {
  onTranscriptionUpdate?: (segments: TranscriptionSegment[]) => void;
  className?: string;
}

const SpeechToTextComponent: React.FC<SpeechToTextProps> = ({
  onTranscriptionUpdate,
  className = "",
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const [config, setConfig] = useState({
    enableSpeakerDiarization: true,
    languageCode: "en",
    enableAutomaticPunctuation: true,
    profanityFilter: false,
    responseFormat: "verbose_json" as const,
    temperature: 0,
  });

  const {
    transcription,
    isRecording,
    startRecording,
    stopRecording,
    clearTranscription,
    error,
    isSupported,
  } = useSpeechToText({
    config,
    onError: (error) => console.error("Speech recognition error:", error),
  });

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

  const formatDuration = (startTime: number, endTime: number) => {
    if (!startTime || !endTime) return "";
    const duration = (endTime - startTime) / 1000;
    return `${duration.toFixed(1)}s`;
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
    const exportData = transcription.map((segment) => ({
      timestamp: formatTime(segment.timestamp),
      speaker: segment.speaker,
      text: segment.text,
      confidence: (segment.confidence * 100).toFixed(1) + "%",
      duration: formatDuration(segment.startTime, segment.endTime),
    }));

    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transcription-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!isSupported) {
    return (
      <Alert className={className}>
        <AlertDescription>
          Speech recognition is not supported in this browser. Please use a
          modern browser like Chrome, Firefox, or Safari.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Control Panel */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Mic className="h-5 w-5" />
              OpenAI Whisper Speech Recognition
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
              onClick={isRecording ? stopRecording : startRecording}
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
            {isRecording && (
              <div className="flex items-center gap-2 text-red-500">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                Recording...
              </div>
            )}
          </div>

          {/* Status */}
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              Speaker Diarization:{" "}
              {config.enableSpeakerDiarization ? "Enabled" : "Disabled"}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              Segments: {transcription.length}
            </div>
          </div>

          {/* Settings Panel */}
          {showSettings && (
            <>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="speaker-diarization">
                      Speaker Diarization
                    </Label>
                    <Switch
                      id="speaker-diarization"
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
                    <Label htmlFor="punctuation">Auto Punctuation</Label>
                    <Switch
                      id="punctuation"
                      checked={config.enableAutomaticPunctuation}
                      onCheckedChange={(checked) =>
                        setConfig((prev) => ({
                          ...prev,
                          enableAutomaticPunctuation: checked,
                        }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="profanity">Profanity Filter</Label>
                    <Switch
                      id="profanity"
                      checked={config.profanityFilter}
                      onCheckedChange={(checked) =>
                        setConfig((prev) => ({
                          ...prev,
                          profanityFilter: checked,
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
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                        <SelectItem value="it">Italian</SelectItem>
                        <SelectItem value="pt">Portuguese</SelectItem>
                        <SelectItem value="ja">Japanese</SelectItem>
                        <SelectItem value="ko">Korean</SelectItem>
                        <SelectItem value="zh">Chinese</SelectItem>
                        <SelectItem value="ru">Russian</SelectItem>
                        <SelectItem value="ar">Arabic</SelectItem>
                        <SelectItem value="hi">Hindi</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="response-format">Response Format</Label>
                    <Select
                      value={config.responseFormat}
                      onValueChange={(value: any) =>
                        setConfig((prev) => ({
                          ...prev,
                          responseFormat: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="verbose_json">
                          Verbose JSON (with timestamps)
                        </SelectItem>
                        <SelectItem value="json">JSON</SelectItem>
                        <SelectItem value="text">Plain Text</SelectItem>
                        <SelectItem value="srt">SRT Subtitles</SelectItem>
                        <SelectItem value="vtt">VTT Subtitles</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="temperature">
                      Temperature: {config.temperature}
                    </Label>
                    <input
                      type="range"
                      id="temperature"
                      min="0"
                      max="1"
                      step="0.1"
                      value={config.temperature}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          temperature: parseFloat(e.target.value),
                        }))
                      }
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Deterministic</span>
                      <span>Creative</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Error Display */}
          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">
                {error}
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
                  : "Click 'Start' to begin speech recognition."}
              </div>
            ) : (
              <div className="space-y-3">
                {transcription.map((segment, index) => (
                  <div key={index} className="border rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge className={getSpeakerColor(segment.speaker)}>
                          {segment.speaker}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatTime(segment.timestamp)}
                        </span>
                        {segment.startTime && segment.endTime && (
                          <span className="text-xs text-muted-foreground">
                            (
                            {formatDuration(segment.startTime, segment.endTime)}
                            )
                          </span>
                        )}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {(segment.confidence * 100).toFixed(1)}% confidence
                      </Badge>
                    </div>
                    <p className="text-sm leading-relaxed">{segment.text}</p>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default SpeechToTextComponent;
