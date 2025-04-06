"use client";

import React, { useState, useEffect } from "react";
import { Question } from "@/app/types/question";
import { useRouter, useParams } from "next/navigation";

export default function Quiz() {
  const [score, setScore] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const router = useRouter();
  const params = useParams<{ code: string }>();
  const code = params?.code as string;

  function shuffleArray(array: Question[]): Question[] {
    const shuffled = [...array];

    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
  }

  function addPoint() {
    setScore((prevScore) => prevScore + 1);
  }

  // Handle answer selection with animation
  const handleAnswerClick = (index: number) => {
    const correctAnswer = questions[currentQuestionIndex].answer;
    const correct = index === correctAnswer;
    
    setSelectedOptionIndex(index);
    setIsCorrect(correct);
    
    if (correct) {
      addPoint();
    }
    
    // Delay moving to next question to show animation
    setTimeout(() => {
      setSelectedOptionIndex(null);
      setIsCorrect(null);
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    }, 800);
  };

  useEffect(() => {
    // Only fetch if we have a valid code
    if (code && code !== "undefined") {
      const fetchQuestions = async () => {
        try {
          setLoading(true);
          const response = await fetch(`/api/rooms/${code}`);

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to fetch questions");
          }

          const data = await response.json();

          if (data.length === 0) {
            throw new Error("No questions available in this room");
          }

          setQuestions(shuffleArray(data));
        } catch (error) {
          console.error(
            `Failed to fetch questions: ${error instanceof Error ? error.message : String(error)}`,
          );
          setError(
            error instanceof Error ? error.message : "Failed to load questions",
          );
        } finally {
          setLoading(false);
        }
      };

      fetchQuestions();
    } else {
      setLoading(false);
      setError("Invalid room code");
    }
  }, [code]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading questions...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen p-4">
        <div className="p-4 bg-red-500/20 border border-red-500 rounded text-red-200 mb-4 max-w-md">
          {error}
        </div>
        <button
          onClick={() => router.push(`/room/${code}`)}
          className="py-2 px-4 bg-slate-700 hover:bg-slate-600 rounded transition-colors"
        >
          Back to Room
        </button>
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-screen p-4">
        <div className="mb-4 text-center">
          No questions available in this room.
        </div>
        <button
          onClick={() => router.push(`/room/${code}`)}
          className="py-2 px-4 bg-slate-700 hover:bg-slate-600 rounded transition-colors"
        >
          Back to Room
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-center mb-2">Triviargh</h2>
        <p className="text-center text-slate-400 mb-6">Room: {code}</p>

        <div className="w-full">
          {currentQuestionIndex < questions.length ? (
            <div className="w-full bg-slate-800 p-6 rounded-lg">
              <h3 className="text-xl text-center mb-6">
                {questions[currentQuestionIndex].question}
              </h3>
              <div className="grid grid-cols-2 gap-4 w-full">
                {questions[currentQuestionIndex].options.map(
                  (option, index) => (
                    <button
                      key={index}
                      className={`p-3 bg-slate-700 hover:bg-slate-600 rounded border border-slate-600 font-medium transition-colors
                        ${selectedOptionIndex === index && isCorrect ? 'pulse-animation' : ''}
                        ${selectedOptionIndex === index && !isCorrect ? 'shake-animation' : ''}
                      `}
                      disabled={selectedOptionIndex !== null}
                      onClick={() => handleAnswerClick(index)}
                    >
                      {option}
                    </button>
                  ),
                )}
              </div>

              <p className="text-sm font-semibold text-center mt-6">
                Question {currentQuestionIndex + 1} of {questions.length}
              </p>
              <p className="text-sm text-center mt-2">Score: {score}</p>
            </div>
          ) : (
            <div className="w-full bg-slate-800 p-6 rounded-lg text-center">
              <h3 className="text-2xl font-bold mb-4">Quiz Finished!</h3>
              <p className="text-lg mb-6">
                Your final score is {score} out of {questions.length}.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => {
                    setScore(0);
                    setCurrentQuestionIndex(0);
                  }}
                  className="py-3 px-4 bg-slate-700 hover:bg-slate-600 rounded transition-colors font-medium"
                >
                  Play Again
                </button>
                <button
                  onClick={() => router.push(`/room/${code}`)}
                  className="py-3 px-4 bg-blue-600 hover:bg-blue-700 rounded transition-colors font-medium"
                >
                  Back to Room
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}