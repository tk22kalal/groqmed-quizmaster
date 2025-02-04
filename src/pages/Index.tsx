import { useState, useEffect } from "react";
import { ApiKeyInput } from "@/components/ApiKeyInput";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Quiz } from "@/components/Quiz";
import { AuthForm } from "@/components/AuthForm";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { UserProfile } from "@/components/UserProfile";

const subjects = [
  "Complete MBBS",
  "Anatomy",
  "Physiology",
  "Biochemistry",
  "Pathology",
  "Pharmacology",
  "Microbiology",
  "Medicine",
  "Surgery",
  "Obstetrics & Gynecology",
  "Pediatrics"
];

const chapters = {
  Anatomy: ["Complete Subject", "Head & Neck", "Thorax", "Abdomen", "Upper Limb", "Lower Limb", "Neuroanatomy"],
  Physiology: ["Complete Subject", "General Physiology", "Blood", "Nerve-Muscle", "CNS", "CVS", "Respiratory", "Renal", "GIT", "Endocrine"],
  // ... Add chapters for other subjects
};

const difficultyLevels = ["Easy", "Medium", "Hard"];
const questionCounts = ["5", "10", "15", "20", "30", "50", "No Limit"];
const timePerQuestion = ["30", "45", "60", "90", "120", "No Limit"];

const Index = () => {
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedChapter, setSelectedChapter] = useState<string>("");
  const [specificTopic, setSpecificTopic] = useState<string>("");
  const [difficulty, setDifficulty] = useState<string>("easy");
  const [questionCount, setQuestionCount] = useState<string>("No Limit");
  const [timeLimit, setTimeLimit] = useState<string>("No Limit");
  const [quizStarted, setQuizStarted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasApiKey, setHasApiKey] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        if (!session) {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        setIsAuthenticated(true);
        
        // Check if API key exists
        const apiKey = localStorage.getItem("GROQ_API_KEY");
        setHasApiKey(!!apiKey);
      } catch (error) {
        console.error("Auth check error:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session);
      if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
        localStorage.removeItem("GROQ_API_KEY"); // Clear API key on logout
        navigate('/');
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        setIsAuthenticated(true);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem("GROQ_API_KEY"); // Clear API key on logout
      toast.success("Logged out successfully");
      navigate('/');
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error(error.message);
    }
  };

  const handleApiKeySaved = () => {
    setHasApiKey(true);
  };

  const handleStartQuiz = () => {
    if (!selectedSubject) {
      toast.error("Please select a subject");
      return;
    }

    if (selectedSubject !== "Complete MBBS" && !selectedChapter) {
      toast.error("Please select a chapter");
      return;
    }

    setQuizStarted(true);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  // Show auth form if not authenticated
  if (!isAuthenticated) {
    return <AuthForm onAuthSuccess={() => setIsAuthenticated(true)} />;
  }

  // Show API key input if authenticated but no API key
  if (!hasApiKey) {
    return <ApiKeyInput onSave={handleApiKeySaved} />;
  }

  if (quizStarted) {
    return (
      <div className="relative">
        <div className="absolute top-4 right-4 z-10">
          <UserProfile />
        </div>
        <Quiz
          subject={selectedSubject}
          chapter={selectedChapter}
          topic={specificTopic}
          difficulty={difficulty}
          questionCount={questionCount}
          timeLimit={timeLimit}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {isAuthenticated && hasApiKey && !quizStarted && (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-medical-blue">
              NEET PG Quiz Setup
            </h1>
            <div className="flex items-center gap-4">
              <UserProfile />
              <Button onClick={handleLogout} variant="outline">
                Logout
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Select onValueChange={setSelectedSubject} value={selectedSubject}>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Select Subject" />
                </SelectTrigger>
                <SelectContent className="bg-white shadow-lg border-2">
                  {subjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="chapter">Chapter</Label>
              <Select 
                onValueChange={setSelectedChapter} 
                value={selectedChapter}
                disabled={!selectedSubject || selectedSubject === "Complete MBBS"}
              >
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Select Chapter" />
                </SelectTrigger>
                <SelectContent className="bg-white shadow-lg border-2">
                  {selectedSubject && chapters[selectedSubject as keyof typeof chapters]?.map((chapter) => (
                    <SelectItem key={chapter} value={chapter}>
                      {chapter}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="topic">Specific Topic (Optional)</Label>
              <Input
                id="topic"
                placeholder="Enter specific topic"
                value={specificTopic}
                onChange={(e) => setSpecificTopic(e.target.value)}
                disabled={!selectedChapter || selectedChapter === "Complete Subject"}
                className="bg-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty Level</Label>
              <Select onValueChange={setDifficulty} value={difficulty}>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Select Difficulty" />
                </SelectTrigger>
                <SelectContent className="bg-white shadow-lg border-2">
                  {difficultyLevels.map((level) => (
                    <SelectItem key={level} value={level.toLowerCase()}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="questionCount">Number of Questions</Label>
              <Select onValueChange={setQuestionCount} value={questionCount}>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Select Question Count" />
                </SelectTrigger>
                <SelectContent className="bg-white shadow-lg border-2">
                  {questionCounts.map((count) => (
                    <SelectItem key={count} value={count}>
                      {count}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeLimit">Time per Question (seconds)</Label>
              <Select onValueChange={setTimeLimit} value={timeLimit}>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Select Time per Question" />
                </SelectTrigger>
                <SelectContent className="bg-white shadow-lg border-2">
                  {timePerQuestion.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time} {time !== "No Limit" ? "seconds" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <Button
              onClick={handleStartQuiz}
              className="bg-medical-blue hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold"
            >
              Start Quiz
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
