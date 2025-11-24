import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import lucyAvatar from '@/assets/lucy-avatar-premium.png';
import { useCalmMode } from '@/hooks/useCalmMode';

export type AvatarState = 'idle' | 'thinking' | 'responding' | 'happy' | 'serious' | 'excited' | 'listening';

interface AdvancedLucyAvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  state?: AvatarState;
  isTyping?: boolean;
  className?: string;
}

export const AdvancedLucyAvatar = ({ 
  size = 'md', 
  state = 'idle',
  isTyping = false,
  className 
}: AdvancedLucyAvatarProps) => {
  const { calmMode } = useCalmMode();
  const [blinking, setBlinking] = useState(false);
  const [microExpression, setMicroExpression] = useState<'neutral' | 'focus' | 'smile'>('neutral');

  // Blink cycle
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlinking(true);
      setTimeout(() => setBlinking(false), calmMode ? 250 : 150);
    }, calmMode ? 8000 : (3000 + Math.random() * 2000));

    return () => clearInterval(blinkInterval);
  }, [calmMode]);

  // Micro-expression changes
  useEffect(() => {
    if (calmMode) {
      setMicroExpression('neutral');
      return;
    }
    
    if (state === 'thinking') {
      setMicroExpression('focus');
    } else if (state === 'happy' || state === 'excited') {
      setMicroExpression('smile');
    } else {
      setMicroExpression('neutral');
    }
  }, [state, calmMode]);

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
    xl: 'w-48 h-48'
  };

  const getStateAnimation = () => {
    if (calmMode) {
      return state === 'responding' || state === 'thinking' ? 'animate-pulse' : '';
    }
    
    switch (state) {
      case 'idle':
        return 'animate-pulse-glow';
      case 'thinking':
        return 'animate-pulse';
      case 'responding':
        return 'animate-pulse-glow';
      case 'happy':
        return 'animate-bounce';
      case 'excited':
        return 'animate-pulse-glow animate-bounce';
      case 'listening':
        return 'scale-105';
      default:
        return '';
    }
  };

  const getGlowIntensity = () => {
    const intensity = calmMode ? 0.3 : 1;
    
    switch (state) {
      case 'thinking':
        return `shadow-[0_0_40px_rgba(123,63,242,${0.6 * intensity})]`;
      case 'responding':
        return `shadow-[0_0_50px_rgba(32,164,243,${0.7 * intensity})]`;
      case 'happy':
      case 'excited':
        return `shadow-[0_0_60px_rgba(123,63,242,${0.8 * intensity})]`;
      case 'serious':
        return `shadow-[0_0_20px_rgba(123,63,242,${0.3 * intensity})]`;
      default:
        return `shadow-[0_0_30px_rgba(123,63,242,${0.4 * intensity})]`;
    }
  };

  return (
    <div className={cn('relative', className)}>
      {/* Outer glow rings */}
      <div className={cn(
        'absolute inset-0 rounded-full blur-xl transition-all duration-500',
        getGlowIntensity(),
        state === 'excited' && 'animate-ping'
      )} />
      
      {/* Avatar container */}
      <div className={cn(
        'relative rounded-full overflow-hidden transition-all duration-300',
        sizeClasses[size],
        getStateAnimation(),
        isTyping && 'ring-4 ring-accent ring-offset-2 ring-offset-background'
      )}>
        <img 
          src={lucyAvatar} 
          alt="Lucy AI" 
          className={cn(
            'w-full h-full object-cover transition-all duration-300',
            blinking && 'brightness-75',
            state === 'serious' && 'brightness-90 saturate-75',
            state === 'happy' && 'brightness-110 saturate-110',
            state === 'excited' && 'brightness-125 saturate-125'
          )}
        />
        
        {/* Holographic overlay */}
        <div className={cn(
          'absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20',
          'opacity-0 transition-opacity duration-500',
          (state === 'responding' || state === 'thinking') && 'opacity-100'
        )} />

        {/* Micro-expression indicators (subtle overlays) */}
        {microExpression === 'focus' && (
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-primary/10 to-primary/20 animate-pulse" />
        )}
        
        {/* Sparkles for excited state */}
        {state === 'excited' && !calmMode && (
          <>
            <div className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full animate-ping" />
            <div className="absolute bottom-3 left-3 w-1.5 h-1.5 bg-primary rounded-full animate-ping" style={{ animationDelay: '0.3s' }} />
            <div className="absolute top-1/2 right-1 w-1 h-1 bg-white rounded-full animate-ping" style={{ animationDelay: '0.6s' }} />
          </>
        )}
      </div>

      {/* Breathing indicator (subtle pulse at bottom) */}
      <div className={cn(
        'absolute -bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-button rounded-full opacity-30 blur-sm',
        'animate-pulse'
      )} />
    </div>
  );
};
