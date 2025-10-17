import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Mic, FileText, CheckSquare, Calendar, Share2, Brain, MessageSquare, TrendingUp } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: Mic,
      title: "Real-Time Transcription (ASR)",
      description: "Converts live speech to text with speaker recognition and voice activity detection. Powered by Whisper AI for industry-leading accuracy.",
    },
    {
      icon: FileText,
      title: "Smart Summaries",
      description: "Automatically generates concise and contextual meeting notes, highlighting key decisions, discussions, and outcomes.",
    },
    {
      icon: CheckSquare,
      title: "Action Item Extraction",
      description: "Detects tasks, assigns owners, and identifies deadlines automatically. Never miss a follow-up again.",
    },
    {
      icon: MessageSquare,
      title: "Conversational Summary Chatbot",
      description: "Ask questions like 'What did John agree to deliver?' and get instant, context-based answers using RAG technology.",
    },
    {
      icon: Calendar,
      title: "Calendar Sync",
      description: "Integrates seamlessly with Google Calendar and Microsoft Outlook. Automatically schedule follow-ups and reminders.",
    },
    {
      icon: Share2,
      title: "Team Integrations",
      description: "Send summaries and tasks directly to Slack, Microsoft Teams, Jira, Trello, or Asana with one click.",
    },
    {
      icon: Brain,
      title: "Sentiment & Entity Analysis",
      description: "Highlights emotional tone and mentions of people, projects, or deadlines for better context understanding.",
    },
    {
      icon: TrendingUp,
      title: "Analytics & Insights",
      description: "Track meeting patterns, team productivity, and action item completion rates over time.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Powerful <span className="gradient-text">Features</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to transform conversations into actionable insights
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-20">
            {features.map((feature, index) => (
              <div
                key={index}
                className="glass-card p-8 rounded-2xl hover:glow-effect transition-all duration-300 group"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-primary glow-effect mb-6 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <feature.icon className="w-7 h-7 text-background" />
                </div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Highlight Block */}
          <div className="glass-card p-12 rounded-3xl glow-effect-strong">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Ask Your Meeting,<br />
                  <span className="gradient-text">Not Your Teammates</span>
                </h2>
                <p className="text-muted-foreground mb-6">
                  Our conversational chatbot uses advanced Retrieval-Augmented Generation (RAG) to answer questions directly from your meeting transcripts.
                </p>
                <ul className="space-y-3">
                  {[
                    "Instant doubt clarification",
                    "Quick retrieval of action items",
                    "Identify task owners and deadlines",
                    "Find unresolved topics",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary glow-effect" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="glass-card p-6 rounded-2xl border-primary/50">
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-primary flex-shrink-0" />
                    <div className="glass-card p-3 rounded-xl flex-1">
                      <p className="text-sm">Who owns the design task?</p>
                    </div>
                  </div>
                  <div className="flex gap-3 justify-end">
                    <div className="glass-card p-3 rounded-xl flex-1 bg-primary/10">
                      <p className="text-sm">Sarah agreed to handle the design. She'll deliver mockups by Friday.</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gradient-accent flex-shrink-0" />
                  </div>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-primary flex-shrink-0" />
                    <div className="glass-card p-3 rounded-xl flex-1">
                      <p className="text-sm">What was decided about the budget?</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Features;
