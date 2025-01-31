import { useState } from "react";
import { ApiKeyInput } from "@/components/ApiKeyInput";
import { Quiz } from "@/components/Quiz";
import { Button } from "@/components/ui/button";

const subjects = [
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

const Index = () => {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const apiKey = localStorage.getItem("GROQ_API_KEY");

  if (!apiKey) {
    return <ApiKeyInput />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {!selectedSubject ? (
        <div className="max-w-4xl mx-auto p-6">
          <h1 className="text-3xl font-bold text-medical-blue mb-8 text-center">
            NEET PG Quiz
          </h1>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {subjects.map((subject) => (
              <Button
                key={subject}
                onClick={() => setSelectedSubject(subject)}
                className="p-4 bg-white hover:bg-medical-blue hover:text-white transition-colors border rounded-lg shadow-sm"
              >
                {subject}
              </Button>
            ))}
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <Button
              onClick={() => setSelectedSubject(null)}
              variant="outline"
              className="mb-4"
            >
              ← Back to Subjects
            </Button>
          </div>
          <Quiz subject={selectedSubject} />
        </div>
      )}
    </div>
  );
};

export default Index;