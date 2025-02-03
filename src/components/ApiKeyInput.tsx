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
      // Show only last 4 characters of the key
      setSavedKey(`...${existingKey.slice(-4)}`);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      toast.error("Please enter an API key");
      return;
    }
    localStorage.setItem("GROQ_API_KEY", apiKey.trim());
    toast.success("API key saved successfully");
    onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-medical-blue mb-4">Enter Groq API Key</h2>
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
    </form>
  );
};