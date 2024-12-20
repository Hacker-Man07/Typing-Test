import { useState, useEffect, useCallback } from 'react';
import { TestResult } from '../types';

export function useTypingTest(text: string) {
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [result, setResult] = useState<TestResult | null>(null);
  const [totalKeystrokes, setTotalKeystrokes] = useState(0);
  const [mistakes, setMistakes] = useState(0);

  const calculateAccuracy = useCallback(() => {
    return Math.max(0, Math.round(((totalKeystrokes - mistakes) / totalKeystrokes) * 100)) || 100;
  }, [totalKeystrokes, mistakes]);

  const calculateResult = useCallback(() => {
    if (!startTime) return null;

    const endTime = Date.now();
    const timeInMinutes = (endTime - startTime) / 60000;
    const wordsTyped = userInput.trim().split(' ').length;
    const wpm = Math.round(wordsTyped / timeInMinutes);

    return {
      wpm,
      accuracy: calculateAccuracy(),
      time: Math.round(timeInMinutes * 60)
    };
  }, [startTime, userInput, calculateAccuracy]);

  const handleInput = useCallback((value: string) => {
    if (!startTime) {
      setStartTime(Date.now());
    }

    // Track keystrokes and mistakes
    if (value.length > userInput.length) {
      setTotalKeystrokes(prev => prev + 1);
      const newChar = value[value.length - 1];
      const expectedChar = text[value.length - 1];
      if (newChar !== expectedChar) {
        setMistakes(prev => prev + 1);
      }
    }

    setUserInput(value);

    if (value.length === text.length) {
      setIsFinished(true);
    }
  }, [text, userInput, startTime]);

  const reset = useCallback(() => {
    setUserInput('');
    setStartTime(null);
    setIsFinished(false);
    setResult(null);
    setTotalKeystrokes(0);
    setMistakes(0);
  }, []);

  useEffect(() => {
    if (isFinished) {
      const result = calculateResult();
      if (result) setResult(result);
    }
  }, [isFinished, calculateResult]);

  return {
    userInput,
    handleInput,
    isFinished,
    result,
    reset,
    accuracy: calculateAccuracy()
  };
}