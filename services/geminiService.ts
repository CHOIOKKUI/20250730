
import { GoogleGenAI, Type } from "@google/genai";
import type { Question, MBTIResult } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const questionSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      question: { type: Type.STRING, description: "학생을 위한 질문" },
      options: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            text: { type: Type.STRING, description: "선택지 텍스트" },
            type: { type: Type.STRING, description: "MBTI 유형 (E,I,S,N,T,F,J,P)" },
          },
          required: ["text", "type"],
        },
      },
    },
    required: ["question", "options"],
  },
};

const resultSchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "MBTI 유형에 대한 긍정적인 별명" },
    description: { type: Type.STRING, description: "학습 스타일에 대한 전반적인 설명" },
    strengths: { type: Type.ARRAY, items: { type: Type.STRING }, description: "주요 강점 목록" },
    weaknesses: { type: Type.ARRAY, items: { type: Type.STRING }, description: "보완하면 좋을 점 목록" },
    recommendations: { type: Type.ARRAY, items: { type: Type.STRING }, description: "추천 학습법 목록" },
    koreanStrategy: { type: Type.ARRAY, items: { type: Type.STRING }, description: "국어 과목 추천 학습 전략" },
    mathStrategy: { type: Type.ARRAY, items: { type: Type.STRING }, description: "수학 과목 추천 학습 전략" },
    englishStrategy: { type: Type.ARRAY, items: { type: Type.STRING }, description: "영어 과목 추천 학습 전략" },
  },
  required: ["title", "description", "strengths", "weaknesses", "recommendations", "koreanStrategy", "mathStrategy", "englishStrategy"],
};


export const generateQuestions = async (): Promise<Question[]> => {
  try {
    const prompt = `
      초등학생의 MBTI 기반 학습 유형을 진단하기 위한 질문 12개를 만들어줘. 
      각 질문은 두 개의 선택지를 가져야 하고, 각 선택지는 MBTI의 네 가지 지표(E/I, S/N, T/F, J/P) 중 하나에 해당해야 해. 
      네 가지 지표 각각에 대해 3개의 질문을 만들어줘. (E/I 3개, S/N 3개, T/F 3개, J/P 3개)
      질문은 초등학생이 이해하기 쉬운 일상적인 상황에 대한 것이어야 해.
      응답은 반드시 지정된 JSON 스키마 형식으로 제공해줘.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: questionSchema,
      },
    });

    const jsonText = response.text.trim();
    const questions = JSON.parse(jsonText);

    // Validate the parsed data
    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error("Generated questions are not in the expected format.");
    }
    
    return questions as Question[];
  } catch (error) {
    console.error("Error generating questions:", error);
    throw new Error("질문을 생성하는 데 실패했습니다. 잠시 후 다시 시도해주세요.");
  }
};


export const generateResultDescription = async (mbtiType: string): Promise<MBTIResult> => {
  try {
    const prompt = `
      "${mbtiType}" 유형을 가진 초등학생을 위한 학습 스타일 분석 결과를 작성해줘. 
      다음 내용을 반드시 포함해야 해:
      1. 유형에 대한 간략하고 긍정적인 별명 (예: '열정적인 탐험가', '따뜻한 중재자').
      2. 학습 스타일의 특징.
      3. 주요 강점 (최소 2개).
      4. 보완하면 좋을 점 (최소 2개).
      5. 이 유형에 맞는 추천 학습법 (최소 2개).
      6. 국어, 수학, 영어 과목별 구체적인 학습 전략 (각 과목별 최소 2개).

      전체적으로 초등학생과 학부모가 이해하기 쉽고, 매우 격려가 되고 긍정적인 어조로 작성해줘.
      응답은 반드시 지정된 JSON 스키마 형식으로 제공해줘.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: resultSchema,
      },
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as MBTIResult;
  } catch (error) {
    console.error("Error generating result description:", error);
    throw new Error("결과를 분석하는 데 실패했습니다. 잠시 후 다시 시도해주세요.");
  }
};
