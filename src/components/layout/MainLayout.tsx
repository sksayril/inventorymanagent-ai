import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import CollapsibleSidebar from "./CollapsibleSidebar";

const MainLayout = () => {
  return (
    <div className="flex h-screen bg-white">
      <CollapsibleSidebar />
      <div className="flex-1 ml-[70px] transition-all duration-300">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
