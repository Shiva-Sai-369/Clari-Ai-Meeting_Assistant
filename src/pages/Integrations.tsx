import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Calendar, MessageSquare, CheckSquare, Trello, Slack, Mail } from "lucide-react";

const Integrations = () => {
  const integrations = [
    {
      icon: Calendar,
      name: "Google Calendar",
      description: "Automatically sync meeting summaries and action items with your calendar events.",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: Calendar,
      name: "Microsoft Outlook",
      description: "Seamlessly integrate with Outlook for enterprise teams and schedule follow-ups.",
      color: "from-blue-600 to-blue-700",
    },
    {
      icon: Slack,
      name: "Slack",
      description: "Send meeting summaries, action items, and notifications directly to team channels.",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: MessageSquare,
      name: "Microsoft Teams",
      description: "Post meeting insights and collaborate with your team in real-time.",
      color: "from-indigo-500 to-purple-600",
    },
    {
      icon: CheckSquare,
      name: "Jira",
      description: "Convert action items into Jira tickets automatically with assignees and deadlines.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Trello,
      name: "Trello",
      description: "Create cards from meeting tasks and keep your boards up to date automatically.",
      color: "from-blue-400 to-blue-600",
    },
    {
      icon: CheckSquare,
      name: "Asana",
      description: "Sync tasks and projects directly to Asana for streamlined project management.",
      color: "from-pink-500 to-rose-500",
    },
    {
      icon: Mail,
      name: "Email",
      description: "Receive detailed meeting summaries via email with customizable templates.",
      color: "from-gray-500 to-gray-700",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Connect with Your <span className="gradient-text">Favorite Tools</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              EchoMeet integrates seamlessly with your existing productivity ecosystem
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {integrations.map((integration, index) => (
              <div
                key={index}
                className="glass-card p-8 rounded-2xl hover:glow-effect transition-all duration-300 group"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${integration.color} glow-effect mb-6 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <integration.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">{integration.name}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{integration.description}</p>
              </div>
            ))}
          </div>

          {/* Features Grid */}
          <div className="glass-card p-12 rounded-3xl glow-effect mb-12">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Why <span className="gradient-text">Teams Love</span> Our Integrations
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  title: "One-Click Setup",
                  description: "Connect your tools in seconds with OAuth authentication. No complex configuration required.",
                },
                {
                  title: "Real-Time Sync",
                  description: "Action items and summaries appear in your tools instantly after meetings end.",
                },
                {
                  title: "Customizable Workflows",
                  description: "Choose which channels, boards, or calendars receive updates automatically.",
                },
                {
                  title: "Secure & Private",
                  description: "Enterprise-grade encryption ensures your meeting data stays protected.",
                },
              ].map((feature, index) => (
                <div key={index} className="flex gap-4">
                  <div className="w-2 h-2 rounded-full bg-primary glow-effect mt-2 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center glass-card p-12 rounded-3xl glow-effect">
            <h2 className="text-3xl font-bold mb-4">
              Connect EchoMeet with Your Favorite Tools
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Start streamlining your workflow today with seamless integrations
            </p>
            <Button size="lg" className="bg-gradient-primary hover:opacity-90 transition-opacity glow-effect">
              Get Started Free
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Integrations;
