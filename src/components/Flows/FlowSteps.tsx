import { FlowType } from '../../stores/exchangeStore';
import AeEthToAeSteps from './AeEthToAeSteps';
import EthToAeSteps from './EthToAeSteps';

export const flowSteps: Record<FlowType, JSX.Element[]> = {
  ethToAe: EthToAeSteps,
  aeEthToAe: AeEthToAeSteps,
};
