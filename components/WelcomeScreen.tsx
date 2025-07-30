
import React from 'react';

interface WelcomeScreenProps {
  onStart: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg max-w-lg mx-auto">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        나의 학습 스타일 탐험!
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        몇 가지 간단한 질문에 답하고, 나에게 꼭 맞는 공부 방법을 찾아보세요.
        재미있는 탐험을 시작할 준비가 되었나요?
      </p>
      <button
        onClick={onStart}
        className="px-8 py-4 bg-yellow-400 text-gray-800 text-xl font-bold rounded-full shadow-md hover:bg-yellow-500 transform hover:scale-105 transition-all duration-300 animate-pulse"
      >
        탐험 시작하기!
      </button>
    </div>
  );
};

export default WelcomeScreen;
