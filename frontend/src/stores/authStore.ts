import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

const loadAuthFromStorage = (): { user: User | null; token: string | null } => {
  if (typeof window === 'undefined') return { user: null, token: null };
  const stored = localStorage.getItem('auth-storage');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      return { user: parsed.user, token: parsed.token };
    } catch {
      return { user: null, token: null };
    }
  }
  return { user: null, token: null };
};

const saveAuthToStorage = (user: User | null, token: string | null) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('auth-storage', JSON.stringify({ user, token }));
};

const { user: initialUser, token: initialToken } = loadAuthFromStorage();

export const useAuthStore = create<AuthState>((set) => ({
  user: initialUser,
  token: initialToken,
  isAuthenticated: !!initialUser && !!initialToken,
  setAuth: (user, token) => {
    saveAuthToStorage(user, token);
    set({ user, token, isAuthenticated: true });
  },
  logout: () => {
    saveAuthToStorage(null, null);
    set({ user: null, token: null, isAuthenticated: false });
  },
}));

