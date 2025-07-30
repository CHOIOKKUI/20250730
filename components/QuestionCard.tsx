
import React from 'react';
import type { Question, QuestionOption } from '../types';

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  onAnswer: (option: QuestionOption) => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, questionNumber, onAnswer }) => {
  return (
    <div className="w-full max-w-2xl bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl transition-opacity duration-500">
      <p className="text-xl font-bold text-yellow-600 mb-4">질문 {questionNumber}</p>
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center min-h-[8rem] flex items-center justify-center">
        {question.question}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => onAnswer(option)}
            className="w-full p-6 text-lg text-gray-700 bg-white rounded-xl shadow-md border-2 border-gray-200 hover:bg-yellow-100 hover:border-yellow-400 transform hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-yellow-300"
          >
            {option.text}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;
