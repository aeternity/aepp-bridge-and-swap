import React from 'react';
import { ButtonBase } from '@mui/material';
import DownArrowIcon from '../../assets/DownArrowIcon';

interface Props {
  disabled?: boolean;
  onClick?: () => void;
}

const SwapArrowButton = ({ disabled, onClick }: Props) => {
  return (
    <ButtonBase
      disabled={disabled}
      sx={{
        width: '32px',
        height: '32px',
        backgroundColor: disabled
          ? 'rgba(35, 38, 49, 1)'
          : 'rgba(42, 44, 55, 1)',
        outline: disabled
          ? '6px solid rgba(21, 23, 30, 1)'
          : '6px solid rgba(21, 23, 30, 1)',
        borderRadius: '50%',
      }}
    >
      <DownArrowIcon style={{ opacity: disabled ? 0.4 : 1 }} />
    </ButtonBase>
  );
};

export default SwapArrowButton;
