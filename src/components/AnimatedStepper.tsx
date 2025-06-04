import React from 'react';
import {
  Box,
  Typography,
  Collapse,
  useMediaQuery,
  ButtonBase,
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { useExchangeStore } from '../stores/exchangeStore';
import { Theme } from '@emotion/react';

type StyledProps = {
  theme?: Theme;
  active?: boolean;
  done?: boolean;
};

const StepperBox = styled(Box)<StyledProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  height: '100%',
  position: 'relative',
  zIndex: 0,

  [theme.breakpoints.up('sm')]: {
    flexDirection: 'column',
  },
}));

const Separator = styled(Box)<StyledProps>(({ theme }) => ({
  position: 'relative',
  height: '2px',
  width: '100%',
  backgroundColor: 'rgba(64, 67, 80, 1)',
  zIndex: -1,

  [theme.breakpoints.up('sm')]: {
    height: '100%',
    width: '2px',

    '&::after': {
      content: '""',
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 0,
      height: 0,
      borderLeft: '10px solid transparent',
      borderRight: '10px solid transparent',
      borderTop: '18px solid rgba(64, 67, 80, 1)',
    },
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 'calc(50% - 1px)',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 0,
      height: 0,
      borderLeft: '5px solid transparent',
      borderRight: '5px solid transparent',
      borderTop: '9px solid #282c34',
      zIndex: 1,
    },
  },
}));

const StyledStepIcon = styled('div')<StyledProps>(({ active, done }) => ({
  width: 24,
  height: 24,
  borderRadius: '50%',
  backgroundColor: active || done ? 'rgba(0, 211, 161, 0.1)' : '#3a3b45',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: active || done ? '#00D3A1' : 'white',
  fontWeight: 'bold',
  outline: done ? '3px solid' : 'none',
}));

const StyledStepButton = styled(ButtonBase)<StyledProps>(
  ({ theme, active }) => ({
    boxSizing: 'border-box',
    display: 'flex',
    alignItems: 'center',
    padding: active ? '8px' : '0px',
    borderRadius: 999,
    outline: active ? '1px solid #00D3A1' : 'none',
    backgroundColor: active ? '#0b2d2d' : 'transparent',
    transition: 'outline 0.3s ease, backgroundColor 0.3s ease',
    fontSize: '14px',
    justifyContent: 'left',

    [theme.breakpoints.up('sm')]: {
      width: '100%',
      padding: '10px 16px',
      outline: '1px solid',
      outlineColor: active ? '#14f195' : '#404350',
    },
  }),
);

const StyledCollapse = styled(Collapse)(() => ({
  overflow: 'hidden',
}));

const StyledTypography = styled(Typography)<StyledProps>(
  ({ active, done }) => ({
    fontSize: '14px',
    marginLeft: '8px',
    textWrap: 'nowrap',
    color: active ? '#00D3A1' : 'white',
    fontWeight: active ? 600 : 500,
    opacity: active || done ? 1 : 0.8,
  }),
);

const AnimatedStepper = () => {
  const { currentStep, setStep, steps } = useExchangeStore();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));

  return (
    <StepperBox>
      {steps.map((label, index) => (
        <React.Fragment key={label}>
          <StyledStepButton
            active={index === currentStep}
            done={currentStep > index}
            onClick={() => setStep(index)}
            disabled
          >
            <StyledStepIcon
              active={index === currentStep}
              done={currentStep > index}
            >
              {currentStep > index ? '✓' : index + 1}
            </StyledStepIcon>
            <StyledCollapse
              active={index === currentStep}
              done={currentStep > index}
              in={index === currentStep || isDesktop}
              orientation="horizontal"
            >
              <StyledTypography
                active={index === currentStep}
                done={currentStep > index}
              >
                {label}
              </StyledTypography>
            </StyledCollapse>
          </StyledStepButton>

          {index < steps.length - 1 && <Separator />}
        </React.Fragment>
      ))}
    </StepperBox>
  );
};

export default AnimatedStepper;
