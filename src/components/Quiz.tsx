import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { generateQuestion } from "@/services/groqService";
import { toast } from "sonner";

interface QuizProps {
  subject: string;
}

export const Quiz = ({ subject }: QuizProps) => {
  const [question, setQuestion] = useState<any>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);

  const loadQuestion = async () => {
    const newQuestion = await generateQuestion(subject);
    if (newQuestion) {
      setQuestion(newQuestion);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  useEffect(() => {
    loadQuestion();
  }, [subject]);

  const handleAnswerSelect = (answer: string) => {
    if (selectedAnswer) return;
    setSelectedAnswer(answer);
    setShowExplanation(true);
    setTotalQuestions(prev => prev + 1);
    
    if (answer === question.correctAnswer) {
      setScore(prev => prev + 1);
      toast.success("Correct answer!");
    } else {
      toast.error("Incorrect answer");
    }
  };

  const handleNext = () => {
    loadQuestion();
  };

  if (!question) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medical-blue"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-medical-blue">Subject: {subject}</h2>
        <div className="text-right">
          <p className="text-lg font-medium">
            Score: {score}/{totalQuestions}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <p className="text-lg font-medium mb-4">{question.question}</p>

        <div className="space-y-3">
          {question.options.map((option: string, index: number) => {
            const letter = option.charAt(0);
            const isSelected = selectedAnswer === letter;
            const isCorrect = question.correctAnswer === letter;
            
            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(letter)}
                disabled={!!selectedAnswer}
                className={`w-full text-left p-3 rounded-md transition-colors ${
                  isSelected
                    ? isCorrect
                      ? "bg-green-100 border-green-500"
                      : "bg-red-100 border-red-500"
                    : selectedAnswer && isCorrect
                    ? "bg-green-100 border-green-500"
                    : "bg-gray-50 hover:bg-gray-100"
                } border ${
                  isSelected ? "border-2" : "border"
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>

        {showExplanation && (
          <div className="mt-4 p-4 bg-blue-50 rounded-md">
            <h3 className="font-semibold mb-2">Explanation:</h3>
            <p>{question.explanation}</p>
          </div>
        )}

        {selectedAnswer && (
          <Button
            onClick={handleNext}
            className="w-full mt-4 bg-medical-blue hover:bg-blue-700"
          >
            Next Question
          </Button>
        )}
      </div>
    </div>
  );
};