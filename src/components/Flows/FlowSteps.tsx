import { FlowType } from '../../stores/exchangeStore';
import AeToEthSteps from './AeToEthSteps';
import EthToAeSteps from './EthToAeSteps';

export const flowSteps: Record<FlowType, JSX.Element[]> = {
  ethToAe: EthToAeSteps,
  aeToEth: AeToEthSteps,
  aeEthToAe: EthToAeSteps,
  aeEthToEth: EthToAeSteps,
};
