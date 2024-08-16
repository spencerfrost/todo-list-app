import React, { useState } from "react";
import Header from "./components/Header";
interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        <div className={'flex-1 transition-all duration-300 ease-in-out'}>
          <main>{children}</main>
        </div>
      </div>
      {isSidebarOpen && (
        <button
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
          onClick={toggleSidebar}
          tabIndex={0}
          title="Toggle sidebar"
        ></button>
      )}
    </div>
  );
};

export default MainLayout;
