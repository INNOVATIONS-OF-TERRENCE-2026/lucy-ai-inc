import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Sparkles, MessageSquare, Shield, Zap } from "lucide-react";
import lucyLogo from "@/assets/lucy-logo.png";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/chat");
      }
    });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-primary relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "2s" }} />
      </div>

      {/* Darkened gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/25 to-black/35 pointer-events-none" />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 text-center">
        {/* Logo */}
        <div className="mb-8">
          <div className="w-32 h-32 rounded-full flex items-center justify-center animate-neural-pulse shadow-glow-violet mx-auto mb-6 overflow-hidden">
            <img 
              src={lucyLogo} 
              alt="Lucy AI" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-6xl md:text-7xl font-bold mb-6 text-white text-shadow-strong">
          Lucy AI
        </h1>
        <p className="text-xl md:text-2xl text-white mb-4 max-w-2xl text-shadow-strong">
          Beyond Intelligence
        </p>
        <p className="text-lg text-white mb-12 max-w-xl text-shadow-soft">
          Your advanced AI assistant powered by cutting-edge technology. 
          Reason, create, and solve with Lucy.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-16">
          <Button
            size="lg"
            className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6"
            onClick={() => navigate("/auth")}
          >
            <MessageSquare className="w-5 h-5 mr-2" />
            Start Chatting
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-white text-white hover:bg-white/10 text-lg px-8 py-6"
            onClick={() => navigate("/auth")}
          >
            Sign In
          </Button>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl">
          <div className="glass-card-enhanced p-6">
            <Sparkles className="w-10 h-10 mb-4 mx-auto text-white/80" />
            <h3 className="text-xl font-semibold mb-2 text-[rgb(245,245,255)]">Intelligent</h3>
            <p className="text-[rgb(245,245,255)]/90">
              Powered by advanced AI models for exceptional reasoning and creativity
            </p>
          </div>
          <div className="glass-card-enhanced p-6">
            <Zap className="w-10 h-10 mb-4 mx-auto text-white/80" />
            <h3 className="text-xl font-semibold mb-2 text-[rgb(245,245,255)]">Fast</h3>
            <p className="text-[rgb(245,245,255)]/90">
              Real-time streaming responses with instant feedback
            </p>
          </div>
          <div className="glass-card-enhanced p-6">
            <Shield className="w-10 h-10 mb-4 mx-auto text-white/80" />
            <h3 className="text-xl font-semibold mb-2 text-[rgb(245,245,255)]">Secure</h3>
            <p className="text-[rgb(245,245,255)]/90">
              Your conversations are private and protected
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
