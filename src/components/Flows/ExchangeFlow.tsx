import { Box } from '@mui/material';
import { flowSteps } from './FlowSteps';
import { useExchangeStore } from '../../stores/exchangeStore';
import { useFormStore } from '../../stores/formStore';
import { useEffect } from 'react';

const ExchangeFlow = () => {
  const { flow, currentStep } = useExchangeStore();
  const { reset } = useFormStore();

  useEffect(() => {
    reset();
  }, []);

  if (!flow) return null;

  const steps = flowSteps[flow];
  const StepComponent = steps[currentStep];

  return StepComponent;
};

export default ExchangeFlow;
