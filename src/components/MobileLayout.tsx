
import MobileNavigation from "./MobileNavigation";

interface MobileLayoutProps {
  children: React.ReactNode;
  hideNavbar?: boolean;
}

const MobileLayout = ({ children, hideNavbar = false }: MobileLayoutProps) => {
  return (
    <>
      {children}
      {!hideNavbar && <MobileNavigation />}
    </>
  );
};

export default MobileLayout;
