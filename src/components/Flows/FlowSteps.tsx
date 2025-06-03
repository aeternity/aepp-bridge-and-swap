import { FlowType } from '../../stores/exchangeStore';
import AeEthToAeSteps from './AeEthToAeSteps';
import AeEthToEthSteps from './AeEthToEthSteps';
import AeToEthSteps from './AeToEthSteps';
import EthToAeSteps from './EthToAeSteps';

export const flowSteps: Record<FlowType, JSX.Element[]> = {
  ethToAe: EthToAeSteps,
  aeToEth: AeToEthSteps,
  aeEthToAe: AeEthToAeSteps,
  aeEthToEth: AeEthToEthSteps,
};
