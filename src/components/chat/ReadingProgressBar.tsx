import { useEffect, useState } from 'react';

interface ReadingProgressBarProps {
  isStreaming: boolean;
}

export function ReadingProgressBar({ isStreaming }: ReadingProgressBarProps) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isStreaming) {
      setVisible(true);
      setProgress(0);
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) return prev;
          return prev + Math.random() * 5;
        });
      }, 200);
      return () => clearInterval(interval);
    } else {
      setProgress(100);
      setTimeout(() => setVisible(false), 500);
    }
  }, [isStreaming]);

  if (!visible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-transparent">
      <div
        className="h-full bg-gradient-button transition-all duration-300 ease-out shadow-glow-violet"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
