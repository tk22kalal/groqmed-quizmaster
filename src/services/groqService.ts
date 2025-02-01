import { toast } from "sonner";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

interface GroqResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  subject: string;
}

export const generateQuestion = async (scope: string, difficulty: string = 'easy'): Promise<Question | null> => {
  const apiKey = localStorage.getItem("GROQ_API_KEY");
  
  if (!apiKey) {
    toast.error("Please enter your Groq API key first");
    return null;
  }

  const getDifficultyPrompt = (level: string) => {
    switch(level.toLowerCase()) {
      case 'easy':
        return "Generate a basic MBBS level question from standard medical reference books.";
      case 'medium':
        return "Generate a moderate difficulty question that includes both theoretical and clinical aspects.";
      case 'hard':
        return "Generate a complex clinical case-based question suitable for advanced NEET PG/FMGE/INICET preparation.";
      default:
        return "Generate a basic MBBS level question.";
    }
  };

  try {
    console.log(`Generating ${difficulty} question for scope:`, scope);
    console.log("Making request to Groq API...");
    
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "mixtral-8x7b-32768",
        messages: [
          {
            role: "system",
            content: `You are a medical education expert specializing in NEET PG, FMGE, and INICET exam preparation. ${getDifficultyPrompt(difficulty)}`
          },
          {
            role: "user",
            content: `Generate a ${difficulty} level multiple choice question for ${scope} in JSON format with the following structure:
            {
              "question": "question text",
              "options": ["A) option1", "B) option2", "C) option3", "D) option4"],
              "correctAnswer": "A", // just the letter
              "explanation": "detailed explanation",
              "subject": "${scope}"
            }`
          }
        ],
        temperature: 0.7,
        max_tokens: 1024
      }),
    });

    if (!response.ok) {
      console.error("Groq API error:", response.status, response.statusText);
      const errorData = await response.json().catch(() => ({}));
      console.error("Error details:", errorData);
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const data: GroqResponse = await response.json();
    console.log("Groq API response received:", data);
    
    if (!data.choices?.[0]?.message?.content) {
      throw new Error("Invalid response format from API");
    }

    const questionData = JSON.parse(data.choices[0].message.content);
    return questionData as Question;
  } catch (error) {
    console.error("Error generating question:", error);
    toast.error("Failed to generate question. Please check your API key and try again.");
    return null;
  }
};