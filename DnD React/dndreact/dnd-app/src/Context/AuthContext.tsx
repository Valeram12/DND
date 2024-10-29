import React, {createContext, useContext, useState, ReactNode, useEffect} from 'react';
import {loginUser, logoutUser, fetchCurrentUser, getUserFromLocalStorage, registerUser} from '../Services/authService';
import {User} from '../Models/User';

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    registration: (email: string, password: string, username: string) => Promise<void>;
    logout: () => Promise<void>;
    setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({children}) => {
    const [user, setUser] = useState<User | null>(getUserFromLocalStorage());

    useEffect(() => {
        if (!user) {
            fetchCurrentUser()
                .then(setUser)
                .catch(() => setUser(null));
        }
    }, [user]);

    const login = async (email: string, password: string) => {
        const loggedUser = await loginUser(email, password);
        setUser(loggedUser);
    };

    const registration = async (email: string, password: string, username: string) => {
        const registeredUser = await registerUser(email, password, username);
        setUser(registeredUser);
    }

    const logout = async () => {
        await logoutUser();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{user, login, logout, setUser, registration}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
