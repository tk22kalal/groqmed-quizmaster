import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface ApiKeyInputProps {
  onSave: () => void;
}

export const ApiKeyInput = ({ onSave }: ApiKeyInputProps) => {
  const [apiKey, setApiKey] = useState("");
  const [savedKey, setSavedKey] = useState("");

  useEffect(() => {
    const existingKey = localStorage.getItem("GROQ_API_KEY");
    if (existingKey) {
      setSavedKey(`...${existingKey.slice(-4)}`);
    }
  }, []);

  const validateApiKey = (key: string) => {
    // Basic validation for Groq API key format
    const groqKeyPattern = /^gsk_[A-Za-z0-9]{48}$/;
    return groqKeyPattern.test(key.trim());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedKey = apiKey.trim();
    
    if (!trimmedKey) {
      toast.error("Please enter an API key");
      return;
    }

    if (!validateApiKey(trimmedKey)) {
      toast.error("Invalid Groq API key format. It should start with 'gsk_' followed by 48 characters");
      return;
    }

    // Test the API key with a simple request
    try {
      const response = await fetch("https://api.groq.com/openai/v1/models", {
        headers: {
          Authorization: `Bearer ${trimmedKey}`,
        },
      });

      if (!response.ok) {
        throw new Error("Invalid API key");
      }

      localStorage.setItem("GROQ_API_KEY", trimmedKey);
      toast.success("API key validated and saved successfully");
      onSave();
    } catch (error) {
      console.error("API key validation error:", error);
      toast.error("Invalid API key. Please check your key and try again");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md w-full mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-900">Enter Groq API Key</h2>
          <p className="text-sm text-gray-500">
            Your API key will be stored securely in your browser's local storage.
          </p>
        </div>
        
        <Input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder={savedKey || "Enter your Groq API key"}
          className="w-full"
        />
        
        <Button type="submit" className="w-full bg-medical-blue hover:bg-blue-700">
          Save API Key
        </Button>
        
        <div className="text-sm text-gray-500">
          Need a Groq API key?{" "}
          <a
            href="https://console.groq.com/keys"
            target="_blank"
            rel="noopener noreferrer"
            className="text-medical-blue hover:underline"
          >
            Get one here
          </a>
        </div>
      </form>
    </div>
  );
};