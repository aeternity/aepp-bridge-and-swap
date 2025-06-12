import React, { useEffect, useState } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import MessageBox from '../../MessageBox';
import WizardFlowContainer from '../../WizardFlowContainer';
import { useFormStore } from '../../../stores/formStore';
import styled from '@emotion/styled';
import Link from 'next/link';
import ExternalIcon from '../../../assets/ExternalIcon';
import { useWalletStore } from '../../../stores/walletStore';
import { formatNumber } from '../../../helpers';
import { BigNumber } from 'bignumber.js';
import AeEthAvatar from '../../../assets/AeEthAvatar';
import AeLogo from '../../../assets/AeLogo';
import DexService from '../../../services/DexService';
import { StepProps } from '../../../types';
import { Status, useExchangeStore } from '../../../stores/exchangeStore';
import {
  AmountBox,
  AmountTypography,
  BridgeBox,
  TokenTypography,
} from '../../shared';
import SwapArrowButton from '../../Buttons/SwapArrowButton';

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

  useEffect(() => {
    setStatus(Status.PENDING);
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

      await DexService.changeAllowance(amountInWei);

      setStatus(Status.CONFIRMED);

      const [aeEthIn, aeOut] = await DexService.swapAeEthToAE(
        amountInWei,
        aeAccount.address,
      );
      setSwapResult({
        aeOut: BigNumber(aeOut).dividedBy(10 ** 18),
        aeEthIn: BigNumber(aeEthIn),
      });

      setStatus(Status.COMPLETED);
    };
    if (aeAccount?.address && fromAmount && !ranSwap) {
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
            <span style={{ fontWeight: 500 }}>
              ≈{Number(toAmount).toFixed(2)} AE.
            </span>{' '}
            You will receive the AE tokens in your æternity wallet account
            connected to this app.
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
        buttonLoading={status !== Status.COMPLETED}
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
      />
    </>
  );
};

export default AeEthToAeStep3;
