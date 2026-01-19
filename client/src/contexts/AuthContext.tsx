import React, { createContext, useContext, useState, useEffect } from 'react';
import { getMe } from '../services/authService';
import type { User } from '../types';
import api from '../services/api';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (token: string, userData: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            getMe()
                .then((userData) => setUser(userData))
                .catch(() => {
                    localStorage.removeItem('accessToken');
                    delete api.defaults.headers.common['Authorization'];
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const login = (token: string, userData: User) => {
        localStorage.setItem('accessToken', token);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        delete api.defaults.headers.common['Authorization'];
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
