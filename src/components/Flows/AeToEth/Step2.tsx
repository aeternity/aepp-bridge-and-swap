import React, { useEffect, useState } from 'react';
import { Box, useTheme } from '@mui/material';
import WizardFlowContainer from '../../WizardFlowContainer';
import { useFormStore } from '../../../stores/formStore';
import { useWalletStore } from '../../../stores/walletStore';
import AmountInput from '../../Inputs/AmountInput';
import TokenPriceService from '../../../services/TokenPriceService';
import WebsocketService from '../../../services/WebsocketService';
import SwapArrowButton from '../../Buttons/SwapArrowButton';
import { powerAndTruncFloat } from '../../../helpers';

const AeToEthStep2 = () => {
  const theme = useTheme();

  const { fromAmount, toAmount, setFromAmount, setToAmount } = useFormStore();
  const { aeAccount } = useWalletStore();

  const [prices, setPrices] = useState<{ AE: number; ETH: number }>();

  useEffect(() => {
    TokenPriceService.getPrices().then(setPrices);
    WebsocketService.init();
  }, []);

  const onEthChange = (value: string) => {
    setToAmount(value ? Number(value) : '');
    setFromAmount(
      value ? Number(value) * (prices ? prices.ETH / prices.AE : 0) : '',
    );
  };

  const onAeChange = (value: string) => {
    setFromAmount(value ? Number(value) : '');
    setToAmount(
      value ? Number(value) * (prices ? prices.AE / prices.ETH : 0) : '',
    );
  };

  return (
    <>
      <WizardFlowContainer
        title={'Set amount'}
        subtitle={'How much do you want to swap?'}
        buttonDisabled={
          !fromAmount ||
          !toAmount ||
          powerAndTruncFloat(fromAmount, 18) > Number(aeAccount?.balance || 0)
        }
        error={
          !!fromAmount &&
          powerAndTruncFloat(fromAmount, 18) > Number(aeAccount?.balance || 0)
            ? `Amount exceeds maximum available: ${Number(aeAccount?.balance || 0) * 10 ** -18} AE`
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
                protocol="AE"
                onChange={onAeChange}
                value={fromAmount}
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
                onChange={onEthChange}
                value={toAmount}
              />
            </Box>
          </>
        }
        footer={'Just two steps to go!'}
      />
    </>
  );
};

export default AeToEthStep2;
