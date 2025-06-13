import React, { useEffect, useState } from 'react';
import { Box, useTheme } from '@mui/material';
import WizardFlowContainer from '../../WizardFlowContainer';
import { useFormStore } from '../../../stores/formStore';
import Link from 'next/link';
import ExternalIcon from '../../../assets/ExternalIcon';
import { useWalletStore } from '../../../stores/walletStore';
import { formatNumber } from '../../../helpers';
import { BigNumber } from 'bignumber.js';
import DexService from '../../../services/DexService';
import { Status, useExchangeStore } from '../../../stores/exchangeStore';
import {
  AmountBox,
  AmountTypography,
  BridgeBox,
  TokenTypography,
} from '../../shared';
import SwapArrowButton from '../../Buttons/SwapArrowButton';

let isCancelled = false;
const AeEthToAeStep3 = () => {
  const theme = useTheme();

  const { aeAccount } = useWalletStore();
  const { fromAmount, toAmount } = useFormStore();
  const { status, setStatus } = useExchangeStore();
  const [swapResult, setSwapResult] = useState({
    aeEthIn: BigNumber(0),
    aeOut: BigNumber(0),
  });
  const [ranSwap, setRanSwap] = useState(false);
  const [error, setError] = useState('');
  const [hash, setHash] = useState('');

  useEffect(() => {
    setStatus(Status.PENDING);

    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => {
    const Swap = async () => {
      const ethAmount = fromAmount?.toString();

      if (!ethAmount || !aeAccount?.address) {
        return;
      }

      const amountInWei = BigInt(
        Math.trunc(parseFloat(ethAmount.toString()) * 10 ** 18),
      );

      const attemptChangeAllowance = async () => {
        try {
          if (isCancelled) return;
          await DexService.changeAllowance(amountInWei);
          if (isCancelled) return;
          setStatus(Status.CONFIRMED);
          setError('');
        } catch (e: unknown) {
          setStatus(Status.PENDING);
          setError(e instanceof Error ? e.message : 'Something went wrong.');
          await attemptChangeAllowance();
        }
      };

      const attemptSwapAeEthToAe = async () => {
        try {
          setStatus(Status.PENDING);
          if (isCancelled) return;
          const txHash = await DexService.swapAeEthToAE(
            amountInWei,
            aeAccount.address,
          );
          setHash(txHash);
          if (isCancelled) return;

          setStatus(Status.CONFIRMED);
          setError('');

          const [aeEthIn, aeOut] = await DexService.pollSwapAeEthToAE(txHash);
          setSwapResult({
            aeOut: BigNumber(aeOut).dividedBy(10 ** 18),
            aeEthIn: BigNumber(aeEthIn),
          });

          if (aeEthIn == 0n && aeOut == 0n) {
            setError("It's taking a bit longer than expected.");
          } else {
            setError('');
            setStatus(Status.COMPLETED);
          }
        } catch (e: unknown) {
          setStatus(Status.PENDING);
          setError(e instanceof Error ? e.message : 'Something went wrong.');
          await attemptSwapAeEthToAe();
        }
      };

      await attemptChangeAllowance();
      await attemptSwapAeEthToAe();
    };
    if (aeAccount?.address && fromAmount && !ranSwap) {
      isCancelled = false;
      Swap();
      setRanSwap(true);
    }
  }, [aeAccount?.address, fromAmount, ranSwap]);

  const getMessageBoxContent = () => {
    switch (status) {
      case Status.PENDING:
        return (
          <>
            You are about to swap{' '}
            <span style={{ fontWeight: 500 }}>{fromAmount} æETH</span> for{' '}
            <span style={{ fontWeight: 500 }}>≈{toAmount} AE.</span> You will
            receive the AE tokens in your æternity wallet account connected to
            this app.
          </>
        );
      case Status.CONFIRMED:
        return (
          <>
            Swapping <span style={{ fontWeight: 500 }}>æETH</span> for{' '}
            <span style={{ fontWeight: 500 }}>AE</span> is in progress.
            <br />
            Usually it takes about 1-2 minutes to receive the{' '}
            <span style={{ fontWeight: 500 }}>AE</span> tokens in your æternity
            wallet account.
          </>
        );
      case Status.COMPLETED:
        return (
          <>
            You have successfully received{' '}
            <span style={{ fontWeight: 500 }}>
              {swapResult?.aeOut.toString()} AE
            </span>{' '}
            to connected æternity account.
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
            in your æternity wallet to proceed.
          </>
        );
      case Status.CONFIRMED:
        return (
          <>
            Transaction is processing ...
            <br />
            {hash && (
              <Link
                href={'https://aescan.io/transactions/' + hash}
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
            )}
          </>
        );
      case Status.COMPLETED:
        return (
          <>
            Click on the button below
            <br />
            to relaunch exchange wizard.
          </>
        );
    }
  };

  return (
    <>
      <WizardFlowContainer
        title={'Swap æETH to AE'}
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
                <TokenTypography>æETH</TokenTypography>
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
                <TokenTypography>AE</TokenTypography>
              </AmountBox>
            </BridgeBox>
          </>
        }
        footer={getMessageFooter()}
        error={error}
      />
    </>
  );
};

export default AeEthToAeStep3;
