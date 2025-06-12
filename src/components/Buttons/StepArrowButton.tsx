import React from 'react';
import { Box, ButtonBase, Typography, useTheme } from '@mui/material';
import styled from '@emotion/styled';
import ArrowPrimary from '../../assets/ArrowPrimary';

const StyledButtonBase = styled(ButtonBase)({
  width: '40px',
  height: 'auto',
  transition: 'transform 0.15s ease',
  '&:hover': {
    transform: 'scale(1.1)',
  },
});

interface Props {
  disabled?: boolean;
  text?: string;
  rotation?: string;
  onClick?: () => void;
}

const StepArrowButton = ({
  disabled,
  text,
  rotation = '0deg',
  onClick,
}: Props) => {
  const theme = useTheme();

  return (
    <StyledButtonBase
      disabled={disabled}
      sx={{ opacity: disabled ? 0.4 : 1 }}
      onClick={onClick}
    >
      <Box>
        <Typography>{text}</Typography>
        <ArrowPrimary
          style={{
            width: '100%',
            height: 'auto',
            transform: `rotate(${rotation})`,
            color: theme.palette.primary.main,
          }}
        />
      </Box>
    </StyledButtonBase>
  );
};

export default StepArrowButton;
