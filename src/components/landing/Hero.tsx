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

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-32 text-center">
        {/* Lucy Avatar */}
        <div className="mb-10 flex justify-center animate-pulse-glow">
          <LucyAvatar size="xl" state="happy" className="drop-shadow-2xl" />
        </div>

        {/* Hero text */}
        <h1 className="text-6xl md:text-8xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-blue-200 text-shadow-strong leading-tight">
          Lucy AI
          <span className="block text-5xl md:text-6xl mt-4 bg-gradient-button bg-clip-text text-transparent">
            Beyond Intelligence
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-white/95 mb-14 max-w-3xl mx-auto text-shadow-soft leading-relaxed">
          Experience next-generation AI with advanced reasoning, multimodal vision, persistent memory, and creative tools—all powered by cutting-edge technology
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-5 justify-center mb-20">
          <Button
            size="lg"
            variant="gradient"
            onClick={() => navigate('/auth')}
          >
            <MessageSquare className="w-5 h-5 mr-2" />
            🚀 Start Free
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <Sparkles className="w-5 h-5 mr-2" />
            ✨ Explore Features
          </Button>
        </div>

        {/* Social proof */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
          <div className="text-center glass-card-enhanced p-6 hover:scale-105 transition-transform">
            <div className="text-4xl font-bold bg-gradient-button bg-clip-text text-transparent mb-2">500K+</div>
            <div className="text-white/80 text-sm">Active Users</div>
          </div>
          <div className="text-center glass-card-enhanced p-6 hover:scale-105 transition-transform">
            <div className="text-4xl font-bold bg-gradient-button bg-clip-text text-transparent mb-2">10M+</div>
            <div className="text-white/80 text-sm">Conversations</div>
          </div>
          <div className="text-center glass-card-enhanced p-6 hover:scale-105 transition-transform">
            <div className="text-4xl font-bold bg-gradient-button bg-clip-text text-transparent mb-2">4.9★</div>
            <div className="text-white/80 text-sm">User Rating</div>
          </div>
        </div>
      </div>
    </section>
  );
};
