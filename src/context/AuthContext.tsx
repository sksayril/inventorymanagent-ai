import React, { createContext, useContext, useState, useEffect } from "react";

type User = {
  userId: string;
  userName: string;
  token: string;
  isSubscriber?: boolean;
  subscriptionStartDate?: string | null;
  subscriptionValidTill?: string | null;
} | null;

type AuthContextType = {
  user: User;
  login: (userData: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  hasSubscription: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
  hasSubscription: false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [hasSubscription, setHasSubscription] = useState<boolean>(false);

  useEffect(() => {
    // Check if user is logged in on initial load
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const userName = localStorage.getItem("userName");
    const isSubscriber = localStorage.getItem("isSubscriber") === "true";
    const subscriptionStartDate = localStorage.getItem("subscriptionStartDate");
    const subscriptionValidTill = localStorage.getItem("subscriptionValidTill");

    if (token && userId && userName) {
      setUser({
        token,
        userId,
        userName,
        isSubscriber,
        subscriptionStartDate,
        subscriptionValidTill,
      });
      setIsAuthenticated(true);
      setHasSubscription(isSubscriber);
    }
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);
    setHasSubscription(userData?.isSubscriber || false);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("isSubscriber");
    localStorage.removeItem("subscriptionStartDate");
    localStorage.removeItem("subscriptionValidTill");
    setUser(null);
    setIsAuthenticated(false);
    setHasSubscription(false);
  };

  // For development/testing - uncomment to auto-login
  // useEffect(() => {
  //   if (!isAuthenticated) {
  //     // Auto-login for development
  //     const testUser = {
  //       userId: "test-user-id",
  //       userName: "Test User",
  //       token: "test-token",
  //       isSubscriber: true
  //     };
  //     login(testUser);
  //
  //     // Store in localStorage
  //     localStorage.setItem("token", testUser.token);
  //     localStorage.setItem("userId", testUser.userId);
  //     localStorage.setItem("userName", testUser.userName);
  //     localStorage.setItem("isSubscriber", "true");
  //   }
  // }, []);

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAuthenticated, hasSubscription }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
