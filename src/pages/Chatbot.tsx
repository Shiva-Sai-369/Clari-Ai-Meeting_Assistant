import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { MessageSquare, Search, Zap, Shield } from "lucide-react";

const Chatbot = () => {
  const sampleQuestions = [
    "Who owns the design task?",
    "What was decided about the budget?",
    "Summarize today's discussion on timeline",
    "What are the unresolved issues?",
    "When is the next deadline?",
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Your Meeting's Memory —<br />
              <span className="gradient-text">On Demand</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Ask questions and get instant, context-based answers from your meeting transcripts
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            {/* Chat Mockup */}
            <div className="glass-card p-8 rounded-3xl glow-effect">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-border">
                <MessageSquare className="w-5 h-5 text-primary" />
                <span className="font-semibold">Meeting Assistant</span>
                <div className="ml-auto w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-primary flex-shrink-0" />
                  <div className="glass-card p-4 rounded-2xl rounded-tl-none flex-1">
                    <p className="text-sm">Who owns the design task?</p>
                  </div>
                </div>

                <div className="flex gap-3 justify-end">
                  <div className="glass-card p-4 rounded-2xl rounded-tr-none flex-1 bg-primary/10 border-primary/20">
                    <p className="text-sm">Sarah agreed to handle the UI design. She will deliver the mockups by Friday, as discussed at 14:23 in today's meeting.</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gradient-accent flex-shrink-0" />
                </div>

                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-primary flex-shrink-0" />
                  <div className="glass-card p-4 rounded-2xl rounded-tl-none flex-1">
                    <p className="text-sm">What was the budget decision?</p>
                  </div>
                </div>

                <div className="flex gap-3 justify-end">
                  <div className="glass-card p-4 rounded-2xl rounded-tr-none flex-1 bg-primary/10 border-primary/20">
                    <p className="text-sm">The team approved a $50k budget for Q1 marketing initiatives. John will finalize the allocation by next Monday.</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gradient-accent flex-shrink-0" />
                </div>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ask about your meeting..."
                  className="flex-1 glass-card px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Button className="bg-gradient-primary hover:opacity-90 transition-opacity">
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-6">
                  Ask Your Meeting,<br />
                  <span className="gradient-text">Not Your Teammates</span>
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Our conversational chatbot uses Retrieval-Augmented Generation (RAG) to provide accurate answers based solely on your meeting data.
                </p>
              </div>

              <div className="space-y-6">
                {[
                  {
                    icon: Search,
                    title: "Instant Retrieval",
                    description: "Get answers to questions about tasks, owners, deadlines, and decisions in seconds.",
                  },
                  {
                    icon: Zap,
                    title: "Context-Aware",
                    description: "RAG ensures responses are grounded in actual meeting content, not hallucinated.",
                  },
                  {
                    icon: Shield,
                    title: "Privacy First",
                    description: "Your meeting data never leaves your control. Queries are processed securely.",
                  },
                ].map((feature, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-primary glow-effect flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-6 h-6 text-background" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground text-sm">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sample Questions */}
          <div className="glass-card p-12 rounded-3xl mb-12">
            <h2 className="text-2xl font-bold mb-8 text-center">
              Try These <span className="gradient-text">Sample Questions</span>
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sampleQuestions.map((question, index) => (
                <button
                  key={index}
                  className="glass-card p-4 rounded-xl text-left hover:border-primary transition-all group"
                >
                  <p className="text-sm group-hover:text-primary transition-colors">{question}</p>
                </button>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center glass-card p-12 rounded-3xl glow-effect">
            <h2 className="text-3xl font-bold mb-4">
              Never Ask "What Did I Miss?" Again
            </h2>
            <p className="text-muted-foreground mb-6">
              Get instant answers from your meetings with AI-powered search
            </p>
            <Button size="lg" className="bg-gradient-primary hover:opacity-90 transition-opacity glow-effect">
              Start Free Trial
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Chatbot;
