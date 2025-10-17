import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Mic, Brain, Rocket } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent" />
        <div className="absolute inset-0">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-primary/20 rounded-full animate-wave"
              style={{
                left: `${20 + i * 15}%`,
                bottom: "10%",
                width: "4px",
                height: `${40 + i * 20}px`,
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>

        <div className="container mx-auto max-w-5xl text-center relative z-10">
          <div className="inline-block mb-6 px-4 py-2 rounded-full glass-card">
            <span className="text-sm font-medium gradient-text">
              Powered by GPT-4o + Whisper
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            Turn Every Conversation
            <br />
            <span className="gradient-text">into Action</span>
          </h1>

          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Clari captures discussions, summarizes them, and transforms them
            into actionable insights — instantly.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/demo">
              <Button
                size="lg"
                className="bg-gradient-primary hover:opacity-90 transition-opacity glow-effect"
              >
                Try Demo <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link to="/signup">
              <Button
                size="lg"
                variant="outline"
                className="border-primary text-primary hover:bg-primary/10"
              >
                Sign Up Free
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Product Overview */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">
            How <span className="gradient-text">Clari</span> Works
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Mic,
                title: "Listen",
                description:
                  "Real-time transcription captures every word with speaker recognition and voice activity detection.",
              },
              {
                icon: Brain,
                title: "Understand",
                description:
                  "AI-powered summaries extract key points, action items, and sentiment from your discussions.",
              },
              {
                icon: Rocket,
                title: "Deliver",
                description:
                  "Send insights directly to Slack, Jira, Trello, or sync with your calendar automatically.",
              },
            ].map((step, index) => (
              <div
                key={index}
                className="glass-card p-8 rounded-2xl hover:glow-effect transition-all duration-300 group"
              >
                <div className="w-16 h-16 rounded-xl bg-gradient-primary glow-effect mb-6 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <step.icon className="w-8 h-8 text-background" />
                </div>
                <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Preview */}
      <section className="py-20 px-6 bg-secondary/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Core <span className="gradient-text">Features</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Everything you need to make meetings productive
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              "Smart Summaries",
              "Real-Time Transcription",
              "Action Item Detection",
              "Calendar Sync",
              "Slack/Trello Integration",
              "Sentiment Analysis",
            ].map((feature, index) => (
              <div
                key={index}
                className="glass-card p-6 rounded-xl hover:border-primary transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary glow-effect animate-pulse-glow" />
                  <span className="font-medium">{feature}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="glass-card p-12 rounded-3xl text-center glow-effect">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Let Your Meetings{" "}
              <span className="gradient-text">Work for You</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join teams who save hours every week with AI-powered meeting
              assistance
            </p>
            <Link to="/features">
              <Button
                size="lg"
                className="bg-gradient-primary hover:opacity-90 transition-opacity glow-effect"
              >
                Explore Features <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
