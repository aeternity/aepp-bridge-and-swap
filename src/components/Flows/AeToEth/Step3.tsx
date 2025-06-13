import React, { useEffect, useState } from 'react';
import { Box, useTheme } from '@mui/material';
import WizardFlowContainer from '../../WizardFlowContainer';
import { useFormStore } from '../../../stores/formStore';
import Link from 'next/link';
import ExternalIcon from '../../../assets/ExternalIcon';
import { formatNumber } from '../../../helpers';
import { useWalletStore } from '../../../stores/walletStore';
import DexService from '../../../services/DexService';
import TokenPriceService from '../../../services/TokenPriceService';
import WebsocketService from '../../../services/WebsocketService';
import { Status, useExchangeStore } from '../../../stores/exchangeStore';
import SwapArrowButton from '../../Buttons/SwapArrowButton';
import {
  AmountBox,
  AmountTypography,
  BridgeBox,
  TokenTypography,
} from '../../shared';

const AeToEthStep3 = () => {
  const theme = useTheme();

  const { aeAccount } = useWalletStore();
  const { fromAmount, toAmount } = useFormStore();
  const { status, setStatus } = useExchangeStore();
  const [ranSwap, setRanSwap] = useState(false);
  const [prices, setPrices] = useState<{ AE: number; ETH: number }>();

  const exchangeRatio = prices ? prices.ETH / prices.AE : null;

  useEffect(() => {
    setStatus(Status.PENDING);
  }, []);

  useEffect(() => {
    const Swap = async () => {
      const aeAmount = fromAmount?.toString();

      if (!aeAmount || !aeAccount?.address) {
        return;
      }

      const amountInAettos = BigInt(parseFloat(aeAmount) * 10 ** 18);

      await DexService.changeAllowance(amountInAettos);

      setStatus(Status.CONFIRMED);

      const amountOut = exchangeRatio
        ? BigInt(Math.trunc(Number(amountInAettos) / exchangeRatio))
        : BigInt(0);

      await DexService.swapAetoAeEth(
        amountInAettos,
        amountOut,
        aeAccount.address,
      );

      setStatus(Status.COMPLETED);
    };
    if (aeAccount?.address && fromAmount && !ranSwap && exchangeRatio) {
      Swap();
      setRanSwap(true);
    }
  }, [aeAccount?.address, fromAmount, ranSwap, exchangeRatio]);

  const getMessageBoxContent = () => {
    switch (status) {
      case Status.PENDING:
        return (
          <>
            You are about to bridge{' '}
            <span style={{ fontWeight: 500 }}>{fromAmount} ETH</span> to{' '}
            <span style={{ fontWeight: 500 }}>≈{toAmount} æETH.</span> You will
            receive the æETH tokens in your æternity account connected to this
            app.
          </>
        );
      case Status.CONFIRMED:
        return (
          <>
            Swapping <span style={{ fontWeight: 500 }}>AE</span> for{' '}
            <span style={{ fontWeight: 500 }}>æETH</span> is in progress.
            <br />
            Usually it takes about 1-2 minutes to receive the{' '}
            <span style={{ fontWeight: 500 }}>æETH</span> tokens in your
            æternity wallet account.
          </>
        );
      case Status.COMPLETED:
        return (
          <>
            <span style={{ fontWeight: 500 }}>{toAmount} æETH</span> have been
            successfully received by your connected æternity account.
          </>
        );
    }
  };

  const getMessageFooter = () => {
    switch (status) {
      case Status.PENDING:
        return (
          <>
            Please confirm the transaction
            <br />
            in your Ethereum wallet to proceed.
          </>
        );
      case Status.CONFIRMED:
        return (
          <>
            Transaction is processing ...
            <br />
            Don't worry if this takes a bit of time. Feel free to zone out to
            Netflix.
            <br />
            <Link
              href="#"
              target="_blank"
              style={{
                color: 'rgba(0, 211, 161, 1)',
                textDecoration: 'none',
                fontWeight: 500,
                display: 'inline-block',
              }}
            >
              <Box
                display={'flex'}
                alignContent={'center'}
                justifyContent={'center'}
                gap={'2px'}
              >
                View in blockchain explorer <ExternalIcon />
              </Box>
            </Link>
          </>
        );
      case Status.COMPLETED:
        return (
          <>
            Almost there!
            <br />
            Click on <span style={{ fontWeight: 500 }}>Next</span> to proceed to
            swap.
            <br />
            You will receive{' '}
            <span style={{ fontWeight: 500 }}>≈{toAmount} æETH</span>
          </>
        );
    }
  };

  useEffect(() => {
    TokenPriceService.getPrices().then(setPrices);
    WebsocketService.init();
  }, []);

  return (
    <>
      <WizardFlowContainer
        title={'Swap AE for æETH'}
        buttonDisabled={status !== Status.COMPLETED}
        subtitle={getMessageBoxContent()}
        content={
          <>
            <BridgeBox>
              <AmountBox
                style={{
                  backgroundColor: theme.palette.secondary.main,
                }}
              >
                <AmountTypography>
                  {formatNumber(Number(fromAmount), {
                    maximumFractionDigits: 8,
                  })}
                </AmountTypography>
                <TokenTypography>AE</TokenTypography>
              </AmountBox>
              <SwapArrowButton disabled />
              <AmountBox
                style={{
                  backgroundColor: theme.palette.primary.main,
                }}
              >
                <AmountTypography>
                  {formatNumber(Number(toAmount), {
                    maximumFractionDigits: 8,
                  })}
                </AmountTypography>
                <TokenTypography>æETH</TokenTypography>
              </AmountBox>
            </BridgeBox>
          </>
        }
        footer={getMessageFooter()}
      />
    </>
  );
};

export default AeToEthStep3;
