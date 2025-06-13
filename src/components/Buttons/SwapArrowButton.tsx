import React from 'react';
import { ButtonBase } from '@mui/material';
import ArrowSecondary from '../../assets/ArrowSecondary';

interface Props {
  disabled?: boolean;
  rotation?: string;
  onClick?: () => void;
}

const SwapArrowButton = ({ disabled, onClick, rotation = '0deg' }: Props) => {
  return (
    <ButtonBase disabled={disabled} onClick={onClick}>
      <ArrowSecondary
        style={{
          width: '50px',
          height: 'auto',
          transform: `rotate(${rotation})`,
        }}
      />
    </ButtonBase>
  );
};

export default SwapArrowButton;
