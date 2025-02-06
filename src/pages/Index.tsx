import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Hero Section */}
      <div className="pt-20 pb-12 md:pt-24 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              AI-Powered Medical Exam Preparation Platform
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Revolutionize your NEET PG, USMLE, FMGE, INICET, and MBBS exam preparation with personalized AI-generated questions and comprehensive explanations.
            </p>
            <Button 
              className="bg-medical-blue text-white hover:bg-blue-700 text-lg px-8 py-3"
              onClick={() => navigate("/auth")}
            >
              Start Free Practice
            </Button>
          </div>
        </div>
      </div>

      {/* Getting Started Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Getting Started with MedQuiz AI</h2>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-medical-blue">Step 1: Obtain Your Groq AI API Key</h3>
              <ol className="list-decimal list-inside space-y-4 text-gray-700">
                <li>Visit the official Groq AI Console at console.groq.com</li>
                <li>Create a new account or sign in to your existing account</li>
                <li>Navigate to the API section in your dashboard</li>
                <li>Generate a new API key for MedQuiz AI integration</li>
                <li>Copy your API key and keep it secure</li>
              </ol>
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-medical-blue">Step 2: Explore Our Platform</h3>
              <div className="space-y-4 text-gray-700">
                <p>MedQuiz AI is designed for medical students and professionals preparing for:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li><span className="font-medium">NEET PG:</span> National Eligibility cum Entrance Test for Postgraduates</li>
                  <li><span className="font-medium">USMLE:</span> United States Medical Licensing Examination</li>
                  <li><span className="font-medium">FMGE:</span> Foreign Medical Graduate Examination</li>
                  <li><span className="font-medium">INICET:</span> INI Combined Entrance Test</li>
                  <li><span className="font-medium">MBBS:</span> Bachelor of Medicine and Bachelor of Surgery</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Why Choose MedQuiz AI?</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-medical-blue mb-4">Personalized Learning</h3>
              <p className="text-gray-600">AI-generated questions adapt to your knowledge level and learning pace.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-medical-blue mb-4">Comprehensive Coverage</h3>
              <p className="text-gray-600">Access questions from all major medical subjects and specializations.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-medical-blue mb-4">Detailed Explanations</h3>
              <p className="text-gray-600">Get in-depth explanations and references for each question.</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gradient-to-r from-medical-blue to-blue-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Excel in Your Medical Exams?</h2>
          <p className="text-xl text-blue-100 mb-8">Join thousands of medical students preparing smarter with AI.</p>
          <Button 
            className="bg-white text-medical-blue hover:bg-gray-100 text-lg px-8 py-3"
            onClick={() => navigate("/auth")}
          >
            Start Free Practice Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;