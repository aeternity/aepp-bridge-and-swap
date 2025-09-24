import { create } from 'zustand';

export type FlowType = 'ethToAe' | 'aeEthToAe';

export enum Status {
  PENDING,
  CONFIRMED,
  COMPLETED,
}

const steps = {
  ethToAe: ['Connect wallets', 'Set amount', 'Bridge to æETH', 'Swap for AE'],
  aeEthToAe: ['Connect wallet', 'Set amount', 'Swap for AE'],
};

interface ExchangeState {
  flow: FlowType | null;
  steps: string[];
  currentStep: number;
  status: Status;
  setFlow: (flow: FlowType) => void;
  prevStep: () => void;
  nextStep: () => void;
  setStep: (step: number) => void;
  setStatus: (status: Status) => void;
  reset: () => void;
}

export const useExchangeStore = create<ExchangeState>((set) => ({
  flow: null,
  currentStep: 0,
  steps: [],
  status: Status.PENDING,
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
  setStatus: (status) => set({ status }),
  reset: () => set({ flow: null, currentStep: 0 }),
}));
