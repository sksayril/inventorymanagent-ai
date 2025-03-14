import React from "react";
import { Outlet } from "react-router-dom";
import CollapsibleSidebar from "./layout/CollapsibleSidebar";
import MainContent from "./layout/MainContent";
import { useSidebar } from "@/context/SidebarContext";

interface HomeProps {
  title?: string;
}

const Home: React.FC<HomeProps> = ({ title = "Dashboard" }) => {
  const { isCollapsed } = useSidebar();

  return (
    <div className="flex h-screen bg-white">
      <CollapsibleSidebar />
      <div
        className={`flex-1 transition-all duration-300 ${isCollapsed ? "ml-[70px]" : "ml-[250px]"}`}
      >
        <MainContent title={title} showDashboard={true} />
      </div>
    </div>
  );
};

export default Home;
