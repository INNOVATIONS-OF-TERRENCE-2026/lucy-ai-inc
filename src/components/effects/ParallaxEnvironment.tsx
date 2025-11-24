import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { useCalmMode } from '@/hooks/useCalmMode';

interface ParallaxEnvironmentProps {
  mode?: 'cosmic' | 'neon' | 'nature' | 'noir' | 'rain';
  intensity?: number;
  children?: React.ReactNode;
}

export const ParallaxEnvironment = ({ 
  mode = 'cosmic', 
  intensity = 0.5,
  children 
}: ParallaxEnvironmentProps) => {
  const { calmMode } = useCalmMode();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (calmMode) {
      setMousePosition({ x: 0, y: 0 });
      setTilt({ x: 0, y: 0 });
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePosition({ x, y });
    };

    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.beta !== null && e.gamma !== null) {
        const x = Math.max(-1, Math.min(1, e.gamma / 45));
        const y = Math.max(-1, Math.min(1, (e.beta - 45) / 45));
        setTilt({ x, y });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('deviceorientation', handleOrientation);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, [calmMode]);

  const getThemeStyles = () => {
    switch (mode) {
      case 'cosmic':
        return {
          bg: 'bg-gradient-to-b from-purple-950 via-indigo-950 to-black',
          particles: 'bg-white',
          glow: 'from-purple-500/20 to-blue-500/20'
        };
      case 'neon':
        return {
          bg: 'bg-gradient-to-b from-cyan-950 via-fuchsia-950 to-black',
          particles: 'bg-cyan-400',
          glow: 'from-cyan-500/30 to-fuchsia-500/30'
        };
      case 'nature':
        return {
          bg: 'bg-gradient-to-b from-green-900 via-emerald-950 to-teal-950',
          particles: 'bg-green-300',
          glow: 'from-green-500/20 to-teal-500/20'
        };
      case 'noir':
        return {
          bg: 'bg-gradient-to-b from-gray-950 via-black to-gray-900',
          particles: 'bg-gray-400',
          glow: 'from-gray-500/10 to-gray-600/10'
        };
      case 'rain':
        return {
          bg: 'bg-gradient-to-b from-slate-900 via-blue-950 to-indigo-950',
          particles: 'bg-blue-300',
          glow: 'from-blue-500/20 to-slate-500/20'
        };
    }
  };

  const theme = getThemeStyles();
  const effectiveIntensity = calmMode ? 0 : intensity;
  const particleCount = calmMode ? 0.3 : 1;
  const offsetX = (mousePosition.x + tilt.x) * effectiveIntensity * 20;
  const offsetY = (mousePosition.y + tilt.y) * effectiveIntensity * 20;

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Background layer */}
      <div className={cn('absolute inset-0 transition-colors duration-1000', theme.bg)} />

      {/* Far parallax layer */}
      <div 
        className="absolute inset-0"
        style={{ transform: `translate(${offsetX * 0.3}px, ${offsetY * 0.3}px)` }}
      >
        {Array.from({ length: Math.floor(30 * particleCount) }).map((_, i) => (
          <div
            key={`far-${i}`}
            className={cn('absolute rounded-full opacity-20', theme.particles)}
            style={{
              width: Math.random() * 3 + 1 + 'px',
              height: Math.random() * 3 + 1 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              animation: calmMode ? `float-calm ${Math.random() * 15 + 20}s infinite ease-in-out` : `float ${Math.random() * 10 + 15}s infinite ease-in-out`
            }}
          />
        ))}
      </div>

      {/* Mid parallax layer with glow */}
      <div 
        className="absolute inset-0"
        style={{ transform: `translate(${offsetX * 0.6}px, ${offsetY * 0.6}px)` }}
      >
        <div className={cn(
          'absolute inset-0 bg-gradient-to-br opacity-30 blur-3xl',
          `${theme.glow}`
        )} />
        {Array.from({ length: Math.floor(15 * particleCount) }).map((_, i) => (
          <div
            key={`mid-${i}`}
            className={cn('absolute rounded-full opacity-40', theme.particles)}
            style={{
              width: Math.random() * 4 + 2 + 'px',
              height: Math.random() * 4 + 2 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              animation: calmMode ? `float-calm ${Math.random() * 12 + 18}s infinite ease-in-out` : `float ${Math.random() * 8 + 12}s infinite ease-in-out`,
              animationDelay: Math.random() * 5 + 's'
            }}
          />
        ))}
      </div>

      {/* Foreground parallax layer */}
      <div 
        className="absolute inset-0"
        style={{ transform: `translate(${offsetX}px, ${offsetY}px)` }}
      >
        {Array.from({ length: Math.floor(8 * particleCount) }).map((_, i) => (
          <div
            key={`fore-${i}`}
            className={cn('absolute rounded-full opacity-60 blur-sm', theme.particles)}
            style={{
              width: Math.random() * 6 + 3 + 'px',
              height: Math.random() * 6 + 3 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              animation: calmMode ? `float-calm ${Math.random() * 10 + 15}s infinite ease-in-out` : `float ${Math.random() * 6 + 8}s infinite ease-in-out`,
              animationDelay: Math.random() * 3 + 's'
            }}
          />
        ))}
      </div>

      {children}
    </div>
  );
};
