import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { toast } from "sonner";

console.log('QuizResults - Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('QuizResults - Supabase Key exists:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface QuizResultsProps {
  score: number;
  totalQuestions: number;
  onRestartQuiz: () => void;
  subject: string;
  chapter: string;
  topic: string;
  difficulty: string;
}

export const QuizResults = ({ 
  score, 
  totalQuestions, 
  onRestartQuiz,
  subject,
  chapter,
  topic,
  difficulty
}: QuizResultsProps) => {
  const [userName, setUserName] = useState<string>("");
  const percentage = Math.round((score / totalQuestions) * 100);
  
  useEffect(() => {
    const saveResult = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const { data: userData } = await supabase
            .from('profiles')
            .select('name')
            .eq('id', user.id)
            .single();
          
          setUserName(userData?.name || 'User');
          
          const { error } = await supabase
            .from('quiz_results')
            .insert([
              {
                user_id: user.id,
                score,
                total_questions: totalQuestions,
                percentage,
                subject,
                chapter,
                topic,
                difficulty
              }
            ]);
            
          if (error) throw error;
          toast.success("Result saved successfully!");
        }
      } catch (error: any) {
        console.error('Error saving result:', error);
        toast.error("Failed to save result");
      }
    };
    
    saveResult();
  }, []);
  
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
          {userName && (
            <div className="text-xl text-gray-600">
              Great job, {userName}!
            </div>
          )}
          <div className="text-4xl font-bold text-medical-blue">
            {score} / {totalQuestions}
          </div>
          <div className="text-2xl text-gray-600">
            {percentage}% Correct
          </div>
          <div className="space-y-2">
            <p className="text-gray-600">
              Keep practicing to improve your medical knowledge.
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