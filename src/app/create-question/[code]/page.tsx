"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import OptionSelector from "@/components/OptionSelector";
import { useRouter, useParams } from "next/navigation";

export default function CreateQuestion() {
  const router = useRouter();
  const params = useParams();
  const code = params.code as string;
  
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState<string[]>(["", "", "", ""]);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion(e.target.value);
    setError(null);
  };

  const handleOptionsChange = (
    newOptions: string[],
    newSelectedIndex: number,
  ) => {
    setOptions(newOptions);
    setSelectedIndex(newSelectedIndex);
    setError(null);
  };

  const validateForm = () => {
    if (!question.trim()) {
      setError("Question is required");
      return false;
    }

    // Check if all options have values
    const emptyOptions = options.filter((option) => !option.trim());
    if (emptyOptions.length > 0) {
      setError("All options must have values");
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
      // Use the room-specific endpoint
      const response = await fetch(`/api/rooms/${code}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: question,
          options: options,
          answer: selectedIndex,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create question");
      }

      // Success!
      setSuccess(true);

      // Reset form for next question
      setTimeout(() => {
        setQuestion("");
        setOptions(["", "", "", ""]);
        setSelectedIndex(0);
        setSuccess(false);
        setIsSubmitting(false);
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setIsSubmitting(false);
    }
  };

  const handleFinish = () => {
    router.push(`/room/${code}`);
  };

  return (
    <div className="container mx-auto p-6 h-screen">
      <div className="max-w-lg mx-auto bg-slate-800 p-8 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold text-center mb-2">Create Questions</h2>
        <p className="text-center text-slate-400 mb-6">Room: {code}</p>

        {error && (
          <div className="text-red p-4">
            {error}
          </div>
        )}

        {success && (
          <div className="text-green">
            Question added successfully!
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
            disabled={isSubmitting}
          />
        </div>

        <div className="mb-6">
          <label className="block text-md font-medium mb-2">
            Options (select the correct answer)
          </label>
          <OptionSelector
            defaultOptions={options}
            onChange={handleOptionsChange}
            disabled={isSubmitting}
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <button
            onClick={handleFinish}
            className="py-3 px-4 rounded bg-slate-700 hover:bg-slate-600 transition-colors font-medium"
            disabled={isSubmitting}
          >
            Done Adding
          </button>

          <button
            onClick={handleSubmit}
            className={`py-3 px-4 rounded transition-colors ${
              isSubmitting
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Adding..." : "Add Question"}
          </button>
        </div>

        <p className="text-center text-sm text-slate-400">
          After adding all your questions, click &quot;Done Adding&quot; to return to the
          room.
        </p>
      </div>
    </div>
  );
}
