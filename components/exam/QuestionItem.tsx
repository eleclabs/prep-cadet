// components/exam/QuestionItem.tsx
'use client';

import { Question } from '@/types/exam';

interface QuestionItemProps {
  question: Question;
  selectedAnswer: number | null;
  onSelect: (questionId: string, answerIndex: number) => void;
  showResult?: boolean;
}

export default function QuestionItem({ 
  question, 
  selectedAnswer, 
  onSelect,
  showResult = false 
}: QuestionItemProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
      <p className="text-lg font-medium text-slate-800 mb-4">{question.text}</p>
      
      <div className="space-y-3">
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const isCorrect = showResult && index === question.correctAnswer;
          const isWrong = showResult && isSelected && !isCorrect;
          
          return (
            <label
              key={index}
              className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition ${
                isCorrect ? 'border-green-500 bg-green-50' :
                isWrong ? 'border-red-500 bg-red-50' :
                isSelected ? 'border-blue-500 bg-blue-50' :
                'border-slate-200 hover:border-slate-300'
              }`}
            >
              <input
                type="radio"
                name={`question-${question._id}`}
                value={index}
                checked={isSelected}
                onChange={() => !showResult && onSelect(question._id!, index)}
                disabled={showResult}
                className="w-5 h-5 text-blue-600"
              />
              <span className={`flex-1 ${isCorrect ? 'text-green-800 font-medium' : isWrong ? 'text-red-800' : 'text-slate-700'}`}>
                {String.fromCharCode(65 + index)}. {option}
              </span>
              {showResult && isCorrect && <span className="text-green-600">✅</span>}
              {showResult && isWrong && <span className="text-red-600">❌</span>}
            </label>
          );
        })}
      </div>
      
      {showResult && question.explanation && (
        <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <p className="text-sm font-medium text-slate-700">💡 คำอธิบาย:</p>
          <p className="text-sm text-slate-600 mt-1">{question.explanation}</p>
        </div>
      )}
    </div>
  );
}