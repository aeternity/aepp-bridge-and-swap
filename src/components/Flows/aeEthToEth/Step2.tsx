import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import WizardFlowContainer from '../../WizardFlowContainer';
import { useFormStore } from '../../../stores/formStore';
import { useWalletStore } from '../../../stores/walletStore';
import AmountInput from '../../Inputs/AmountInput';
import SwapArrowButton from '../../Buttons/SwapArrowButton';
import { AE_AVATAR_URL } from '../../../constants';
import DexService from '../../../services/DexService';
import { powerAndTruncFloat } from '../../../helpers';

const AeEthToEthStep2 = () => {
  const { fromAmount, toAmount, setFromAmount, setToAmount } = useFormStore();
  const { ethAccount } = useWalletStore();
  const [amountAeEth, setAmountAeEth] = useState(0n);

  const avatarUrl = AE_AVATAR_URL + ethAccount?.address;

  useEffect(() => {
    DexService.getAeWethBalance().then(setAmountAeEth)
  }, []);

  const onChange = (value: string) => {
    setToAmount(Number(value));
    setFromAmount(Number(value));
  };

  return (
    <>
      <WizardFlowContainer
        title={'Set amount'}
        buttonLabel="Next"
        buttonLoading={false}
        buttonDisabled={!fromAmount || !toAmount || powerAndTruncFloat(fromAmount, 18) > amountAeEth}
        error={
          !!fromAmount && powerAndTruncFloat(fromAmount, 18) > amountAeEth
            ? `Amount exceeds maximum available: ${Number(amountAeEth) * 10 ** -18} æETH`
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
                protocol="ETH"
                label="æETH"
                onChange={onChange}
                value={toAmount}
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
                onChange={onChange}
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

export default AeEthToEthStep2;
