import React from 'react';
import { ButtonBase } from '@mui/material';
import ArrowSecondary from '../../assets/ArrowSecondary';
import { useThemeStore } from '../../stores/themeStore';

interface Props {
  disabled?: boolean;
  rotation?: string;
  onClick?: () => void;
}

const SwapArrowButton = ({ disabled, onClick, rotation = '0deg' }: Props) => {
  const { mode } = useThemeStore();

  return (
    <ButtonBase disabled={disabled} onClick={onClick}>
      <ArrowSecondary
        style={{
          width: '50px',
          height: 'auto',
          transform: `rotate(${rotation})`,
          color: mode === 'dark' ? 'white' : '#2879e7',
        }}
      />
    </ButtonBase>
  );
};

export default SwapArrowButton;
