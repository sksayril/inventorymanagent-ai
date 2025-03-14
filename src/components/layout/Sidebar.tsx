import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Receipt,
  FileText,
  Settings,
  LogOut,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
}

const SidebarLink = ({
  to,
  icon,
  label,
  isActive = false,
}: SidebarLinkProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            to={to}
            className={cn(
              "flex items-center gap-3 px-4 py-3 text-white hover:bg-sky-600 rounded-md transition-colors",
              isActive && "bg-sky-600",
            )}
          >
            <div className="text-xl">{icon}</div>
            <span className="text-sm font-medium">{label}</span>
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const Sidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navigationLinks = [
    { to: "/", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
    { to: "/inventory", icon: <Package size={20} />, label: "Inventory" },
    { to: "/purchase", icon: <ShoppingCart size={20} />, label: "Purchase" },
    { to: "/sales", icon: <Receipt size={20} />, label: "Sales" },
    {
      to: "/invoice-builder",
      icon: <FileText size={20} />,
      label: "Invoice Builder",
    },
  ];

  return (
    <div className="h-screen w-[250px] bg-sky-500 flex flex-col fixed left-0 top-0">
      <div className="p-4 border-b border-sky-400">
        <h1 className="text-xl font-bold text-white">Inventory System</h1>
        <p className="text-sky-100 text-xs">GST Billing Solution</p>
      </div>

      <div className="flex-1 py-6 flex flex-col">
        <div className="space-y-1 px-2">
          {navigationLinks.map((link) => (
            <SidebarLink
              key={link.to}
              to={link.to}
              icon={link.icon}
              label={link.label}
              isActive={currentPath === link.to}
            />
          ))}
        </div>

        <div className="mt-auto px-2 space-y-1">
          <SidebarLink
            to="/settings"
            icon={<Settings size={20} />}
            label="Settings"
          />
          <button className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-sky-600 rounded-md transition-colors">
            <LogOut size={20} />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
