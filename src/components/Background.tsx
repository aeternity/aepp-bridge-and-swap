import React, { useMemo } from 'react';
import { Status, useExchangeStore } from '../stores/exchangeStore';
import { Box, useTheme } from '@mui/material';

const Background = () => {
  const theme = useTheme();

  const { flow, steps, currentStep, status } = useExchangeStore();

  const isFinalStepCompleted = useMemo(() => {
    return currentStep === steps.length - 1 && status === Status.COMPLETED;
  }, [currentStep, steps, status]);

  /** Explanation on clamped values
   * Using two points, I calculated the slope = (value2 - value1) / (screen2 - screen1)
   * I clamp the calculated value between value2 and value1
   * In between I do: min_value + slope * (screen - min_screen)
   * Example
   * At 350px screen width I want the 'left' value to be -125px
   * At 992px screen width I want the 'left' value to be -75px
   * Slope = (-75 - -125) / (992 - 350) = (-75 + 125) / 642 = 50 / 642 ~= 0.0778
   * Left = clamp(-125px, calc(-125px + 0.0778 * (100vw - 350px)), -75px)
   */

  return (
    <>
      {(flow == null || isFinalStepCompleted) && (
        <img
          src={'/assets/leaves.png'}
          style={{
            position: 'fixed',
            left: 'clamp(-125px, calc(-125px + 0.0778 * (100vw - 350px)), -75px)',
            top: '-120px',
            transform: 'rotate(116deg)',
            width: '300px',
            height: 'auto',
            pointerEvents: 'none',
            zIndex: -1,
          }}
        />
      )}
      {flow == null && (
        <img
          src={'/assets/leaves.png'}
          style={{
            position: 'fixed',
            right:
              'clamp(-180px, calc(-180px + 0.0935 * (100vw - 350px)), -120px)',
            top: '-145px',
            transform: 'rotate(-116deg)',
            width: '300px',
            height: 'auto',
            pointerEvents: 'none',
            zIndex: -1,
          }}
        />
      )}
      {flow != null && (
        <img
          src={
            isFinalStepCompleted ? '/assets/human.svg' : '/assets/leaves.png'
          }
          style={{
            position: 'fixed',
            left: isFinalStepCompleted ? '50px' : '-50px',
            bottom: isFinalStepCompleted ? '-40px' : '-100px',
            transform: isFinalStepCompleted ? 'rotate(14deg)' : 'rotate(2deg)',
            width: isFinalStepCompleted ? '250px' : '300px',
            height: 'auto',
            pointerEvents: 'none',
            zIndex: -1,
          }}
        />
      )}
      <Box
        sx={{
          position: 'fixed',
          inset: '0',
          zIndex: -2,
          background:
            theme.palette.mode === 'dark'
              ? ''
              : 'linear-gradient(to bottom, transparent 0%, transparent 66%, #bdbdbd 100%)',
          backgroundAttachment: 'fixed',
        }}
      ></Box>
    </>
  );
};

export default Background;
