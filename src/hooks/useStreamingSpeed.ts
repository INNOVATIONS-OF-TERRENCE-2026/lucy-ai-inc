import { useState, useEffect } from 'react';

export type StreamingSpeed = 'slow' | 'medium' | 'fast' | 'instant';

export const useStreamingSpeed = () => {
  const [speed, setSpeed] = useState<StreamingSpeed>(() => {
    const stored = localStorage.getItem('lucy-streaming-speed');
    return (stored as StreamingSpeed) || 'medium';
  });

  useEffect(() => {
    localStorage.setItem('lucy-streaming-speed', speed);
  }, [speed]);

  const getDelay = () => {
    switch (speed) {
      case 'slow':
        return 50;
      case 'medium':
        return 20;
      case 'fast':
        return 5;
      case 'instant':
        return 0;
      default:
        return 20;
    }
  };

  return { speed, setSpeed, getDelay };
};
