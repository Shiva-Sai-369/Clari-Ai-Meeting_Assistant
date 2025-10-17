import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Github } from "lucide-react";

const Contact = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* About Section */}
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                About <span className="gradient-text">EchoMeet</span>
              </h1>
              <div className="space-y-6 text-muted-foreground leading-relaxed">
                <p>
                  EchoMeet is a voice-based AI meeting assistant that transforms how teams capture, understand, and act on meeting discussions. Built with cutting-edge AI technology from OpenAI, we make meetings more productive and actionable.
                </p>
                
                <div className="glass-card p-6 rounded-2xl">
                  <h2 className="text-2xl font-bold text-foreground mb-4">Our Mission</h2>
                  <p>
                    We believe meetings should drive action, not confusion. EchoMeet eliminates the friction between conversation and execution by automatically capturing insights, extracting tasks, and integrating with your workflow.
                  </p>
                </div>

                <div className="glass-card p-6 rounded-2xl">
                  <h2 className="text-2xl font-bold text-foreground mb-4">The Technology</h2>
                  <p>
                    Powered by GPT-4o for intelligent summarization and Whisper for industry-leading speech recognition, EchoMeet brings enterprise-grade AI to every meeting. Our RAG-powered chatbot ensures you can always find what was discussed, decided, and assigned.
                  </p>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button variant="outline" className="gap-2">
                    <Github className="w-5 h-5" />
                    View on GitHub
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Mail className="w-5 h-5" />
                    hello@echomeet.ai
                  </Button>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="glass-card p-8 rounded-3xl glow-effect">
              <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
              <p className="text-muted-foreground mb-8">
                Have questions or want to learn more? We'd love to hear from you.
              </p>

              <form className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Your name"
                    className="glass-card"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    className="glass-card"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us what you're thinking..."
                    rows={6}
                    className="glass-card resize-none"
                  />
                </div>

                <Button className="w-full bg-gradient-primary hover:opacity-90 transition-opacity glow-effect">
                  Send Message
                </Button>
              </form>

              <div className="mt-8 pt-8 border-t border-border">
                <p className="text-sm text-muted-foreground text-center">
                  Built with ❤️ for productive teams everywhere
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Contact;
