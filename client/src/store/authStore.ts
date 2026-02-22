import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
    id: number;
    email: string;
    username: string;
    roles: string[];
}

interface AuthState {
    token: string | null;
    user: User | null;
    isAuthenticated: boolean;
    login: (token: string, user: User) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (): AuthState => ({
            token: 'local-token',
            user: { id: 1, email: 'local@studio', username: 'Local Producer', roles: [] },
            isAuthenticated: true,
            login: () => { }, // No-op for local mode
            logout: () => { }, // No-op for local mode
        }),
        {
            name: 'boumbapp-auth',
        }
    )
);
