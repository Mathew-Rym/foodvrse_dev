import MobileNavigation from "./MobileNavigation";
import { useAuth } from "@/contexts/AuthContext";

interface MobileLayoutProps {
  children: React.ReactNode;
  hideNavbar?: boolean;
}

const MobileLayout = ({ children, hideNavbar = false }: MobileLayoutProps) => {
  const { isAuthenticated } = useAuth();
  
  return (
    <>
      {children}
      {!hideNavbar && isAuthenticated && <MobileNavigation />}
    </>
  );
};

export default MobileLayout;
