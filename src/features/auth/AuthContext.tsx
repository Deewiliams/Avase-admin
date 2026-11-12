import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { authService } from "./auth-service";
import type { AdminUser, LoginCredentials } from "./auth-types";

interface AuthContextType {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem("avase_token");

      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await authService.getMe();

        if (!response.success || !response.data?.user) {
          throw new Error("Invalid authentication session");
        }

        setUser(response.data.user);
        localStorage.setItem("avase_user", JSON.stringify(response.data.user));
      } catch {
        localStorage.removeItem("avase_token");
        localStorage.removeItem("avase_user");
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const response = await authService.login(credentials);

    if (!response.success || !response.data?.token) {
      throw new Error(response.message || "Login failed");
    }

    const { token, user } = response.data;

    if (!["ADMIN", "SUPER_ADMIN"].includes(user.role)) {
      throw new Error("You are not authorised to access this portal");
    }

    localStorage.setItem("avase_token", token);
    localStorage.setItem("avase_user", JSON.stringify(user));

    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem("avase_token");
    localStorage.removeItem("avase_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
