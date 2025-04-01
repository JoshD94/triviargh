"use client";

import React, { useState, useEffect } from 'react';
import { Question } from './types/question'

export default function Home() {
  const [score, setScore] = useState(0)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [loading, setLoading] = useState(true)

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
    return <div>Loading questions...</div>;
  }

  if (!questions || questions.length === 0) {
    return <div>No questions available. Please check your database.</div>;
  }

  return (
    <>
      <div>
        <h2>Triviargh</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {currentQuestionIndex < questions.length ? (
            <>
              <h3 style={{ marginBottom: '20px' }}>{questions[currentQuestionIndex].question}</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                {questions[currentQuestionIndex].options.map((option, index) => (
                  <button
                    key={index}
                    style={{ padding: '10px', cursor: 'pointer' }}
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
            <div>
              <p>Quiz finished! Your final score is {score} out of {questions.length}.</p>
              <button
                onClick={() => {
                  setScore(0);
                  setCurrentQuestionIndex(0);
                }}
                style={{ padding: '10px', cursor: 'pointer' }}
              >
                Restart Quiz
              </button>
            </div>
          )}
        </div>
        <p>Score: {score}</p>
      </div>
    </>
  )
}