import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import type { QuizQuestion } from "@db/schema";

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const { toast } = useToast();

  const { data: questions, isLoading } = useQuery({
    queryKey: ["quizQuestions"],
    queryFn: async () => {
      const response = await fetch("/api/quiz/questions");
      if (!response.ok) throw new Error("Failed to fetch questions");
      return response.json() as Promise<QuizQuestion[]>;
    },
  });

  const handleAnswer = (answer: string) => {
    if (!questions) return;
    
    const correct = answer === questions[currentQuestion].correctAnswer;
    if (correct) {
      setScore(score + 1);
      toast({
        title: "Correct!",
        description: "Great job!",
        variant: "default",
      });
    } else {
      toast({
        title: "Incorrect",
        description: `The correct answer was: ${questions[currentQuestion].correctAnswer}`,
        variant: "destructive",
      });
    }

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setIsComplete(true);
    }
  };

  if (isLoading) {
    return <div>Loading quiz questions...</div>;
  }

  if (isComplete) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Quiz Complete!</h2>
          <p className="text-xl mb-4">
            You scored {score} out of {questions?.length}
          </p>
          <Button
            onClick={() => {
              setCurrentQuestion(0);
              setScore(0);
              setIsComplete(false);
            }}
          >
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  const question = questions?.[currentQuestion];
  if (!question) return null;

  const answers = [
    question.correctAnswer,
    question.wrongAnswer1,
    question.wrongAnswer2,
    question.wrongAnswer3,
  ].sort(() => Math.random() - 0.5);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Whale Knowledge Quiz</h1>
        <Progress
          value={(currentQuestion / questions.length) * 100}
          className="w-full"
        />
      </div>

      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">{question.question}</h2>
          <div className="grid grid-cols-1 gap-3">
            {answers.map((answer, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full text-left h-auto py-4"
                onClick={() => handleAnswer(answer)}
              >
                {answer}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
