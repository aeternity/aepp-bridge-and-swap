import { create } from 'zustand';

export type FlowType = 'ethToAe' | 'aeToEth' | 'aeEthToAe' | 'aeEthToEth';

const steps = {
  ethToAe: ['Connect wallets', 'Set amount', 'Bridge to æETH', 'Swap for AE'],
  aeToEth: ['Connect wallets', 'Set amount', 'Swap for AE', 'Bridge to ETH'],
  aeEthToAe: ['Connect wallet', 'Set amount', 'Swap for AE'],
  aeEthToEth: ['Connect wallet', 'Set amount', 'Bridge to ETH'],
};

interface ExchangeState {
  flow: FlowType | null;
  steps: string[];
  currentStep: number;
  setFlow: (flow: FlowType) => void;
  prevStep: () => void;
  nextStep: () => void;
  setStep: (step: number) => void;
  reset: () => void;
}

export const useExchangeStore = create<ExchangeState>((set) => ({
  flow: null,
  currentStep: 0,
  steps: [],
  setFlow: (flow) => {
    set({ flow, currentStep: 0 });
    set({ steps: steps[flow] });
  },
  prevStep: () =>
    set((state) => ({ currentStep: Math.max(0, state.currentStep - 1) })),
  nextStep: () =>
    set((state) => {
      const nextStep = state.currentStep + 1;
      const shouldResetFlow = nextStep >= state.steps.length;

      return {
        currentStep: shouldResetFlow ? 0 : nextStep,
        flow: shouldResetFlow ? null : state.flow,
      };
    }),
  setStep: (step) => set({ currentStep: step }),
  reset: () => set({ flow: null, currentStep: 0 }),
}));
