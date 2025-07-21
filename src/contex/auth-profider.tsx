import { useState } from "react";
import { AuthContext } from "./auth-contex";
import type { User } from "./auth-contex";

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

  const setUserAndSave = (user: User) => {
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };
  console.log(user, token)

  return (
    <AuthContext.Provider value={{ token, login, logout, user, setUser: setUserAndSave }}>
      {children}
    </AuthContext.Provider>
  );
}