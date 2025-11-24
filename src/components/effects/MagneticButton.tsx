import { useState, useRef, useEffect } from 'react';
import { Button, ButtonProps } from '../ui/button';
import { cn } from '@/lib/utils';
import { useCalmMode } from '@/hooks/useCalmMode';

interface MagneticButtonProps extends ButtonProps {
  magneticStrength?: number;
}

export const MagneticButton = ({ 
  children, 
  className, 
  magneticStrength = 20,
  ...props 
}: MagneticButtonProps) => {
  const { calmMode } = useCalmMode();
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button || calmMode) {
      setPosition({ x: 0, y: 0 });
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = button.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const distanceX = e.clientX - centerX;
      const distanceY = e.clientY - centerY;
      const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);
      
      // Only attract within 100px radius
      if (distance < 100) {
        const strength = (100 - distance) / 100;
        setPosition({
          x: (distanceX / distance) * strength * magneticStrength,
          y: (distanceY / distance) * strength * magneticStrength
        });
      } else {
        setPosition({ x: 0, y: 0 });
      }
    };

    const handleMouseLeave = () => {
      setPosition({ x: 0, y: 0 });
    };

    window.addEventListener('mousemove', handleMouseMove);
    button.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      button.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [magneticStrength, calmMode]);

  return (
    <Button
      ref={buttonRef}
      {...props}
      className={cn('transition-transform duration-200 ease-out', className)}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`
      }}
    >
      {children}
    </Button>
  );
};
