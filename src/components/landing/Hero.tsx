import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Sparkles } from 'lucide-react';
import { LucyAvatar } from '@/components/avatar/LucyAvatar';

export const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '2s' }} />
      </div>

      {/* Darkened gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/25 to-black/35 pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Lucy Avatar */}
        <div className="mb-8 flex justify-center">
          <LucyAvatar size="xl" state="happy" />
        </div>

        {/* Hero text */}
        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white text-shadow-strong">
          Meet Lucy AI
        </h1>
        <p className="text-2xl md:text-3xl text-white mb-4 text-shadow-strong">
          Beyond Intelligence
        </p>
        <p className="text-lg md:text-xl text-white/90 mb-12 max-w-2xl mx-auto text-shadow-soft">
          Your advanced AI assistant with reasoning, vision, memory, and creativity. 
          Experience the future of AI conversation today.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Button
            size="lg"
            className="bg-white text-primary hover:bg-white/95 font-semibold text-lg px-8 py-6 h-auto shadow-lg hover:shadow-xl transition-all"
            onClick={() => navigate('/auth')}
          >
            <MessageSquare className="w-5 h-5 mr-2" />
            Start Free
          </Button>
          <Button
            size="lg"
            className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold text-lg px-8 py-6 h-auto shadow-lg hover:shadow-xl transition-all"
            onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Explore Features
          </Button>
        </div>

        {/* Social proof */}
        <div className="flex flex-wrap justify-center gap-8 text-white/80 text-sm">
          <div>
            <div className="text-2xl font-bold text-white">10K+</div>
            <div>Active Users</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">1M+</div>
            <div>Conversations</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">4.9★</div>
            <div>User Rating</div>
          </div>
        </div>
      </div>
    </section>
  );
};
