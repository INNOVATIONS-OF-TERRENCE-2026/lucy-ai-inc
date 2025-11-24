import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import lucyLogo from '@/assets/lucy-logo.png';

type AvatarState = 'idle' | 'thinking' | 'responding' | 'happy' | 'focused';

interface LucyAvatarProps {
  state?: AvatarState;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const LucyAvatar = ({ 
  state = 'idle', 
  size = 'md',
  className 
}: LucyAvatarProps) => {
  const [blink, setBlink] = useState(false);

  // Blinking animation
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 150);
    }, 3000 + Math.random() * 2000);

    return () => clearInterval(blinkInterval);
  }, []);

  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-32 h-32',
    xl: 'w-48 h-48'
  };

  const getAvatarStyles = () => {
    const baseStyles = 'rounded-full transition-all duration-300';
    
    switch (state) {
      case 'thinking':
        return `${baseStyles} animate-neural-pulse`;
      case 'responding':
        return `${baseStyles} shadow-glow-violet animate-pulse-glow`;
      case 'happy':
        return `${baseStyles} shadow-glow-accent scale-105`;
      case 'focused':
        return `${baseStyles} shadow-glow-blue`;
      default:
        return `${baseStyles} shadow-lg`;
    }
  };

  const getGlowEffect = () => {
    switch (state) {
      case 'thinking':
        return 'absolute inset-0 rounded-full bg-primary/20 animate-ping';
      case 'responding':
        return 'absolute inset-0 rounded-full bg-secondary/20 animate-pulse';
      default:
        return '';
    }
  };

  return (
    <div className={cn('relative', sizeClasses[size], className)}>
      {/* Outer glow effect */}
      {state !== 'idle' && (
        <div className={cn('absolute -inset-2', getGlowEffect())} />
      )}
      
      {/* Main avatar container */}
      <div className={cn('relative overflow-hidden', sizeClasses[size], getAvatarStyles())}>
        {/* Avatar image */}
        <img 
          src={lucyLogo}
          alt="Lucy AI"
          className={cn(
            'w-full h-full object-cover',
            'transition-transform duration-300',
            state === 'responding' && 'scale-105',
            blink && 'scale-95 opacity-80'
          )}
        />
        
        {/* Breathing overlay */}
        <div 
          className={cn(
            'absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent',
            'animate-pulse-glow opacity-0',
            state === 'idle' && 'opacity-100'
          )}
        />

        {/* Response light pulse */}
        {state === 'responding' && (
          <div className="absolute inset-0">
            <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-secondary/40 to-transparent animate-pulse" />
          </div>
        )}
      </div>

      {/* Emotion indicators */}
      {state === 'happy' && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-accent rounded-full animate-bounce flex items-center justify-center">
          <span className="text-xs">✨</span>
        </div>
      )}
    </div>
  );
};
