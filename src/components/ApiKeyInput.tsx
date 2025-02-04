import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface ApiKeyInputProps {
  onSave: () => void;
}

export const ApiKeyInput = ({ onSave }: ApiKeyInputProps) => {
  const [apiKey, setApiKey] = useState("");
  const [savedKey, setSavedKey] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const existingKey = localStorage.getItem("GROQ_API_KEY");
    if (existingKey) {
      setSavedKey(`...${existingKey.slice(-4)}`);
    }
  }, []);

  const validateApiKey = (key: string) => {
    const cleanKey = key.replace(/\s+/g, '');
    console.log("Validating key length:", cleanKey.length);
    console.log("Key starts with gsk_:", cleanKey.startsWith('gsk_'));
    
    const groqKeyPattern = /^gsk_[A-Za-z0-9]{48}$/;
    const isValid = groqKeyPattern.test(cleanKey);
    console.log("Key matches pattern:", isValid);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedKey = apiKey.replace(/\s+/g, '');
    
    if (!cleanedKey) {
      toast.error("Please enter an API key");
      return;
    }

    if (!validateApiKey(cleanedKey)) {
      toast.error("Invalid Groq API key format. It should start with 'gsk_' followed by 48 characters");
      return;
    }

    try {
      console.log("Making test request to Groq API...");
      const response = await fetch("https://api.groq.com/openai/v1/models", {
        headers: {
          Authorization: `Bearer ${cleanedKey}`,
        },
      });

      console.log("API Response status:", response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error details:", errorData);
        throw new Error(errorData.error?.message || "Invalid API key");
      }

      localStorage.setItem("GROQ_API_KEY", cleanedKey);
      toast.success("API key validated and saved successfully");
      onSave();
      // Redirect to the question settings page after successful save
      navigate("/");
    } catch (error: any) {
      console.error("API key validation error:", error);
      toast.error(error.message || "Invalid API key. Please check your key and try again");
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