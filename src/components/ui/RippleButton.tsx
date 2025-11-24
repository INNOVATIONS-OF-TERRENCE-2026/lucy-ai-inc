import { useState, useCallback } from 'react';
import { Button, ButtonProps } from './button';
import { cn } from '@/lib/utils';
import { useCalmMode } from '@/hooks/useCalmMode';

interface Ripple {
  x: number;
  y: number;
  id: number;
}

export const RippleButton = ({ 
  children, 
  className,
  onClick,
  ...props 
}: ButtonProps) => {
  const { calmMode } = useCalmMode();
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (!calmMode) {
      const button = e.currentTarget;
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const newRipple = { x, y, id: Date.now() };
      setRipples(prev => [...prev, newRipple]);

      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== newRipple.id));
      }, 600);
    }

    onClick?.(e);
  }, [onClick, calmMode]);

  return (
    <Button
      {...props}
      className={cn('relative overflow-hidden active:scale-95', className)}
      onClick={handleClick}
    >
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className="absolute bg-white/30 rounded-full animate-ripple pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: 0,
            height: 0,
            transform: 'translate(-50%, -50%)'
          }}
        />
      ))}
      {children}
    </Button>
  );
};
