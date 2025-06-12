import React, { useEffect, useState } from 'react';
import { Box, useTheme } from '@mui/material';
import WizardFlowContainer from '../../WizardFlowContainer';
import { useFormStore } from '../../../stores/formStore';
import AmountInput from '../../Inputs/AmountInput';
import SwapArrowButton from '../../Buttons/SwapArrowButton';
import DexService from '../../../services/DexService';
import { powerAndTruncFloat } from '../../../helpers';

const AeEthToEthStep2 = () => {
  const theme = useTheme();

  const { fromAmount, toAmount, setFromAmount, setToAmount } = useFormStore();
  const [amountAeEth, setAmountAeEth] = useState(0n);

  useEffect(() => {
    DexService.getAeWethBalance().then(setAmountAeEth);
  }, []);

  const onChange = (value: string) => {
    setToAmount(Number(value));
    setFromAmount(Number(value));
  };

  return (
    <>
      <WizardFlowContainer
        title={'Set amount'}
        subtitle={'How much do you want to swap?'}
        buttonDisabled={
          !fromAmount ||
          !toAmount ||
          powerAndTruncFloat(fromAmount, 18) > amountAeEth
        }
        error={
          !!fromAmount && powerAndTruncFloat(fromAmount, 18) > amountAeEth
            ? `Amount exceeds maximum available: ${Number(amountAeEth) * 10 ** -18} æETH`
            : ''
        }
        content={
          <>
            <Box
              display={'flex'}
              gap={'35px'}
              flexDirection={'column'}
              position={'relative'}
            >
              <AmountInput
                protocol="ETH"
                label="æETH"
                onChange={onChange}
                value={toAmount}
                backgroundColor={theme.palette.secondary.main}
              />
              <Box
                position={'absolute'}
                sx={{
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <SwapArrowButton rotation="90deg" disabled />
              </Box>
              <AmountInput
                protocol="ETH"
                onChange={onChange}
                value={toAmount}
              />
            </Box>
          </>
        }
        footer={'Almost there!'}
      />
    </>
  );
};

export default AeEthToEthStep2;
