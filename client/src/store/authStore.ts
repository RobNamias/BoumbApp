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
        (set) => ({
            // DEMO MODE: Start with a demo user or allow easy login
            token: 'demo-token',
            user: { id: 1, email: 'producer@boumb.app', username: 'Demo Producer', roles: ['ROLE_USER'] },
            isAuthenticated: true,
            login: (token, user) => set({ token, user, isAuthenticated: true }),
            logout: () => set({ token: null, user: null, isAuthenticated: false }),
        }),
        {
            name: 'boumbapp-auth',
        }
    )
);
