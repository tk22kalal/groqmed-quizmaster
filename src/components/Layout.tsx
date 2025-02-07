import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { UserProfile } from "./UserProfile";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthPage = location.pathname === '/auth';

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Session error:", error);
          setIsAuthenticated(false);
          if (!isAuthPage) {
            navigate('/auth');
          }
          return;
        }

        setIsAuthenticated(!!session);
        if (!session && !isAuthPage) {
          navigate('/auth');
        } else if (session && isAuthPage) {
          navigate('/');
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setIsAuthenticated(false);
        if (!isAuthPage) {
          navigate('/auth');
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, !!session);
      
      if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
        localStorage.clear(); // Clear all local storage
        navigate('/auth');
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        setIsAuthenticated(true);
        if (isAuthPage) {
          navigate('/');
        }
      } else if (event === 'INITIAL_SESSION') {
        setIsAuthenticated(!!session);
        if (!session && !isAuthPage) {
          navigate('/auth');
        } else if (session && isAuthPage) {
          navigate('/');
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, isAuthPage]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {isAuthenticated && !isAuthPage && (
        <div className="fixed top-4 right-4 z-50">
          <UserProfile />
        </div>
      )}
      {children}
    </div>
  );
};