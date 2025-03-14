/**
 * Check if the user is authenticated by verifying token in localStorage
 */
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem("token");
  return !!token;
};

/**
 * Get the current user's token
 */
export const getToken = (): string | null => {
  return localStorage.getItem("token");
};

/**
 * Get the current user's ID
 */
export const getUserId = (): string | null => {
  return localStorage.getItem("userId");
};

/**
 * Get the current user's name
 */
export const getUserName = (): string | null => {
  return localStorage.getItem("userName");
};

/**
 * Clear all authentication data from localStorage
 */
export const clearAuthData = (): void => {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  localStorage.removeItem("userName");
};
