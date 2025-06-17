import React from 'react';
import { Box, ButtonBase, Typography, useTheme } from '@mui/material';
import styled from '@emotion/styled';
import ArrowPrimary from '../../assets/ArrowPrimary';

const StyledButtonBase = styled(ButtonBase)({
  height: 'auto',
  transition: 'transform 0.15s ease',
  paddingInline: '16px',
  willChange: 'transform',
  '&:hover': {
    transform: 'scale(1.1)',
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
  const theme = useTheme();

  return (
    <StyledButtonBase
      disabled={disabled}
      sx={{ opacity: disabled ? 0.4 : 1 }}
      onClick={onClick}
    >
      <Box display={'flex'} gap={'6px'} flexDirection={prev ? 'row-reverse' : 'row'} alignItems={'center'}>
        <Typography fontSize={'18px'}>{text}</Typography>
        <ArrowPrimary
          style={{
            width: '30px',
            height: 'auto',
            transform: prev ? 'rotate(180deg)' : undefined,
            color: theme.palette.primary.main,
          }}
        />
      </Box>
    </StyledButtonBase>
  );
};

export default StepArrowButton;
