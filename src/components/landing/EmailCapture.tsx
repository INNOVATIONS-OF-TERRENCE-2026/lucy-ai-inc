import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface EmailCaptureProps {
  variant?: 'inline' | 'popup';
  onClose?: () => void;
}

export const EmailCapture = ({ variant = 'inline', onClose }: EmailCaptureProps) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('email_leads')
        .insert([{ email, source: variant === 'popup' ? 'popup' : 'inline' }]);

      if (error) throw error;

      toast.success('🎉 Welcome to the Lucy AI community!');
      setEmail('');
      if (onClose) onClose();
    } catch (error) {
      console.error('Error saving email:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (variant === 'popup') {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="glass-card-enhanced max-w-lg w-full p-8 relative animate-in fade-in zoom-in duration-300">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center mb-6">
            <Mail className="w-16 h-16 mx-auto mb-4 text-accent" />
            <h2 className="text-3xl font-bold text-white mb-3">
              Join the Lucy AI Waitlist
            </h2>
            <p className="text-white/80 text-lg">
              Get exclusive early access, tips, and updates
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
              disabled={loading}
            />
            <Button
              type="submit"
              size="lg"
              variant="gradient"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Joining...' : 'Get Free Access'}
            </Button>
          </form>

          <p className="text-white/60 text-sm text-center mt-4">
            Plus: Unlock Lucy's 2025 AI Starter Guide (PDF)
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card-enhanced p-8 text-center">
      <Mail className="w-12 h-12 mx-auto mb-4 text-accent" />
      <h3 className="text-2xl font-bold text-white mb-3">
        Join 10,000+ AI Enthusiasts
      </h3>
      <p className="text-white/80 mb-6">
        Get exclusive updates, tips, and early access to new features
      </p>

      <form onSubmit={handleSubmit} className="flex gap-3 max-w-md mx-auto">
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
          disabled={loading}
        />
        <Button
          type="submit"
          variant="gradient"
          disabled={loading}
        >
          {loading ? 'Joining...' : 'Join Free'}
        </Button>
      </form>
    </div>
  );
};