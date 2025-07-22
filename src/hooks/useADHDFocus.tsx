import { useState, useEffect, useCallback } from 'react';
import { useSettings } from './useSettings';

interface UseADHDFocusProps {
  text: string;
  isReading: boolean;
  onPause?: () => void;
  onResume?: () => void;
}

export function useADHDFocus({ text, isReading, onPause, onResume }: UseADHDFocusProps) {
  const { settings } = useSettings();
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [showBreathing, setShowBreathing] = useState(false);
  const [readingTimer, setReadingTimer] = useState(0);

  const words = text.split(/\s+/).filter(word => word.length > 0);

  // Reset when text changes
  useEffect(() => {
    setCurrentWordIndex(0);
    setReadingTimer(0);
  }, [text]);

  // Handle word progression and breathing breaks
  useEffect(() => {
    if (!settings.isADHDFocus || !isReading) return;

    const interval = setInterval(() => {
      setReadingTimer((prev) => {
        const newTimer = prev + 1;
        
        // Pause every 30 seconds (30000ms / 500ms intervals = 60 ticks)
        if (newTimer % 60 === 0) {
          setShowBreathing(true);
          onPause?.();
          return newTimer;
        }
        
        return newTimer;
      });

      // Progress through words (adjust speed as needed)
      setCurrentWordIndex((prev) => {
        if (prev < words.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 500); // Adjust reading speed here

    return () => clearInterval(interval);
  }, [settings.isADHDFocus, isReading, words.length, onPause]);

  const handleBreathingComplete = useCallback(() => {
    setShowBreathing(false);
    onResume?.();
  }, [onResume]);

  const getHighlightedText = useCallback(() => {
    if (!settings.isADHDFocus) return text;

    return words.map((word, index) => {
      const isCurrentWord = index === currentWordIndex;
      return (
        <span
          key={index}
          className={isCurrentWord ? 'word-highlight' : ''}
        >
          {word}
          {index < words.length - 1 ? ' ' : ''}
        </span>
      );
    });
  }, [settings.isADHDFocus, text, words, currentWordIndex]);

  return {
    highlightedText: getHighlightedText(),
    showBreathing,
    currentWordIndex,
    handleBreathingComplete,
    isADHDMode: settings.isADHDFocus
  };
}