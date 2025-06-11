import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import WizardFlowContainer from '../../WizardFlowContainer';
import { useFormStore } from '../../../stores/formStore';
import { useWalletStore } from '../../../stores/walletStore';
import AmountInput from '../../Inputs/AmountInput';
import TokenPriceService from '../../../services/TokenPriceService';
import WebsocketService from '../../../services/WebsocketService';
import SwapArrowButton from '../../Buttons/SwapArrowButton';
import { AE_AVATAR_URL } from '../../../constants';
import { powerAndTruncFloat } from '../../../helpers';

const AeToEthStep2 = () => {
  const { fromAmount, toAmount, setFromAmount, setToAmount } = useFormStore();
  const { aeAccount, ethAccount } = useWalletStore();

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
        buttonLabel="Next"
        buttonLoading={false}
        buttonDisabled={!fromAmount || !toAmount || powerAndTruncFloat(fromAmount, 18) > Number(aeAccount?.balance || 0)}
        error={
          !!fromAmount && powerAndTruncFloat(fromAmount, 18) > Number(aeAccount?.balance || 0)
            ? `Amount exceeds maximum available: ${Number(aeAccount?.balance || 0) * 10 ** -18} AE`
            : ''
        }
        header={<></>}
        content={
          <>
            <Box
              display={'flex'}
              gap={'6px'}
              flexDirection={'column'}
              position={'relative'}
            >
              <AmountInput
                protocol="AE"
                onChange={onAeChange}
                value={fromAmount}
              />
              <Box
                position={'absolute'}
                sx={{
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <SwapArrowButton disabled />
              </Box>
              <AmountInput
                protocol="ETH"
                onChange={onEthChange}
                value={toAmount}
              />
            </Box>
            <Typography fontSize="16px" fontWeight={600} sx={{ opacity: 0.8 }}>
              Receiving Ethereum account
            </Typography>
            <Box
              display={'flex'}
              justifyContent={'center'}
              alignItems={'center'}
              gap={'8px'}
            >
              <img
                src={avatarUrl}
                alt="Avatar"
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                }}
              />
              <Typography
                sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}
              >
                {ethAccount?.address}
              </Typography>
            </Box>
          </>
        }
      />
    </>
  );
};

export default AeToEthStep2;
