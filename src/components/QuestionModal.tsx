"use client";

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Question } from '@/app/types/question';

interface QuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomCode: string;
  onQuestionGenerated: (question: Question) => void;
}

export default function QuestionModal({ 
  isOpen, 
  onClose, 
  roomCode, 
  onQuestionGenerated 
}: QuestionModalProps) {
  const [theme, setTheme] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedTheme = theme.trim();
    
    if (!trimmedTheme) {
      setError('Please enter a theme');
      return;
    }
    
    if (trimmedTheme.includes(' ')) {
      setError('Theme must be a single word (no spaces)');
      return;
    }
    
    if (trimmedTheme.length > 15) {
      setError('Theme must be 15 characters or less');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          roomCode,
          theme: theme.trim()
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate question');
      }

      const question = await response.json();
      onQuestionGenerated(question);
      onClose();
      setTheme('');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md bg-slate-800 rounded-lg p-6 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white"
        >
          <X size={20} />
        </button>
        
        <h2 className="text-xl font-bold mb-4">Generate AI Question</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="theme" className="block text-sm font-medium mb-2">
              Question Theme
            </label>
            <input
              type="text"
              id="theme"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              placeholder="e.g. Science, History, Sports (one word only)"
              className="w-full p-3 bg-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {error && (
              <p className="mt-2 text-sm text-red-400">{error}</p>
            )}
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded transition-colors font-medium 
              ${loading ? 'bg-slate-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {loading ? 'Generating...' : 'Generate Question'}
          </button>
        </form>
      </div>
    </div>
  );
}