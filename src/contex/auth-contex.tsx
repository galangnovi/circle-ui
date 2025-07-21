import { createContext} from "react";

export type User = {
    id: number | null,
    username: string | null,
    name: string | null,
    email: string | null,
    avatar: string | null
};

export type AuthContextType = {
    token: string | null;
    login: (token: string) => void;
    logout: () => void;
    user: User | null
    setUser: (user: User) => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);
