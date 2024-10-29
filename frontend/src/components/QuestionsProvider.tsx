"use client";
import { QuestionFields } from "backend/src/controllers/questions";
import React, { createContext, useContext, useState } from "react";

interface QuestionsContext {
  questions: QuestionFields[];
  refetchQuestions: () => Promise<void>;
  searchQuestions: (searchTerm: string) => Promise<void>;
}

const QuestionsContext = createContext<QuestionsContext | undefined>(undefined);

export const QuestionsProvider = ({ children, data }: { children: React.ReactNode; data: QuestionFields[] }) => {
  const [questions, setQuestions] = useState<QuestionFields[]>(data);

  const refetchQuestions = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}`);
    const newQuestions = await response.json();
    setQuestions(newQuestions);
  };

  const searchQuestions = async (searchTerm: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/search?q=${searchTerm}`);
    const newQuestions = await response.json();
    setQuestions(newQuestions);
  };

  return (
    <QuestionsContext.Provider value={{ questions, refetchQuestions, searchQuestions }}>
      {children}
    </QuestionsContext.Provider>
  );
};

export const useQuestions = (): QuestionsContext => {
  const context = useContext(QuestionsContext);
  if (!context) {
    throw new Error("useQuestions must be used within a QuestionsProvider");
  }
  return context;
};
