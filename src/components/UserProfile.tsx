import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";

interface Profile {
  name: string;
  college_name: string;
  avatar_url: string | null;
}

export const UserProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profileData, error } = await supabase
            .from('profiles')
            .select('name, college_name, avatar_url')
            .eq('id', user.id)
            .single();

          if (error) throw error;
          setProfile(profileData);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  if (!profile) return null;

  return (
    <div className="flex items-center gap-3 p-3 bg-white/50 backdrop-blur-sm rounded-lg shadow-sm">
      <Avatar className="h-10 w-10 border-2 border-primary">
        <AvatarImage src={profile.avatar_url || undefined} />
        <AvatarFallback>
          <User className="h-5 w-5 text-muted-foreground" />
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <span className="font-medium text-sm">{profile.name}</span>
        <span className="text-xs text-muted-foreground">{profile.college_name}</span>
      </div>
    </div>
  );
};