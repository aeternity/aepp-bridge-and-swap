import { create } from 'zustand';

type ThemeState = {
  mode?: 'light' | 'dark';
  toggleMode: () => void;
  setMode: (mode: 'light' | 'dark') => void;
};

export const useThemeStore = create<ThemeState>((set) => ({
  mode: undefined,
  toggleMode: () =>
    set((state) => {
      const next = state.mode === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme-mode', next);
      return { mode: next };
    }),
  setMode: (mode) => {
    localStorage.setItem('theme-mode', mode);
    set({ mode });
  },
}));
