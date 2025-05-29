import { Box } from '@mui/material';
import { flowSteps } from './FlowSteps';
import { useExchangeStore } from '../../stores/exchangeStore';

const ExchangeFlow = () => {
  const { flow, currentStep } = useExchangeStore();

  if (!flow) return null;

  const steps = flowSteps[flow];
  const StepComponent = steps[currentStep];

  return <Box>{StepComponent}</Box>;
};

export default ExchangeFlow;
