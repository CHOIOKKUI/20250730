
import React from 'react';

interface LoadingSpinnerProps {
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ text = "로딩 중..." }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="w-16 h-16 border-8 border-yellow-300 border-solid rounded-full border-t-transparent animate-spin"></div>
      <p className="text-xl text-gray-600">{text}</p>
    </div>
  );
};

export default LoadingSpinner;
