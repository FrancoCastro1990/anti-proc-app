"use client";
import React, { useState } from "react";
import Timer from "./components/Timer";

const Home = () => {
  const [inputTime, setInputTime] = useState("00:00:00");
  const [initialTime, setInitialTime] = useState<number | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d{0,2}:\d{0,2}:\d{0,2}$/.test(value)) {
      setInputTime(value);
    }
  };

  const parseTimeToSeconds = (time: string): number => {
    const [hours, minutes, seconds] = time
      .split(":")
      .map((t) => parseInt(t, 10) || 0);
    return hours * 3600 + minutes * 60 + seconds;
  };

  const handleSetTimer = () => {
    setInitialTime(parseTimeToSeconds(inputTime));
  };

  return (
    <main>
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={inputTime}
          onChange={handleInputChange}
          className="w-32 p-2 text-center border border-gray-300 rounded text-gray-900"
          placeholder="00:00:00"
          maxLength={8}
        />
        <button
          onClick={handleSetTimer}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Set Timer
        </button>
      </div>
      <div className="min-h-screen flex items-center justify-center gap-4">
        <Timer mode="countdown" initialTime={initialTime ?? 10} />
        <Timer mode="stopwatch" />
        {/* 300 segundos = 5 minutos */}
      </div>
    </main>
  );
};

export default Home;
