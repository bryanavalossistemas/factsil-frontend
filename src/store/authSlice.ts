import { StateCreator } from 'zustand';
import { User } from '@/schemas/user';

export interface AuthState {
  token: string | null;
  user: Omit<User, 'id' | 'password'> | null;
  login: (token: string, user: Omit<User, 'id' | 'password'>) => void;
  logout: () => void;
}

const createAuthSlice: StateCreator<AuthState> = (set) => {
  return {
    token: null,
    user: null,
    login: (token, user) => {
      set({ token, user });
    },
    logout: () => {
      set({ token: null, user: null });
    },
  };
};

export default createAuthSlice;
