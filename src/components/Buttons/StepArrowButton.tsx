import React from 'react';
import { Box, ButtonBase } from '@mui/material';
import styled from '@emotion/styled';
import ArrowPrimary from '../../assets/ArrowPrimary';

const StyledButtonBase = styled(ButtonBase)({
  height: 'auto',
  transition: 'all 0.15s ease',
  paddingInline: '16px',
  willChange: 'transform',
  textTransform: 'uppercase',
  letterSpacing: '0.2em',
  fontFamily: 'var(--my-font), sans-serif',
  fontSize: '15px',
  '&:hover': {
    color: '#3a7f85',
  },
});

interface Props {
  disabled?: boolean;
  text?: string;
  prev?: boolean;
  onClick?: () => void;
}

const StepArrowButton = ({
  disabled,
  text,
  prev,
  onClick,
}: Props) => {
  return (
    <StyledButtonBase
      disabled={disabled}
      sx={{
        opacity: disabled ? 0.4 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
      onClick={onClick}
    >
      <Box display={'flex'} gap={'6px'} flexDirection={prev ? 'row-reverse' : 'row'} alignItems={'center'}>
        {text}
        <ArrowPrimary
          style={{
            width: '30px',
            height: 'auto',
            transform: prev ? 'rotate(180deg)' : undefined,
          }}
        />
      </Box>
    </StyledButtonBase>
  );
};

export default StepArrowButton;
