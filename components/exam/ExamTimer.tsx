// components/exam/ExamTimer.tsx
'use client';

import { useState, useEffect } from 'react';

interface ExamTimerProps {
  duration: number;  // นาที
  onTimeUp: () => void;
}

export default function ExamTimer({ duration, onTimeUp }: ExamTimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration * 60); // แปลงเป็นวินาที
  
  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }
    
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeLeft, onTimeUp]);
  
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  
  const isWarning = timeLeft <= 300; // น้อยกว่า 5 นาที
  
  return (
    <div className={`fixed top-4 right-4 px-4 py-2 rounded-lg font-mono font-bold text-lg ${
      isWarning ? 'bg-red-100 text-red-800 animate-pulse' : 'bg-slate-800 text-white'
    }`}>
      ⏱️ {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
    </div>
  );
}