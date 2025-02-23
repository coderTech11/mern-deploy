import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  //check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/auth`,
          {
            withCredentials: true,
          }
        );
        setIsAuthenticated(response.status === 200);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.log("User is not authenticated");
        } else {
          console.error("Error checking auth", error);
        }
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  const logoutuser = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/logout`,
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        setIsAuthenticated(false);
        localStorage.clear();
        window.location.href = "/signin";
      } else {
        console.log("Logout failed");
      }
    } catch (error) {
      console.error("Error logging out", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, logoutuser }}
    >
      {children}
    </AuthContext.Provider>
  );
}
