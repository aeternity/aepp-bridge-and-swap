import { create } from 'zustand';

interface FormState {
  fromAmount: number | null | '';
  toAmount: number | null | '';

  setFromAmount: (amount: number | null | '') => void;
  setToAmount: (amount: number | null | '') => void;

  reset: () => void;
}

export const useFormStore = create<FormState>((set) => ({
  fromAmount: null,
  toAmount: null,

  setFromAmount: (fromAmount) => set({ fromAmount }),
  setToAmount: (toAmount) => set({ toAmount }),

  reset: () => set({ fromAmount: null, toAmount: null }),
}));
