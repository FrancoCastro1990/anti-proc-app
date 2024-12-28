"use client";
import { useState, useEffect, useCallback, useRef } from "react";

type TimerMode = "countdown" | "stopwatch";

interface TimerProps {
  mode: TimerMode;
  initialTime?: number;
  alarmSound?: string;
}

const radius = 45; // Radio del círculo
const circumference = 2 * Math.PI * radius;

const Timer: React.FC<TimerProps> = ({
  mode,
  initialTime = 0,
  alarmSound = "/alarm.wav",
}) => {
  const [time, setTime] = useState(initialTime);
  const [lastTime, setLastTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isEnd, setIsEnd] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Formatea el tiempo en HH:MM:SS
  const formatTime = useCallback((seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }, []);

  useEffect(() => {
    setIsRunning(false);
    setTime(initialTime);
  }, [initialTime]);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isRunning) {
      timer = setInterval(() => {
        setTime((prevTime) => {
          if (mode === "countdown") {
            const newTime = prevTime > 0 ? prevTime - 1 : 0;
            if (newTime === 0) {
              setIsRunning(false);
              setIsEnd(true);
            }
            return newTime;
          }
          return prevTime + 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isRunning, mode]);

  useEffect(() => {
    if (alarmSound) {
      audioRef.current = new Audio(alarmSound);
      audioRef.current.loop = true;
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [alarmSound]);

  useEffect(() => {
    if (isEnd && audioRef.current) {
      audioRef.current.play();
    } else if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0; // Reinicia el audio
    }
  }, [isEnd]);

  useEffect(() => {
    console.log("Time changed", time);
  }, [time]);

  const handleStart = () => {
    setIsRunning(true);
    setIsEnd(false);
  };
  const handlePause = () => setIsRunning(false);
  const handleStop = () => {
    setIsRunning(false);
    if (mode === "stopwatch") {
      setLastTime(time);
    }
    setTime(mode === "countdown" ? initialTime : 0);
    setIsEnd(false);
  };
  const handleReset = () => {
    setIsRunning(false);
    if (mode === "stopwatch") {
      setLastTime(time);
    }
    setTime(mode === "countdown" ? initialTime : 0);
    setIsEnd(false);
    setIsRunning(true);
  };

  const progress =
    mode === "countdown" ? (time / initialTime) * circumference : 0;

  return (
    <div className="flex flex-col items-center h-40 ">
      <div className={`relative w-28 h-28 ${isEnd ? "animate-pulse" : ""}`}>
        <svg width="112" height="112" className="absolute top-0 left-0">
          <circle
            cx="56"
            cy="56"
            r={radius}
            stroke="#605f5fad" // Color de fondo del borde
            strokeWidth="6"
            fill="none"
          />
          <circle
            cx="56"
            cy="56"
            r={radius}
            stroke={mode === "countdown" ? "#3b82f6" : "#499c3a26"} // Color del progreso
            strokeWidth="6"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={progress}
            strokeLinecap="round"
            className={`transition-stroke-dashoffset duration-100 ease-linear ${
              mode === "stopwatch" && isRunning && "animate-ping"
            }`}
            style={{ transform: "rotate(-90deg)", transformOrigin: "center" }} // Inversión del borde
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-2xl font-bold">{formatTime(time)}</div>
        </div>
      </div>
      <div className="flex space-x-4">
        {!isRunning ? (
          <svg
            onClick={handleStart}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="hover:text-indigo-200"
          >
            <circle cx="12" cy="12" r="10" />
            <polygon points="10 8 16 12 10 16 10 8" />
          </svg>
        ) : (
          <svg
            onClick={handlePause}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="hover:text-indigo-200"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="10" x2="10" y1="15" y2="9" />
            <line x1="14" x2="14" y1="15" y2="9" />
          </svg>
        )}

        <svg
          onClick={handleStop}
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="hover:text-indigo-200"
        >
          <circle cx="12" cy="12" r="10" />
          <rect x="9" y="9" width="6" height="6" rx="1" />
        </svg>
        <svg
          onClick={handleReset}
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="hover:text-indigo-200"
        >
          <path d="M10 2h4" />
          <path d="M12 14v-4" />
          <path d="M4 13a8 8 0 0 1 8-7 8 8 0 1 1-5.3 14L4 17.6" />
          <path d="M9 17H4v5" />
        </svg>
      </div>
      {mode === "stopwatch" && lastTime > 0 && (
        <div className="text-sm text-gray-500 flex self-start items-center  gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            //class="lucide lucide-clock"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          {formatTime(lastTime)}
        </div>
      )}
    </div>
  );
};

export default Timer;
