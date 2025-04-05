"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";

export default function Home() {
  const router = useRouter();
  const [roomCode, setRoomCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleJoinRoom = async () => {
    if (!roomCode.trim()) {
      setError("Please enter a room code");
      return;
    }

    setIsLoading(true);

    // Navigate to the room - our API will create it if it doesn't exist
    router.push(`/room/${roomCode}`);
  };

  const handleCreateRoom = () => {
    // Generate a random room code
    const newRoomCode = Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase();
    setRoomCode(newRoomCode);
  };

  return (
    <div className="container mx-auto flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-8">Triviargh</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded text-red-200 w-full">
            {error}
          </div>
        )}

        <div className="w-full space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium">Room Code</label>
            <Input
              type="text"
              value={roomCode}
              onChange={(e) => {
                setRoomCode(e.target.value.toUpperCase());
                setError(null);
              }}
              placeholder="Enter room code"
              className="h-14 text-lg w-full uppercase"
              maxLength={6}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handleCreateRoom}
              className="py-3 px-4 rounded bg-slate-700 hover:bg-slate-600 transition-colors font-medium"
              disabled={isLoading}
            >
              Generate Code
            </button>

            <button
              onClick={handleJoinRoom}
              className={`py-3 px-4 rounded transition-colors font-medium ${
                isLoading
                  ? "bg-slate-600 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
              disabled={isLoading || !roomCode.trim()}
            >
              {isLoading ? "Joining..." : "Join Room"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
