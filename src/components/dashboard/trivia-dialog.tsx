
"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BrainCircuit, Trophy, Check, X, ChevronsRight, Repeat } from "lucide-react";
import { TRIVIA_QUESTIONS } from '@/lib/trivia-data';
import type { TriviaQuestion } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Progress } from '../ui/progress';

interface TriviaDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  userName: string;
}

export default function TriviaDialog({ isOpen, onOpenChange, userName }: TriviaDialogProps) {
  const [questions, setQuestions] = useState<TriviaQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // High scores - Placeholder
  const highScores = useMemo(() => [
    { id: '1', userName: 'Florence N.', score: 10, date: '2024-07-30' },
    { id: '2', userName: 'Virginia H.', score: 9, date: '2024-07-29' },
    { id: '3', userName: userName || 'Tú', score: score, date: new Date().toISOString() },
  ].sort((a,b) => b.score - a.score), [score, userName]);

  const shuffleArray = (array: TriviaQuestion[]) => {
    return array.map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  };
  
  const startNewGame = useCallback(() => {
    const shuffledQuestions = shuffleArray(TRIVIA_QUESTIONS).slice(0, 10); // Take 10 random questions
    setQuestions(shuffledQuestions);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setIsFinished(false);
  },[]);

  useEffect(() => {
    if (isOpen) {
      startNewGame();
    }
  }, [isOpen, startNewGame]);

  const handleAnswerSelect = (optionText: string) => {
    if (showResult) return;
    setSelectedAnswer(optionText);
    setShowResult(true);
    const currentQuestion = questions[currentQuestionIndex];
    const correctOption = currentQuestion.options.find(opt => opt.isCorrect);
    if (optionText === correctOption?.text) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setIsFinished(true);
    }
  };
  
  const currentQuestion = questions[currentQuestionIndex];
  const progress = (currentQuestionIndex / questions.length) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl md:max-w-2xl h-[90vh] flex flex-col">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="flex items-center text-2xl">
            <BrainCircuit className="mr-2 h-6 w-6 text-primary" />
            ¡Trivia!
          </DialogTitle>
          <DialogDescription>
            Pon a prueba tus conocimientos.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-grow overflow-y-auto px-6">
          {!isFinished ? (
            currentQuestion && (
            <>
              <Progress value={progress} className="mb-4" />
              <p className="text-sm text-muted-foreground mb-4">Pregunta {currentQuestionIndex + 1} de {questions.length}</p>
              <Card>
                <CardHeader>
                  <CardTitle>{currentQuestion.text}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {currentQuestion.options.map((option, index) => {
                      const isSelected = selectedAnswer === option.text;
                      const isCorrect = option.isCorrect;
                      return (
                        <Button
                          key={index}
                          variant="outline"
                          className={cn("w-full h-auto justify-start text-left p-3 whitespace-normal",
                            showResult && isCorrect && "bg-green-100 border-green-400 text-green-800 hover:bg-green-200",
                            showResult && isSelected && !isCorrect && "bg-red-100 border-red-400 text-red-800 hover:bg-red-200",
                            isSelected && "ring-2 ring-primary"
                          )}
                          onClick={() => handleAnswerSelect(option.text)}
                          disabled={showResult}
                        >
                          {showResult && (isCorrect ? <Check className="mr-2 h-5 w-5"/> : isSelected ? <X className="mr-2 h-5 w-5"/> : <div className="w-7"/>)}
                          {option.text}
                        </Button>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
              {showResult && (
                <div className="mt-4 p-4 border-l-4 border-blue-400 bg-blue-50 dark:bg-blue-900/30">
                  <h4 className="font-bold text-blue-800 dark:text-blue-300">Explicación:</h4>
                  <p className="text-sm text-blue-700 dark:text-blue-200">{currentQuestion.explanation}</p>
                </div>
              )}
            </>
          )) : (
            <div className="text-center py-8">
              <Trophy className="mx-auto h-16 w-16 text-yellow-500 mb-4" />
              <h2 className="text-2xl font-bold">¡Juego Terminado!</h2>
              <p className="text-lg mt-2">Tu puntaje final es:</p>
              <p className="text-5xl font-bold text-primary my-2">{score}</p>
              <p className="text-muted-foreground">de {questions.length} preguntas.</p>
              
              <div className="mt-8">
                <h3 className="font-semibold text-lg">Cuadro de Honor (Semanal)</h3>
                <ul className="mt-2 text-left max-w-sm mx-auto">
                    {highScores.map((hs, i) => (
                        <li key={hs.id} className="flex justify-between p-2 bg-background rounded-md mb-1">
                            <span>{i + 1}. {hs.userName}</span>
                            <span className="font-bold">{hs.score} pts</span>
                        </li>
                    ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="p-6 pt-4 border-t">
          {isFinished ? (
              <Button onClick={startNewGame} className="w-full">
                <Repeat className="mr-2 h-4 w-4" /> Jugar de Nuevo
              </Button>
          ) : (
            <Button onClick={handleNextQuestion} disabled={!showResult} className="w-full">
              Siguiente <ChevronsRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
