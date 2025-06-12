import React, { useEffect, useState } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import WizardFlowContainer from '../../WizardFlowContainer';
import { useFormStore } from '../../../stores/formStore';
import { useWalletStore } from '../../../stores/walletStore';
import AmountInput from '../../Inputs/AmountInput';
import TokenPriceService from '../../../services/TokenPriceService';
import WebsocketService from '../../../services/WebsocketService';
import SwapArrowButton from '../../Buttons/SwapArrowButton';
import { AE_AVATAR_URL } from '../../../constants';

const AeToEthStep2 = () => {
  const theme = useTheme();

  const { fromAmount, toAmount, setFromAmount, setToAmount } = useFormStore();
  const { ethAccount } = useWalletStore();

  const [prices, setPrices] = useState<{ AE: number; ETH: number }>();

  const avatarUrl = AE_AVATAR_URL + ethAccount?.address;

  useEffect(() => {
    TokenPriceService.getPrices().then(setPrices);
    WebsocketService.init();
  }, []);

  const onEthChange = (value: string) => {
    setToAmount(Number(value));
    setFromAmount(Number(value) * (prices ? prices.ETH / prices.AE : 0));
  };

  const onAeChange = (value: string) => {
    setFromAmount(Number(value));
    setToAmount(Number(value) * (prices ? prices.AE / prices.ETH : 0));
  };

  return (
    <>
      <WizardFlowContainer
        title={'Set amount'}
        subtitle={'How much do you want to swap?'}
        buttonLabel="Next"
        buttonLoading={false}
        buttonDisabled={!fromAmount || !toAmount}
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
