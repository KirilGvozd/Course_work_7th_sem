import React, { createContext, useState, useEffect, ReactNode } from "react";

export interface User {
  id: number;
  email: string;
  role?: string;
  name?: string;
}

interface AuthContextProps {
  isLoggedIn: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  user: User | null;
}

export const AuthContext = createContext<AuthContextProps>({
  isLoggedIn: false,
  login: async () => {},
  logout: async () => {},
  user: null,
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch("http://localhost:4000/auth/user", {
        credentials: "include",
      });

      if (response.ok) {
        const userData: User = await response.json();

        setIsLoggedIn(true);
        setUser(userData);
      } else if (response.status === 401) {
        setIsLoggedIn(false);
        setUser(null);
      }
    } catch (error) {
      setIsLoggedIn(false);
      setUser(null);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    const response = await fetch("http://localhost:4000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    if (response.ok) {
      await checkAuthStatus();
    }
  };

  const logout = async () => {
    const response = await fetch("http://localhost:4000/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    if (response.ok) {
      setIsLoggedIn(false);
      setUser(null);
    }
  };

  const value: AuthContextProps = { isLoggedIn, login, logout, user }; // Explicitly type the value

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
