import { useCallback, useEffect, useRef } from 'react';
import { useCalmMode } from './useCalmMode';

export const useSoundSystem = () => {
  const { calmMode } = useCalmMode();
  const audioContextRef = useRef<AudioContext | null>(null);
  const isMutedRef = useRef(false);

  useEffect(() => {
    // Initialize Web Audio API
    if (typeof window !== 'undefined' && 'AudioContext' in window) {
      audioContextRef.current = new AudioContext();
    }

    return () => {
      if (audioContextRef.current?.state !== 'closed') {
        audioContextRef.current?.close();
      }
    };
  }, []);

  const playTone = useCallback((frequency: number, duration: number, volume: number = 0.1) => {
    if (isMutedRef.current || !audioContextRef.current) return;

    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';
    
    const adjustedVolume = calmMode ? volume * 0.4 : volume;
    
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(adjustedVolume, ctx.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  }, [calmMode]);

  const playClickSound = useCallback(() => {
    playTone(800, 0.05, 0.08);
  }, [playTone]);

  const playSuccessSound = useCallback(() => {
    playTone(523.25, 0.1, 0.1); // C5
    setTimeout(() => playTone(659.25, 0.1, 0.1), 100); // E5
    setTimeout(() => playTone(783.99, 0.15, 0.12), 200); // G5
  }, [playTone]);

  const playNotificationSound = useCallback(() => {
    playTone(880, 0.1, 0.1); // A5
    setTimeout(() => playTone(1046.5, 0.15, 0.12), 100); // C6
  }, [playTone]);

  const playThinkingSound = useCallback(() => {
    playTone(440, 0.05, 0.06); // A4
    setTimeout(() => playTone(554.37, 0.05, 0.06), 50); // C#5
    setTimeout(() => playTone(659.25, 0.1, 0.07), 100); // E5
  }, [playTone]);

  const playAmbientHum = useCallback(() => {
    if (isMutedRef.current || !audioContextRef.current) return;

    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = 110; // A2
    oscillator.type = 'sine';
    filter.type = 'lowpass';
    filter.frequency.value = 200;
    
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.02, ctx.currentTime + 2);

    oscillator.start(ctx.currentTime);
    
    return () => {
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1);
      oscillator.stop(ctx.currentTime + 1);
    };
  }, []);

  const setMuted = useCallback((muted: boolean) => {
    isMutedRef.current = muted;
  }, []);

  return {
    playClickSound,
    playSuccessSound,
    playNotificationSound,
    playThinkingSound,
    playAmbientHum,
    setMuted
  };
};
