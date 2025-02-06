import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import { useState } from "react";

export const Navigation = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-md fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <Button 
              variant="ghost" 
              className="text-2xl font-bold text-medical-blue"
              onClick={() => handleNavigation("/")}
            >
              MedQuiz AI
            </Button>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={() => handleNavigation("/privacy")}
            >
              Privacy Policy
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => handleNavigation("/disclaimer")}
            >
              Disclaimer
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => handleNavigation("/about")}
            >
              About Us
            </Button>
            <Button 
              className="bg-medical-blue text-white hover:bg-blue-700"
              onClick={() => handleNavigation("/auth")}
            >
              Login / Sign Up
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white">
            <Button
              variant="ghost"
              className="w-full text-left"
              onClick={() => handleNavigation("/privacy")}
            >
              Privacy Policy
            </Button>
            <Button
              variant="ghost"
              className="w-full text-left"
              onClick={() => handleNavigation("/disclaimer")}
            >
              Disclaimer
            </Button>
            <Button
              variant="ghost"
              className="w-full text-left"
              onClick={() => handleNavigation("/about")}
            >
              About Us
            </Button>
            <Button
              className="w-full bg-medical-blue text-white hover:bg-blue-700"
              onClick={() => handleNavigation("/auth")}
            >
              Login / Sign Up
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};