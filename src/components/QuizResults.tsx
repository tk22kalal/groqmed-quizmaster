import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy } from "lucide-react";

interface QuizResultsProps {
  score: number;
  totalQuestions: number;
  onRestartQuiz: () => void;
}

export const QuizResults = ({ score, totalQuestions, onRestartQuiz }: QuizResultsProps) => {
  const percentage = Math.round((score / totalQuestions) * 100);
  
  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card className="text-center">
        <CardHeader>
          <CardTitle className="flex items-center justify-center gap-2">
            <Trophy className="h-8 w-8 text-yellow-500" />
            Quiz Complete!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-4xl font-bold text-medical-blue">
            {score} / {totalQuestions}
          </div>
          <div className="text-2xl text-gray-600">
            {percentage}% Correct
          </div>
          <div className="space-y-2">
            <p className="text-gray-600">
              Great effort! Keep practicing to improve your medical knowledge.
            </p>
            <Button 
              onClick={onRestartQuiz}
              className="mt-4 bg-medical-blue hover:bg-medical-blue/90"
            >
              Start New Quiz
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};