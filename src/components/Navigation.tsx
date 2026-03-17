import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { SlideTabs } from "@/components/ui/slide-tabs";

const Navigation = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/features", label: "Features" },
    { path: "/demo", label: "Demo" },
    { path: "/integrations", label: "Integrations" },
    { path: "/chatbot", label: "Chatbot" },
    { path: "/contact", label: "Contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-3xl font-bold gradient-text">Clari</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:block absolute left-1/2 -translate-x-1/2">
            <SlideTabs />
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link to="/demo">
              <Button className="bg-gradient-primary hover:opacity-90 transition-opacity glow-effect">
                Try Demo
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === link.path
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 pt-4">
              <Link to="/demo" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full bg-gradient-primary hover:opacity-90 transition-opacity">
                  Try Demo
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
