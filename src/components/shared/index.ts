import styled from '@emotion/styled';
import { Box, Typography } from '@mui/material';
import { StepProps } from '../../types';

export const Separator = styled(Box)<StepProps>(({ completed }) => ({
  position: 'relative',
  height: '1px',
  width: '100%',
  backgroundColor: 'rgba(64, 67, 80, 1)',

  '&::after': {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 0,
    height: 0,
    borderTop: '10px solid transparent',
    borderBottom: '10px solid transparent',
    borderLeft: '18px solid rgba(64, 67, 80, 1)',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 0,
    height: 0,
    borderTop: '8px solid transparent',
    borderBottom: '8px solid transparent',
    borderLeft: '16px solid #282c34',
    borderLeftColor: completed ? '#00D3A1' : '#282c34',
    zIndex: 1,
  },
}));

export const BridgeBox = styled(Box)<StepProps>(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: '37px',
  marginBottom: '37px',
  gap: '20px',
}));
export const AmountBox = styled(Box)(() => ({
  padding: '12px',
  borderRadius: '12px',
  display: 'flex',
  gap: '2px',
  alignItems: 'end',
}));
export const AmountTypography = styled(Typography)(() => ({
  fontSize: '18px',
  opacity: '60%',
  lineHeight: '28px',
  fontWeight: 500,
  color: 'white',
}));
export const TokenTypography = styled(Typography)(({}) => ({
  fontSize: '14px',
  lineHeight: '24px',
  fontWeight: 500,
  color: 'white',
  position: 'relative',
  top: '-1px',
}));
