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

export const generateQuestion = async (subject: string): Promise<Question | null> => {
  const apiKey = localStorage.getItem("GROQ_API_KEY");
  
  if (!apiKey) {
    toast.error("Please enter your Groq API key first");
    return null;
  }

  try {
    console.log("Generating question for subject:", subject);
    
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
            content: "You are a medical education expert. Generate a NEET PG/INICET style MCQ question."
          },
          {
            role: "user",
            content: `Generate a multiple choice question for ${subject} in JSON format with the following structure:
            {
              "question": "question text",
              "options": ["A) option1", "B) option2", "C) option3", "D) option4"],
              "correctAnswer": "A", // just the letter
              "explanation": "detailed explanation",
              "subject": "${subject}"
            }`
          }
        ],
        temperature: 0.7
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate question");
    }

    const data: GroqResponse = await response.json();
    console.log("Groq response:", data);
    
    const questionData = JSON.parse(data.choices[0].message.content);
    return questionData as Question;
  } catch (error) {
    console.error("Error generating question:", error);
    toast.error("Failed to generate question. Please try again.");
    return null;
  }
}