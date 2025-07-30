
import React, { useState, useEffect, useCallback } from 'react';
import { AppState, MBTIType, type Question, type QuestionOption, type MBTIResult } from './types';
import { generateQuestions, generateResultDescription } from './services/geminiService';
import WelcomeScreen from './components/WelcomeScreen';
import LoadingSpinner from './components/LoadingSpinner';
import QuestionCard from './components/QuestionCard';
import ProgressBar from './components/ProgressBar';
import ResultDisplay from './components/ResultDisplay';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.LOADING);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<MBTIType, number>>({
    E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0,
  });
  const [mbtiType, setMbtiType] = useState<string | null>(null);
  const [mbtiResult, setMbtiResult] = useState<MBTIResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const initializeTest = useCallback(async () => {
    try {
      setAppState(AppState.LOADING);
      const fetchedQuestions = await generateQuestions();
      if (fetchedQuestions && fetchedQuestions.length > 0) {
        setQuestions(fetchedQuestions);
        setAppState(AppState.WELCOME);
      } else {
        throw new Error("No questions were generated.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.");
      setAppState(AppState.ERROR);
    }
  }, []);

  useEffect(() => {
    initializeTest();
  }, [initializeTest]);
  
  const handleAnswer = (option: QuestionOption) => {
    setAnswers(prev => ({ ...prev, [option.type]: prev[option.type] + 1 }));

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      calculateAndFetchResult();
    }
  };

  const calculateAndFetchResult = useCallback(async () => {
    setAppState(AppState.ANALYZING);

    const determinedType = [
      answers.E >= answers.I ? 'E' : 'I',
      answers.S >= answers.N ? 'S' : 'N',
      answers.T >= answers.F ? 'T' : 'F',
      answers.J >= answers.P ? 'J' : 'P',
    ].join('');

    setMbtiType(determinedType);

    try {
      const resultData = await generateResultDescription(determinedType);
      setMbtiResult(resultData);
      setAppState(AppState.RESULT);
    } catch (err) {
      setError(err instanceof Error ? err.message : "결과를 가져오는 데 실패했습니다.");
      setAppState(AppState.ERROR);
    }
  }, [answers]);
  
  const handleRetry = () => {
    setAnswers({ E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 });
    setCurrentQuestionIndex(0);
    setMbtiResult(null);
    setMbtiType(null);
    setError(null);
    setAppState(AppState.WELCOME);
  };
  
  const renderContent = () => {
    switch (appState) {
      case AppState.LOADING:
        return <LoadingSpinner text="질문을 만들고 있어요..." />;
      case AppState.WELCOME:
        return <WelcomeScreen onStart={() => setAppState(AppState.TESTING)} />;
      case AppState.TESTING:
        return (
          <div className="w-full max-w-2xl flex flex-col items-center gap-8">
            <ProgressBar current={currentQuestionIndex + 1} total={questions.length} />
            <QuestionCard
              key={currentQuestionIndex}
              question={questions[currentQuestionIndex]}
              questionNumber={currentQuestionIndex + 1}
              onAnswer={handleAnswer}
            />
          </div>
        );
      case AppState.ANALYZING:
        return <LoadingSpinner text="결과를 분석하고 있어요..." />;
      case AppState.RESULT:
        if (mbtiResult && mbtiType) {
          return <ResultDisplay mbtiType={mbtiType} result={mbtiResult} onRetry={handleRetry} />;
        }
        return null;
      case AppState.ERROR:
         return (
          <div className="text-center p-8 bg-red-100/80 border border-red-400 text-red-700 rounded-2xl shadow-lg max-w-lg mx-auto">
            <h1 className="text-2xl font-bold mb-4">이런! 문제가 발생했어요</h1>
            <p className="mb-6">{error}</p>
            <button
              onClick={initializeTest}
              className="px-6 py-3 bg-yellow-400 text-gray-800 font-bold rounded-full shadow-md hover:bg-yellow-500 transition-colors"
            >
              다시 시도하기
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen w-full bg-yellow-50 flex flex-col bg-[url('https://www.transparenttextures.com/patterns/light-paper-fibers.png')]">
      <main className="flex-grow flex items-center justify-center p-4">
        {renderContent()}
      </main>
      <footer className="text-center py-4 text-gray-500 text-sm">
        20250730 저작권 호두
      </footer>
    </div>
  );
};

export default App;
