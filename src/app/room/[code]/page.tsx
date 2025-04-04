"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Question } from "@/app/types/question";

export default function Room() {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const code = params.code as string;

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
          setQuestions(data);
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

  const handleStartGame = () => {
    router.push(`/quiz/${code}`);
  };

  const handleAddQuestion = () => {
    router.push(`/create-question/${code}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading room...
      </div>
    );
  }

  return (
    <div className="container mx-auto flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-lg">
        <h2 className="text-3xl font-bold text-center mb-2">Room: {code}</h2>
        <p className="text-center mb-8 text-slate-400">
          Share this code with others to join
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded text-red-200">
            {error}
          </div>
        )}

        <div className="bg-slate-800 p-6 rounded-lg mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              Questions ({questions.length})
            </h2>
            <button
              onClick={handleAddQuestion}
              className="py-2 px-3 rounded bg-slate-700 hover:bg-slate-600 transition-colors text-sm font-medium"
            >
              Add Question
            </button>
          </div>

          {questions.length === 0 ? (
            <p className="text-slate-400 mb-4">
              No questions added yet. Add some questions to start the game!
            </p>
          ) : (
            <div className="max-h-64 overflow-y-auto mb-12">
              {questions.map((q, index) => (
                <div
                  key={index}
                  className="p-3 border border-slate-700 rounded-md mb-2"
                >
                  <p className="font-medium">{q.question}</p>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={handleStartGame}
            className={`w-full py-4 px-4 rounded transition-colors font-medium ${
              questions.length === 0
                ? "bg-slate-600 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
            disabled={questions.length === 0}
          >
            {questions.length === 0 ? "Add Questions to Start" : "Start Game"}
          </button>
        </div>

        <div className="text-center mt-8">
          <button
            onClick={() => router.push("/")}
            className="text-slate-400 hover:text-white transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
