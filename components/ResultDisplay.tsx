
import React from 'react';
import type { MBTIResult } from '../types';

interface ResultDisplayProps {
  mbtiType: string;
  result: MBTIResult;
  onRetry: () => void;
}

const ResultCard: React.FC<{ title: string; children: React.ReactNode; icon: string }> = ({ title, children, icon }) => (
  <div className="bg-white p-6 rounded-xl shadow-md h-full">
    <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
      <span className="text-3xl mr-3">{icon}</span>
      {title}
    </h3>
    {children}
  </div>
);

const ResultDisplay: React.FC<ResultDisplayProps> = ({ mbtiType, result, onRetry }) => {
  return (
    <div className="w-full max-w-5xl mx-auto p-6 md:p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg">
      <div className="text-center mb-8">
        <p className="text-xl text-gray-600">나의 학습 유형은?</p>
        <h1 className="text-6xl font-extrabold text-yellow-500 my-2">{mbtiType}</h1>
        <h2 className="text-3xl font-bold text-gray-700">"{result.title}"</h2>
        <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">{result.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <ResultCard title="나의 강점" icon="🌟">
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            {result.strengths.map((item, index) => <li key={index}>{item}</li>)}
          </ul>
        </ResultCard>
        <ResultCard title="보완하면 좋아요" icon="🌱">
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            {result.weaknesses.map((item, index) => <li key={index}>{item}</li>)}
          </ul>
        </ResultCard>
        <ResultCard title="추천 학습법" icon="💡">
          <ul className="list-disc list-inside space-y-2 text-gray-700">
              {result.recommendations.map((item, index) => <li key={index}>{item}</li>)}
          </ul>
        </ResultCard>
        <ResultCard title="나를 위한 국어 공부법" icon="📖">
            <ul className="list-disc list-inside space-y-2 text-gray-700">
                {result.koreanStrategy.map((item, index) => <li key={index}>{item}</li>)}
            </ul>
        </ResultCard>
        <ResultCard title="나를 위한 수학 공부법" icon="🧮">
            <ul className="list-disc list-inside space-y-2 text-gray-700">
                {result.mathStrategy.map((item, index) => <li key={index}>{item}</li>)}
            </ul>
        </ResultCard>
        <ResultCard title="나를 위한 영어 공부법" icon="🔠">
            <ul className="list-disc list-inside space-y-2 text-gray-700">
                {result.englishStrategy.map((item, index) => <li key={index}>{item}</li>)}
            </ul>
        </ResultCard>
      </div>

      <div className="text-center">
        <button
          onClick={onRetry}
          className="px-8 py-4 bg-yellow-400 text-gray-800 text-xl font-bold rounded-full shadow-md hover:bg-yellow-500 transform hover:scale-105 transition-all duration-300"
        >
          다시 검사하기
        </button>
      </div>
    </div>
  );
};

export default ResultDisplay;
