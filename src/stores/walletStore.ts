import { BigNumber } from 'bignumber.js';
import { create } from 'zustand';

interface Account {
  address: string;
  balance: BigNumber;
}

interface WalletState {
  ethAccount: Account | null;
  aeAccount: Account | null;

  connectEth: (address: string) => void;
  connectAe: (address: string) => void;

  disconnectEth: () => void;
  disconnectAe: () => void;

  updateEthBalance: (balance: BigNumber) => void;
  updateAeBalance: (balance: BigNumber) => void;

  reset: () => void;
}

export const useWalletStore = create<WalletState>((set, get) => ({
  ethAccount: null,
  aeAccount: null,

  connectEth: (address) =>
    set({ ethAccount: { address, balance: BigNumber(0) } }),
  connectAe: (address) =>
    set({ aeAccount: { address, balance: BigNumber(0) } }),

  disconnectEth: () =>
    set((state) => (state.ethAccount ? { ethAccount: null } : {})),

  disconnectAe: () =>
    set((state) => (state.aeAccount ? { aeAccount: null } : {})),

  updateEthBalance: (balance) =>
    set((state) =>
      state.ethAccount ? { ethAccount: { ...state.ethAccount, balance } } : {},
    ),

  updateAeBalance: (balance) =>
    set((state) =>
      state.aeAccount ? { aeAccount: { ...state.aeAccount, balance } } : {},
    ),

  reset: () => set({ ethAccount: null, aeAccount: null }),
}));
