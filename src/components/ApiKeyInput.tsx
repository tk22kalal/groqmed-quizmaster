import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export const ApiKeyInput = () => {
  const [apiKey, setApiKey] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      toast.error("Please enter an API key");
      return;
    }
    localStorage.setItem("GROQ_API_KEY", apiKey.trim());
    toast.success("API key saved successfully");
    setApiKey("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-medical-blue mb-4">Enter Groq API Key</h2>
      <Input
        type="password"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        placeholder="Enter your Groq API key"
        className="w-full"
      />
      <Button type="submit" className="w-full bg-medical-blue hover:bg-blue-700">
        Save API Key
      </Button>
    </form>
  );
};