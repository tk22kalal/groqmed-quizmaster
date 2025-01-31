import { useState } from "react";
import { ApiKeyInput } from "@/components/ApiKeyInput";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Quiz } from "@/components/Quiz";

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
const timeLimits = ["10 min", "15 min", "30 min", "45 min", "60 min", "90 min", "120 min", "No Limit"];

const Index = () => {
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedChapter, setSelectedChapter] = useState<string>("");
  const [specificTopic, setSpecificTopic] = useState<string>("");
  const [difficulty, setDifficulty] = useState<string>("");
  const [questionCount, setQuestionCount] = useState<string>("");
  const [timeLimit, setTimeLimit] = useState<string>("");
  const [quizStarted, setQuizStarted] = useState(false);

  const apiKey = localStorage.getItem("GROQ_API_KEY");

  const handleStartQuiz = () => {
    if (!selectedSubject || !difficulty || !questionCount || !timeLimit) {
      toast.error("Please fill in all required fields");
      return;
    }
    setQuizStarted(true);
  };

  if (!apiKey) {
    return <ApiKeyInput />;
  }

  if (quizStarted) {
    return (
      <Quiz
        subject={selectedSubject}
        chapter={selectedChapter}
        topic={specificTopic}
        difficulty={difficulty}
        questionCount={questionCount}
        timeLimit={timeLimit}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md space-y-6">
        <h1 className="text-3xl font-bold text-medical-blue mb-8 text-center">
          NEET PG Quiz Setup
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Select onValueChange={setSelectedSubject} value={selectedSubject}>
              <SelectTrigger>
                <SelectValue placeholder="Select Subject" />
              </SelectTrigger>
              <SelectContent>
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
              <SelectTrigger>
                <SelectValue placeholder="Select Chapter" />
              </SelectTrigger>
              <SelectContent>
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
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="difficulty">Difficulty Level</Label>
            <Select onValueChange={setDifficulty} value={difficulty}>
              <SelectTrigger>
                <SelectValue placeholder="Select Difficulty" />
              </SelectTrigger>
              <SelectContent>
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
              <SelectTrigger>
                <SelectValue placeholder="Select Question Count" />
              </SelectTrigger>
              <SelectContent>
                {questionCounts.map((count) => (
                  <SelectItem key={count} value={count}>
                    {count}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="timeLimit">Time Limit</Label>
            <Select onValueChange={setTimeLimit} value={timeLimit}>
              <SelectTrigger>
                <SelectValue placeholder="Select Time Limit" />
              </SelectTrigger>
              <SelectContent>
                {timeLimits.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
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
    </div>
  );
};

export default Index;