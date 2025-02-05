import { UserProfile } from "./UserProfile";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="fixed top-4 right-4 z-50">
        <UserProfile />
      </div>
      {children}
    </div>
  );
};