import React, { createContext, useState, ReactNode } from 'react';
// import {jwtDecode} from "jwt-decode";


interface UserContextType {
    token: string | null;
    setToken: React.Dispatch<React.SetStateAction<string | null>>;
    role: string | null;
    setRole: React.Dispatch<React.SetStateAction<string | null>>;
    user: string | null;
    setUser: React.Dispatch<React.SetStateAction<string | null>>;
    userId: string | null;
    setUserId: React.Dispatch<React.SetStateAction<string | null>>;
    login: (userData: UserData) => void;
    logout: () => void;
}

const defaultUser = {
    token: null,
    setToken: () => {},
    role: null,
    setRole: () => {},
    user: null,
    setUser: () => {},
    userId: null,
    setUserId: () => {},
    login: (userData: UserData) => {console.log(userData)},
    logout: () => {},
}

// Define the shape of user data
interface UserData {
    access: string;
    role: string;
    id: string;
    user: string;
}

// Create context with a default value
export const UserContext = createContext<UserContextType>(defaultUser);

interface UserProviderProps {
    children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [userId, setUserId] = useState<string | null>(localStorage.getItem('userId'));
    const [role, setRole] = useState<string | null>(localStorage.getItem('role'));
    const [user, setUser] = useState<string | null>(localStorage.getItem('username'));
    // const terte = jwtDecode(token).user_id
    // console.log(terte)

    const login = (userData: UserData) => {
        localStorage.setItem('token', userData.access);
        localStorage.setItem('role', userData.role);
        localStorage.setItem('userId', userData.id);
        localStorage.setItem('username', userData.user);
        setToken(userData.access);
        setRole(userData.role);
        setUser(userData.user);
        setUserId(userData.id);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('username');
        setToken(null);
        setRole(null);
        setUser(null);
        setUserId(null);
    };

    return (
        <UserContext.Provider value={{ token, setToken, role, setRole, user, userId, setUserId, setUser, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};
