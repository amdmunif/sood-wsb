import api from './api';
import type { LoginResponse, User } from '../types';

export const login = async (email: string, password: string) => {
    const response = await api.post<LoginResponse>('/auth/login', { email, password });
    return response.data;
};

export const getMe = async () => {
    const response = await api.get<User>('/auth/me');
    return response.data;
}
