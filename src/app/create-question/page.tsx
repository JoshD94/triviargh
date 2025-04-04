"use client";
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import OptionSelector from "@/components/OptionSelector";
import { useRouter } from 'next/navigation';

export default function CreateQuestion() {
    const router = useRouter();
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState<string[]>(['', '', '', '']);
    const [selectedIndex, setSelectedIndex] = useState<number>(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuestion(e.target.value);
        setError(null);
    };

    const handleOptionsChange = (newOptions: string[], newSelectedIndex: number) => {
        setOptions(newOptions);
        setSelectedIndex(newSelectedIndex);
        setError(null);
    };

    const validateForm = () => {
        if (!question.trim()) {
            setError('Question is required');
            return false;
        }
        
        // Check if all options have values
        const emptyOptions = options.filter(option => !option.trim());
        if (emptyOptions.length > 0) {
            setError('All options must have values');
            return false;
        }
        
        return true;
    };

    const handleSubmit = async () => {
        setError(null);
        
        if (!validateForm()) {
            return;
        }
        
        setIsSubmitting(true);
        
        try {
            const response = await fetch('/api/questions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    question: question,
                    options: options,
                    answer: selectedIndex
                }),
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to create question');
            }
            
            // Success!
            setSuccess(true);
            setQuestion('');
            setOptions(['', '', '', '']);
            setSelectedIndex(0);
            
            // Redirect to home after 2 seconds
            setTimeout(() => {
                router.push('/');
            }, 2000);
            
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto p-6">
            <div className="max-w-lg mx-auto bg-slate-800 p-8 rounded-lg shadow-lg">
                <h2 className="font-bold text-center mb-6">Create a New Question</h2>
                
                {error && (
                    <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded text-red-200">
                        {error}
                    </div>
                )}
                
                {success && (
                    <div className="mb-4 p-3 bg-green-500/20 border border-green-500 rounded text-green-200">
                        Question created successfully! Redirecting...
                    </div>
                )}
                
                <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">Question</label>
                    <Input 
                        type="text" 
                        value={question}
                        onChange={handleQuestionChange}
                        placeholder="Enter your question" 
                        className="h-14 text-lg w-full"
                        disabled={isSubmitting || success}
                    />
                </div>
                
                <div className="mb-6">
                    <label className="block text-md font-medium mb-2">Options (select the correct answer)</label>
                    <OptionSelector 
                        defaultOptions={options} 
                        onChange={handleOptionsChange}
                    />
                </div>
                
                <button 
                    onClick={handleSubmit}
                    className={`w-full font-bold py-3 px-4 rounded transition-colors ${
                        isSubmitting || success 
                            ? 'bg-gray-500 cursor-not-allowed' 
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                    disabled={isSubmitting || success}
                >
                    {isSubmitting ? 'Submitting...' : 'Submit Question'}
                </button>
            </div>
        </div>
    );
}
