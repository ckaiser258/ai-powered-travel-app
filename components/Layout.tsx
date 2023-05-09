import { ReactNode } from "react";
import AppBar from "./AppBar";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <AppBar />
      <main>{children}</main>
    </>
  );
};

export default Layout;
