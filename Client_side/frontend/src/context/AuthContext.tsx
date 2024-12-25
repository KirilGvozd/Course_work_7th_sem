import React, { createContext, useState, useEffect, ReactNode } from "react";

// Define types
interface User {
  id: number;
  email: string;
  role?: string; // Make name optional
  // ... other user properties
}

interface AuthContextProps {
  isLoggedIn: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>; // Correct type for credentials
  logout: () => Promise<void>;
  user: User | null;
}

// Create context with the correct type
export const AuthContext = createContext<AuthContextProps>({
  isLoggedIn: false,
  login: async () => {},
  logout: async () => {},
  user: null,
});

interface AuthProviderProps {
  children: ReactNode; // Correct type for children
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null); // Type the user state

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch("http://localhost:4000/auth/user", {
        credentials: "include",
      });

      if (response.ok) {
        const userData: User = await response.json(); // Type the response

        setIsLoggedIn(true);
        setUser(userData);
      } else if (response.status === 401) {
        setIsLoggedIn(false);
        setUser(null);
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
      setIsLoggedIn(false);
      setUser(null);
    }
  };

  const login = async (credentials: { email: string; password: string }) => {
    try {
      const response = await fetch("http://localhost:4000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        checkAuthStatus();
      } else {
        console.error("Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const logout = async () => {
    try {
      const response = await fetch("http://localhost:4000/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        setIsLoggedIn(false);
        setUser(null);
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const value: AuthContextProps = { isLoggedIn, login, logout, user }; // Explicitly type the value

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
