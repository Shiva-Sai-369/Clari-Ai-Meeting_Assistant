import { Link } from "react-router-dom";
import { Github, Linkedin, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card mt-20">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-primary glow-effect" />
              <span className="text-xl font-bold gradient-text">EchoMeet</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Turn every conversation into action with AI-powered meeting assistance.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li><Link to="/features" className="text-sm text-muted-foreground hover:text-primary transition-colors">Features</Link></li>
              <li><Link to="/demo" className="text-sm text-muted-foreground hover:text-primary transition-colors">Demo</Link></li>
              <li><Link to="/integrations" className="text-sm text-muted-foreground hover:text-primary transition-colors">Integrations</Link></li>
              <li><Link to="/chatbot" className="text-sm text-muted-foreground hover:text-primary transition-colors">AI Chatbot</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">About</Link></li>
              <li><Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Connect</h3>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>© 2025 EchoMeet. All rights reserved. Powered by GPT-4o + Whisper.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
