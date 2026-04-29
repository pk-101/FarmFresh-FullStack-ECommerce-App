import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";
import { jwtDecode } from "jwt-decode";
/* =======================
   Types
======================= */

type User = {
  email: string;
  role: string;
};

type FarmFreshJwtPayload = {
  email: string;
  exp: number;
  role?: string;
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?: string;
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"?: string;
};

type AuthContextType = {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

/* =======================
   Context
======================= */

const AuthContext = createContext<AuthContextType | null>(null);

/* =======================
   Provider
======================= */

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  /* =======================
     Helper
  ======================= */

  const extractUserFromToken = (jwtToken: string): User => {
    const decoded = jwtDecode<FarmFreshJwtPayload>(jwtToken);

    const email =
    decoded.email ||
    decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"];

    if (!email) {
    throw new Error("Email not found in JWT");
  }

    const role =
      decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
      decoded.role ||
      "User";

    return {
      email,
      role,
    };
  }; 

/* =======================
   Restore session
======================= */

  useEffect(() => {
    const storedToken = localStorage.getItem("auth_token");
    if (!storedToken) return;

    try {
      const decoded = jwtDecode<FarmFreshJwtPayload>(storedToken);

      // Token expiry check
      if (decoded.exp * 1000 < Date.now()) {
        logout();
        return;
      }

      setToken(storedToken);
      setUser(extractUserFromToken(storedToken));
    } catch {
      logout();
    }
  }, []);


  // temporany console log
  useEffect(() => {
  console.log("AuthContext user:", user);
  console.log("AuthContext token:", token);
}, [user, token]);
  /* =======================
     Auth actions
  ======================= */

  const login = (jwtToken: string) => {
    localStorage.setItem("auth_token", jwtToken);
    setToken(jwtToken);
    setUser(extractUserFromToken(jwtToken));
  };

  const register = async (email: string, password: string) => {
    await api.post("/auth/register", { email, password });
    // No token issued → user must login explicitly
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    setToken(null);
    setUser(null);
  };

  /* =======================
     Provider
  ======================= */

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: !!token,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/* =======================
   Hook
======================= */

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
