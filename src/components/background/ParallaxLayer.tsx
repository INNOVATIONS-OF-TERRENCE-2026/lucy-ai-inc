import { useEffect, useRef } from 'react';
import { useCalmMode } from '@/hooks/useCalmMode';

interface ParallaxLayerProps {
  intensity: number;
  activityLevel: 'idle' | 'low' | 'medium' | 'high';
  children: React.ReactNode;
}

export const ParallaxLayer = ({ intensity, activityLevel, children }: ParallaxLayerProps) => {
  const { calmMode } = useCalmMode();
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (calmMode) {
      if (layerRef.current) {
        layerRef.current.style.transform = 'translate(0px, 0px) scale(1.1)';
      }
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!layerRef.current) return;

      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;

      const xOffset = ((clientX - innerWidth / 2) / innerWidth) * intensity * 20;
      const yOffset = ((clientY - innerHeight / 2) / innerHeight) * intensity * 20;

      layerRef.current.style.transform = `translate(${xOffset}px, ${yOffset}px) scale(1.1)`;
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [intensity, calmMode]);

  // Activity-based animation
  useEffect(() => {
    if (!layerRef.current || calmMode) return;

    const activityIntensity = {
      idle: 0,
      low: 0.02,
      medium: 0.05,
      high: 0.1
    }[activityLevel];

    if (activityIntensity > 0) {
      const startTime = Date.now();
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const pulse = Math.sin(elapsed * 0.003) * activityIntensity * (calmMode ? 0.2 : 1);
        
        if (layerRef.current) {
          const currentTransform = layerRef.current.style.transform || 'translate(0px, 0px) scale(1.1)';
          const scale = 1.1 + pulse;
          layerRef.current.style.transform = currentTransform.replace(/scale\([^)]+\)/, `scale(${scale})`);
        }

        requestAnimationFrame(animate);
      };

      const animationFrame = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(animationFrame);
    }
  }, [activityLevel, calmMode]);

  return (
    <div
      ref={layerRef}
      className="absolute inset-0 transition-transform duration-100 ease-out"
      style={{ willChange: 'transform' }}
    >
      {children}
    </div>
  );
};
