import { useEffect, useState } from "react";
import { LucyLogo } from "./LucyLogo";

interface IntroScreenProps {
  onComplete: () => void;
}

export const IntroScreen = ({ onComplete }: IntroScreenProps) => {
  const [phase, setPhase] = useState<'logo' | 'message' | 'fadeout'>('logo');

  useEffect(() => {
    // Logo reveal phase
    const logoTimer = setTimeout(() => {
      setPhase('message');
    }, 1500);

    // Welcome message phase
    const messageTimer = setTimeout(() => {
      setPhase('fadeout');
    }, 3500);

    // Complete and transition to app
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 4500);

    return () => {
      clearTimeout(logoTimer);
      clearTimeout(messageTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  const handleSkip = () => {
    setPhase('fadeout');
    setTimeout(onComplete, 500);
  };

  return (
    <div 
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-primary transition-opacity duration-1000 ${
        phase === 'fadeout' ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "2s" }} />
      </div>

      {/* Darkened gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/25 to-black/35 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center space-y-8">
        {/* Animated Logo */}
        <div 
          className={`transition-all duration-1000 ${
            phase === 'logo' 
              ? 'scale-0 opacity-0' 
              : 'scale-100 opacity-100'
          }`}
        >
          <LucyLogo size="xl" showGlow />
        </div>
        
        {/* Welcome Message */}
        <div 
          className={`flex flex-col items-center space-y-4 transition-all duration-1000 ${
            phase === 'message' || phase === 'fadeout'
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-4'
          }`}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center text-shadow-strong">
            Welcome to Lucy AI
          </h1>
          <p className="text-xl text-white text-center max-w-md text-shadow-soft">
            Beyond Intelligence
          </p>
          
          {/* Neural network animation */}
          <div className="relative w-64 h-1 bg-white/10 rounded-full overflow-hidden mt-6">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-[shimmer_2s_ease-in-out_infinite]" />
          </div>
        </div>

        {/* Skip button */}
        {phase !== 'fadeout' && (
          <button
            onClick={handleSkip}
            className="absolute bottom-8 text-white/60 hover:text-white transition-colors text-sm"
          >
            Skip intro
          </button>
        )}
      </div>
    </div>
  );
};
