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

const getRandomQuestionType = () => {
  const questionTypes = [
    "anatomy and structure identification",
    "physiological functions",
    "clinical correlations",
    "embryological development",
    "nerve pathways and innervation",
    "blood supply and vasculature",
    "anatomical variations",
    "surgical landmarks",
    "diagnostic features",
    "pathological conditions"
  ];
  return questionTypes[Math.floor(Math.random() * questionTypes.length)];
};

export const generateQuestion = async (scope: string, difficulty: string = 'easy'): Promise<Question | null> => {
  const apiKey = localStorage.getItem("GROQ_API_KEY");
  
  if (!apiKey) {
    toast.error("Please enter your Groq API key first");
    return null;
  }

  const getDifficultyPrompt = (level: string) => {
    switch(level.toLowerCase()) {
      case 'easy':
        return "Generate a basic MBBS level question focusing on fundamental concepts.";
      case 'medium':
        return "Generate a moderate difficulty question that combines theoretical knowledge with clinical applications.";
      case 'hard':
        return "Generate a complex clinical scenario-based question that requires integration of multiple concepts.";
      default:
        return "Generate a basic MBBS level question.";
    }
  };

  const questionType = getRandomQuestionType();

  try {
    console.log(`Generating ${difficulty} question for scope:`, scope);
    console.log("Question type:", questionType);
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
            content: `Generate a ${difficulty} level multiple choice question about ${questionType} in ${scope}. The question should be unique and not repetitive. Format the response in JSON with the following structure:
            {
              "question": "question text",
              "options": ["A) option1", "B) option2", "C) option3", "D) option4"],
              "correctAnswer": "A", // just the letter
              "explanation": "detailed explanation",
              "subject": "${scope}"
            }`
          }
        ],
        temperature: 0.9,
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