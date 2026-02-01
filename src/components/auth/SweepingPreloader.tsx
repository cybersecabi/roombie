import React from 'react';
import Lottie from 'lottie-react';
import carAnimation from '../../../Red Car.json';

interface SweepingPreloaderProps {
  text?: string;
  fullScreen?: boolean;
}

export const SweepingPreloader: React.FC<SweepingPreloaderProps> = ({
  text = 'Loading...',
  fullScreen = true
}) => {
  const containerClasses = fullScreen
    ? 'min-h-screen w-full'
    : 'w-full h-full';

  return (
    <div className={`${containerClasses} flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-black dark:to-gray-900 p-6`}>
      {/* Lottie Animation - slides from right to center */}
      <div className="relative w-72 h-72 animate-slide-in-right">
        <Lottie
          animationData={carAnimation}
          loop={true}
          autoplay={true}
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      {/* Animated loading text with dots */}
      <div className="mt-8 flex flex-col items-center">
        <p className="text-lg font-semibold text-gray-800 dark:text-gray-200 tracking-wide">
          {text}
        </p>
        <div className="flex gap-1 mt-3">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-6 w-48 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full animate-progress" />
      </div>
    </div>
  );
};
