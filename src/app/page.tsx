"use client";

import React, { useState, useEffect } from 'react';
import { Question } from './types/question'
import { useRouter } from 'next/navigation';

export default function Home() {
  const [score, setScore] = useState(0)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const router = useRouter();

  function addPoint(score: number) {
    return setScore(score + 1)
  }

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/questions');
        const data = await response.json();
        console.log('Fetched data:', data);
        setQuestions(data);
      } catch (error) {
        console.error(`Failed to fetch questions: ${error instanceof Error ? error.message : String(error)}`);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  // Console log outside useEffect to see the updated state
  useEffect(() => {
    console.log('Updated questions state:', questions);
  }, [questions]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading questions...</div>;
  }

  if (!questions || questions.length === 0) {
    return <div className="flex justify-center items-center h-screen">No questions available. Please check your database.</div>;
  }

  return (
    <div className="container mx-auto flex-center flex-column min-h-screen p-4">
      <div className="flex-center flex-column w-full max-w-content">
        <h2 className="text-2xl font-bold text-center mb-6">Triviargh</h2>
        <div className="flex-center flex-column gap-4 w-full max-w-2xl">
          {currentQuestionIndex < questions.length ? (
            <>
              <h3 className="text-xl text-center mb-4">{questions[currentQuestionIndex].question}</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', width: '100%' }}>
                {questions[currentQuestionIndex].options.map((option, index) => (
                  <button
                    key={index}
                    style={{ 
                      padding: '12px', 
                      cursor: 'pointer',
                      backgroundColor: '#1a1a1a',
                      borderRadius: '8px',
                      border: '1px solid transparent',
                      fontSize: '1em',
                      fontWeight: '500'
                    }}
                    onClick={() => {
                      if (index === questions[currentQuestionIndex].answer) {
                        addPoint(score);
                      }
                      setCurrentQuestionIndex(currentQuestionIndex + 1);
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center">
              <p className="text-lg mb-4">Quiz finished! Your final score is {score} out of {questions.length}.</p>
              <button
                onClick={() => {
                  setScore(0);
                  setCurrentQuestionIndex(0);
                }}
                style={{ 
                  padding: '10px 20px', 
                  cursor: 'pointer',
                  backgroundColor: '#1a1a1a',
                  borderRadius: '8px',
                  border: '1px solid transparent',
                  fontSize: '1em',
                  fontWeight: '500'
                }}
              >
                Restart Quiz
              </button>
            </div>
          )}
          <p className="text-lg font-semibold text-center mt-4">Score: {score}</p>
          <button
            onClick={() => {router.push('/create-question')}}
            style={{
              padding: '10px 20px',
              cursor: 'pointer',
              backgroundColor: '#1a1a1a',
              borderRadius: '8px',
              border: '1px solid transparent',
              fontSize: '1em',
              fontWeight: '500'
            }}
          >
            Create a Question
          </button>
        </div>
      </div>
    </div>
  )
}