import { useEffect, useRef } from 'react';

interface FauxParallaxProps {
  children: React.ReactNode;
  intensity?: number;
}

export const FauxParallax = ({ children, intensity = 20 }: FauxParallaxProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;

      const xPercent = (clientX / innerWidth - 0.5) * 2;
      const yPercent = (clientY / innerHeight - 0.5) * 2;

      const translateX = xPercent * intensity;
      const translateY = yPercent * intensity;

      containerRef.current.style.transform = `translate(${translateX}px, ${translateY}px)`;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [intensity]);

  return (
    <div 
      ref={containerRef}
      className="transition-transform duration-200 ease-out will-change-transform"
    >
      {children}
    </div>
  );
};
