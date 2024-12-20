import React, { useState, useEffect } from 'react';
import { Quote } from '../types';
import { useTypingTest } from '../hooks/useTypingTest';
import { Keyboard, RefreshCcw, Moon, Sun } from 'lucide-react';

export default function TypingTest() {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(() => 
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  const fetchQuote = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://api.quotable.io/random?minLength=100&maxLength=200');
      const data = await response.json();
      setQuote(data);
    } catch (error) {
      console.error('Error fetching quote:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  const { userInput, handleInput, isFinished, result, reset, accuracy } = useTypingTest(quote?.content || '');

  const handleReset = () => {
    reset();
    fetchQuote();
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${
        isDarkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'
      }`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white' 
        : 'bg-gradient-to-br from-blue-50 via-white to-purple-50 text-gray-900'
    }`}>
      <div className="max-w-3xl mx-auto py-12 px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-2">
            <Keyboard className={`w-8 h-8 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`} />
            <h1 className="text-3xl font-bold">Typing Speed Test</h1>
          </div>
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full ${
              isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
            } transition-colors`}
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>

        {!isFinished && (
          <div className={`mb-6 flex justify-center ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
            <div className="text-center">
              <p className="text-3xl font-bold">{accuracy}%</p>
              <p className="text-sm">Current Accuracy</p>
            </div>
          </div>
        )}

        {result ? (
          <div className={`rounded-lg p-8 mb-8 backdrop-blur-sm ${
            isDarkMode ? 'bg-white/10' : 'bg-white/70'
          } shadow-xl`}>
            <h2 className="text-2xl font-semibold mb-6">Your Results</h2>
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <p className={`text-4xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`}>
                  {result.wpm}
                </p>
                <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Words per minute</p>
              </div>
              <div className="text-center">
                <p className={`text-4xl font-bold ${isDarkMode ? 'text-green-400' : 'text-green-500'}`}>
                  {result.accuracy}%
                </p>
                <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Accuracy</p>
              </div>
              <div className="text-center">
                <p className={`text-4xl font-bold ${isDarkMode ? 'text-purple-400' : 'text-purple-500'}`}>
                  {result.time}s
                </p>
                <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Time</p>
              </div>
            </div>
            <button
              onClick={handleReset}
              className={`mt-8 w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-lg transition-colors ${
                isDarkMode 
                  ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              <RefreshCcw className="w-5 h-5" />
              <span>Try Again</span>
            </button>
          </div>
        ) : (
          <>
            <div className={`rounded-lg p-6 mb-8 backdrop-blur-sm ${
              isDarkMode ? 'bg-white/10' : 'bg-white/70'
            } shadow-xl`}>
              <p className="text-lg leading-relaxed font-mono">
                {quote?.content.split('').map((char, index) => {
                  const isCorrect = userInput[index] === char;
                  const isCurrentChar = index === userInput.length;
                  const isTyped = userInput.length > index;
                  return (
                    <span
                      key={index}
                      className={`${
                        isTyped
                          ? isCorrect
                            ? isDarkMode ? 'text-green-400' : 'text-green-500'
                            : isDarkMode ? 'text-red-400' : 'text-red-500'
                          : ''
                      } ${isCurrentChar ? (isDarkMode ? 'bg-gray-700' : 'bg-gray-200') : ''}`}
                    >
                      {char}
                    </span>
                  );
                })}
              </p>
              <p className={`mt-4 italic ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                — {quote?.author}
              </p>
            </div>

            <textarea
              value={userInput}
              onChange={(e) => handleInput(e.target.value)}
              disabled={isFinished}
              className={`w-full p-4 rounded-lg transition-colors font-mono text-lg ${
                isDarkMode 
                  ? 'bg-gray-800 border-2 border-gray-700 focus:border-blue-500 text-white' 
                  : 'bg-white/70 border-2 border-gray-300 focus:border-blue-500'
              } focus:ring focus:ring-blue-200 backdrop-blur-sm`}
              rows={4}
              placeholder="Start typing..."
            />
          </>
        )}
      </div>
    </div>
  );
}