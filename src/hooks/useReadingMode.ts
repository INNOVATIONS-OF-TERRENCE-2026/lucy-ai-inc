import { useState, useEffect } from 'react';

export type ReadingMode = 'compact' | 'comfortable' | 'expanded';

export const useReadingMode = () => {
  const [readingMode, setReadingMode] = useState<ReadingMode>(() => {
    const stored = localStorage.getItem('lucy-reading-mode');
    return (stored as ReadingMode) || 'comfortable';
  });

  useEffect(() => {
    localStorage.setItem('lucy-reading-mode', readingMode);
  }, [readingMode]);

  const getSpacingClass = () => {
    switch (readingMode) {
      case 'compact':
        return 'space-y-3';
      case 'comfortable':
        return 'space-y-6';
      case 'expanded':
        return 'space-y-10';
      default:
        return 'space-y-6';
    }
  };

  return { readingMode, setReadingMode, getSpacingClass };
};
