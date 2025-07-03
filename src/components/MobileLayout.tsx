
import MobileNavigation from "./MobileNavigation";

interface MobileLayoutProps {
  children: React.ReactNode;
}

const MobileLayout = ({ children }: MobileLayoutProps) => {
  return (
    <>
      {children}
      <MobileNavigation />
    </>
  );
};

export default MobileLayout;
