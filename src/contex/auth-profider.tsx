import { useEffect, useState } from "react";
import { AuthContext } from "./auth-contex";
import type { User } from "./auth-contex";
import { api } from "../services/api";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = (token: string) => {
    localStorage.setItem("token", token);
    setToken(token);
  };

  useEffect(() => {
  const fetchUserActive = async () => {
    
      const res = await api.get("/auth", { withCredentials: true });
      const user:any = res.data
        login(user)
  };
  fetchUserActive();
}, []);

  const setUserAndSave = (user: User) => {
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    api.get("/logout", { withCredentials: true })
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, user, setUser: setUserAndSave }}>
      {children}
    </AuthContext.Provider>
  );
}