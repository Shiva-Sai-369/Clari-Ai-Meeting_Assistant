import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SpeechToTextComponent from "@/components/SpeechToText";
import SpeechToTextDemo from "@/components/SpeechToTextDemo";
import FreeSpeechToTextComponent from "@/components/FreeSpeechToText";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Play,
  Mic,
  FileText,
  CheckSquare,
  Zap,
  Users,
  Globe,
  DollarSign,
} from "lucide-react";
import { useState } from "react";
import { TranscriptionSegment } from "../../backend/services/speechToTextService";

const Demo = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [liveTranscription, setLiveTranscription] = useState<
    TranscriptionSegment[]
  >([]);

  const handleTranscriptionUpdate = (segments: TranscriptionSegment[]) => {
    setLiveTranscription(segments);
  };

  const captions = [
    {
      speaker: "Sarah",
      text: "Let's review the Q1 roadmap priorities.",
      time: "0:00",
    },
    {
      speaker: "John",
      text: "I'll take ownership of the mobile redesign project.",
      time: "0:15",
    },
    {
      speaker: "Sarah",
      text: "Great! We need mockups by Friday.",
      time: "0:22",
    },
  ];

  const summary = {
    keyPoints: [
      "Q1 roadmap review scheduled",
      "Mobile redesign project assigned to John",
      "Design mockups deadline: Friday",
    ],
    actionItems: [
      { task: "Create mobile app mockups", owner: "John", deadline: "Friday" },
      {
        task: "Schedule follow-up review",
        owner: "Sarah",
        deadline: "Next Monday",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <div className="inline-block mb-6 px-4 py-2 rounded-full glass-card">
              <span className="text-sm font-medium gradient-text">
                Demo powered by GPT-4o Realtime API
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              See <span className="gradient-text">Clari</span> in Action
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience real-time transcription, AI summaries, and action item
              extraction
            </p>
          </div>

          {/* Demo Interface */}
          <div className="mb-12">
            <Tabs defaultValue="live-demo" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="live-demo">Live Demo</TabsTrigger>
                <TabsTrigger
                  value="free-speech"
                  className="flex items-center gap-1"
                >
                  <DollarSign className="h-3 w-3" />
                  Free Speech
                </TabsTrigger>
                <TabsTrigger value="speech-to-text">OpenAI Whisper</TabsTrigger>
                <TabsTrigger value="advanced-demo">Advanced Demo</TabsTrigger>
              </TabsList>

              <TabsContent value="live-demo" className="mt-8">
                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Meeting Screen */}
                  <div className="space-y-6">
                    <div className="glass-card p-8 rounded-2xl relative overflow-hidden">
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-primary" />

                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold">Live Meeting</h3>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-destructive animate-pulse-glow" />
                          <span className="text-sm text-muted-foreground">
                            Recording
                          </span>
                        </div>
                      </div>

                      <div className="aspect-video bg-secondary/50 rounded-xl mb-6 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
                        {!isPlaying ? (
                          <Button
                            size="lg"
                            onClick={() => setIsPlaying(true)}
                            className="bg-gradient-primary hover:opacity-90 transition-opacity glow-effect relative z-10"
                          >
                            <Play className="mr-2 w-5 h-5" /> Start Demo
                          </Button>
                        ) : (
                          <div className="flex gap-2 relative z-10">
                            {[...Array(5)].map((_, i) => (
                              <div
                                key={i}
                                className="w-3 bg-primary rounded-full animate-wave"
                                style={{
                                  height: `${40 + i * 10}px`,
                                  animationDelay: `${i * 0.1}s`,
                                }}
                              />
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Live Captions */}
                      {isPlaying && (
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 mb-4">
                            <Mic className="w-4 h-4 text-primary" />
                            <span className="text-sm font-medium">
                              Live Transcription
                            </span>
                          </div>
                          {captions.map((caption, index) => (
                            <div
                              key={index}
                              className="glass-card p-4 rounded-xl animate-fade-in"
                              style={{ animationDelay: `${index * 0.3}s` }}
                            >
                              <div className="flex items-start justify-between mb-2">
                                <span className="font-medium text-primary">
                                  {caption.speaker}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {caption.time}
                                </span>
                              </div>
                              <p className="text-sm">{caption.text}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* AI Summary Panel */}
                  <div className="space-y-6">
                    {isPlaying && (
                      <>
                        <div className="glass-card p-8 rounded-2xl animate-fade-in">
                          <div className="flex items-center gap-2 mb-6">
                            <FileText className="w-5 h-5 text-primary" />
                            <h3 className="text-xl font-bold">AI Summary</h3>
                          </div>
                          <div className="space-y-3">
                            {summary.keyPoints.map((point, index) => (
                              <div
                                key={index}
                                className="flex items-start gap-3"
                              >
                                <div className="w-2 h-2 rounded-full bg-primary glow-effect mt-2" />
                                <p className="text-muted-foreground">{point}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div
                          className="glass-card p-8 rounded-2xl animate-fade-in"
                          style={{ animationDelay: "0.3s" }}
                        >
                          <div className="flex items-center gap-2 mb-6">
                            <CheckSquare className="w-5 h-5 text-primary" />
                            <h3 className="text-xl font-bold">Action Items</h3>
                          </div>
                          <div className="space-y-4">
                            {summary.actionItems.map((item, index) => (
                              <div
                                key={index}
                                className="glass-card p-4 rounded-xl border-l-2 border-primary"
                              >
                                <p className="font-medium mb-2">{item.task}</p>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <span>
                                    Owner:{" "}
                                    <span className="text-foreground">
                                      {item.owner}
                                    </span>
                                  </span>
                                  <span>
                                    Due:{" "}
                                    <span className="text-foreground">
                                      {item.deadline}
                                    </span>
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </TabsContent>

              {/* Free Speech Tab */}
              <TabsContent value="free-speech" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-green-600" />
                      Free Speech-to-Text
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-800 border-green-200"
                      >
                        100% Free
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      Browser-native speech recognition with no API costs.
                      Perfect for testing and development.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FreeSpeechToTextComponent />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="speech-to-text" className="mt-8">
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold mb-4">
                      Live Speech-to-Text with OpenAI Whisper
                    </h3>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                      Powered by OpenAI Whisper API. Experience high-quality
                      transcription with advanced AI capabilities and
                      multi-language support.
                    </p>
                  </div>

                  <div className="grid lg:grid-cols-3 gap-6 mb-8">
                    <Card className="glass-card">
                      <CardHeader className="text-center">
                        <Zap className="h-12 w-12 text-primary mx-auto mb-2" />
                        <CardTitle>AI-Powered Accuracy</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground text-center">
                          State-of-the-art AI transcription with exceptional
                          accuracy and context understanding
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="glass-card">
                      <CardHeader className="text-center">
                        <Users className="h-12 w-12 text-primary mx-auto mb-2" />
                        <CardTitle>Multi-Speaker Support</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground text-center">
                          Advanced speaker identification with intelligent
                          conversation flow detection
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="glass-card">
                      <CardHeader className="text-center">
                        <Globe className="h-12 w-12 text-primary mx-auto mb-2" />
                        <CardTitle>99+ Languages</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground text-center">
                          Support for 99+ languages with world-class accuracy
                          and automatic language detection
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  <SpeechToTextComponent
                    onTranscriptionUpdate={handleTranscriptionUpdate}
                    className="max-w-4xl mx-auto"
                  />

                  {liveTranscription.length > 0 && (
                    <Card className="glass-card max-w-4xl mx-auto">
                      <CardHeader>
                        <CardTitle>Live Transcription Summary</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">
                            Total segments: {liveTranscription.length}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Unique speakers:{" "}
                            {
                              new Set(liveTranscription.map((s) => s.speaker))
                                .size
                            }
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Average confidence:{" "}
                            {liveTranscription.length > 0
                              ? (
                                  (liveTranscription.reduce(
                                    (acc, s) => acc + s.confidence,
                                    0
                                  ) /
                                    liveTranscription.length) *
                                  100
                                ).toFixed(1)
                              : 0}
                            %
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="advanced-demo" className="mt-8">
                <SpeechToTextDemo />
              </TabsContent>
            </Tabs>
          </div>

          {/* CTA */}
          <div className="text-center glass-card p-12 rounded-3xl glow-effect">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Transform Your Meetings?
            </h2>
            <p className="text-muted-foreground mb-6">
              Experience the full power of AI-driven meeting assistance
            </p>
            <Button
              size="lg"
              className="bg-gradient-primary hover:opacity-90 transition-opacity glow-effect"
            >
              Start Free Trial
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Demo;
