import React from "react";
import MetricsOverview from "../dashboard/MetricsOverview";
import LowStockAlerts from "../dashboard/LowStockAlerts";
import RecentSales from "../dashboard/RecentSales";

interface MainContentProps {
  children?: React.ReactNode;
  title?: string;
  showDashboard?: boolean;
}

const MainContent: React.FC<MainContentProps> = ({
  children,
  title = "Dashboard",
  showDashboard = true,
}) => {
  return (
    <div className="flex-1 p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        </header>

        <main>
          {showDashboard ? (
            <div className="space-y-6">
              <MetricsOverview />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <LowStockAlerts />
                <RecentSales />
              </div>
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
};

export default MainContent;
