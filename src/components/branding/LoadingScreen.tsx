import { LucyLogo } from "./LucyLogo";

interface LoadingScreenProps {
  message?: string;
}

export const LoadingScreen = ({ message = "Loading Lucy AI..." }: LoadingScreenProps) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-primary">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "2s" }} />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center space-y-6">
        <LucyLogo size="xl" showGlow />
        
        {/* Loading animation */}
        <div className="flex gap-2">
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
        
        <p className="text-white/90 text-lg font-medium">{message}</p>
        
        {/* Neural network animation */}
        <div className="relative w-64 h-1 bg-white/10 rounded-full overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-[shimmer_2s_ease-in-out_infinite]" />
        </div>
      </div>
    </div>
  );
};
