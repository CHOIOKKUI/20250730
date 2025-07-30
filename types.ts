
export enum MBTIType {
  E = 'E',
  I = 'I',
  S = 'S',
  N = 'N',
  T = 'T',
  F = 'F',
  J = 'J',
  P = 'P',
}

export interface QuestionOption {
  text: string;
  type: MBTIType;
}

export interface Question {
  question: string;
  options: [QuestionOption, QuestionOption];
}

export interface MBTIResult {
  title: string;
  description: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  koreanStrategy: string[];
  mathStrategy: string[];
  englishStrategy: string[];
}

export enum AppState {
  LOADING,
  WELCOME,
  TESTING,
  ANALYZING,
  RESULT,
  ERROR,
}
