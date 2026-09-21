import { useState, useEffect } from 'react';
import { FiSkipForward } from 'react-icons/fi';

interface SkipIntroProps {
  introStart: number;
  introEnd: number;
  currentTime: number;
  onSkip: () => void;
  autoSkip: boolean;
  onAutoSkipToggle: () => void;
}

export function SkipIntro({ introStart, introEnd, currentTime, onSkip, autoSkip, onAutoSkipToggle }: SkipIntroProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(currentTime >= introStart && currentTime < introEnd);
  }, [currentTime, introStart, introEnd]);

  if (!show) return null;

  return (
    <div className="absolute top-4 right-4 z-20 flex items-center gap-3">
      <button
        onClick={onAutoSkipToggle}
        className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
          autoSkip
            ? 'bg-purple-600 text-white'
            : 'bg-gray-800/80 text-gray-300 hover:text-white backdrop-blur-sm'
        }`}
      >
        Auto-skip
      </button>
      <button
        onClick={onSkip}
        className="flex items-center gap-1.5 rounded-lg bg-white/10 backdrop-blur-sm px-4 py-1.5 text-sm font-semibold text-white hover:bg-white/20 transition-colors"
      >
        <FiSkipForward className="h-4 w-4" />
        Skip Intro
      </button>
    </div>
  );
}
