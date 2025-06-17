import React, { useEffect, useState } from 'react';
import { Box, useTheme } from '@mui/material';
import { BigNumber } from 'bignumber.js';

import WizardFlowContainer from '../../WizardFlowContainer';
import { useFormStore } from '../../../stores/formStore';
import { useWalletStore } from '../../../stores/walletStore';
import AmountInput from '../../Inputs/AmountInput';
import TokenPriceService from '../../../services/TokenPriceService';
import WebsocketService from '../../../services/WebsocketService';
import SwapArrowButton from '../../Buttons/SwapArrowButton';

const EthToAeStep2 = () => {
  const theme = useTheme();

  const { fromAmount, toAmount, setFromAmount, setToAmount } = useFormStore();
  const { ethAccount } = useWalletStore();

  const [prices, setPrices] = useState<{ AE: number; ETH: number, aeEthToAeRatio: BigNumber }>();

  useEffect(() => {
    TokenPriceService.getPrices().then(setPrices);
    WebsocketService.init();
  }, []);

  const onEthChange = (value: string) => {
    setFromAmount(value);
    setToAmount(
      Number(value) ? BigNumber(value).multipliedBy(prices ?  prices.aeEthToAeRatio : 1).toFixed(18).toString() : '',
    );
  };

  const onAeChange = (value: string) => {
    setToAmount(value);
    setFromAmount(
      Number(value) ? BigNumber(value).dividedBy(prices ?  prices.aeEthToAeRatio : 1).toFixed(18).toString() : '',
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
          !ethAccount?.balance ||
          Number(fromAmount) > Number(ethAccount?.balance)
        }
        error={
          !!fromAmount && Number(fromAmount) > Number(ethAccount?.balance || 0)
            ? `Amount exceeds maximum available: ${Number(ethAccount?.balance)} ETH`
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
                onChange={onEthChange}
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
                protocol="AE"
                onChange={onAeChange}
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

export default EthToAeStep2;
