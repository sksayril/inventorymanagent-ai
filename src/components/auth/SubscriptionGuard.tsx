import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const SubscriptionGuard = () => {
  const { hasSubscription } = useAuth();

  if (!hasSubscription) {
    return <Navigate to="/subscription" replace />;
  }

  return <Outlet />;
};

export default SubscriptionGuard;
