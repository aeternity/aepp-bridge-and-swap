import React, { useEffect, useState } from 'react';
import { Box, useTheme } from '@mui/material';
import WizardFlowContainer from '../../WizardFlowContainer';
import { useFormStore } from '../../../stores/formStore';
import Link from 'next/link';
import ExternalIcon from '../../../assets/ExternalIcon';
import BridgeService from '../../../services/BridgeService';
import { useWalletStore } from '../../../stores/walletStore';
import WebsocketService from '../../../services/WebsocketService';
import { formatNumber } from '../../../helpers';
import { Status, useExchangeStore } from '../../../stores/exchangeStore';
import {
  AmountBox,
  AmountTypography,
  BridgeBox,
  TokenTypography,
} from '../../shared';
import SwapArrowButton from '../../Buttons/SwapArrowButton';

const SKIP_ETH = !!process.env.NEXT_PUBLIC_SKIP_ETH;

const EthToAeStep3 = () => {
  const theme = useTheme();

  const { aeAccount } = useWalletStore();
  const { fromAmount, toAmount } = useFormStore();
  const { status, setStatus } = useExchangeStore();
  const [ranBridge, setRanBridge] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setStatus(Status.PENDING);
  }, []);

  useEffect(() => {
    const Bridge = async () => {
      const ethAmount = fromAmount?.toString();

      if (!ethAmount || !aeAccount?.address) {
        return;
      }

      const amountInWei = BigInt(
        Math.trunc(parseFloat(ethAmount.toString()) * 10 ** 18),
      );
      console.log('Skip', SKIP_ETH, process.env.NEXT_PUBLIC_SKIP_ETH);

      const attemptBridge = async () => {
        try {
          if (!SKIP_ETH) {
            await BridgeService.bridgeEthToAe(
              parseFloat(ethAmount),
              aeAccount.address,
            );
          }
          setStatus(Status.CONFIRMED);
          setError('');
        } catch (e: any) {
          setStatus(Status.PENDING);
          setError(e?.message ?? 'Something went wrong.');
          await attemptBridge();
        }
      };

      const attemptWaitForBridge = async () => {
        try {
          if (!SKIP_ETH) {
            // Wait for a moment to let the bridge finalize
            await WebsocketService.waitForBridgeToComplete(
              amountInWei,
              aeAccount.address,
            );
          } else {
            await new Promise((resolve) => setTimeout(resolve, 1000));
          }
          setStatus(Status.COMPLETED);
          setError('');
        } catch (e: any) {
          setStatus(Status.PENDING);
          setError(e?.message ?? 'Something went wrong.');
          await attemptWaitForBridge();
        }
      };

      await attemptBridge();
      await attemptWaitForBridge();
    };
    if (aeAccount?.address && fromAmount && !ranBridge) {
      Bridge();
      setRanBridge(true);
    }
  }, [aeAccount?.address, fromAmount, ranBridge]);

  const getMessageBoxContent = () => {
    switch (status) {
      case Status.PENDING:
        return (
          <>
            You are about to swap{' '}
            <span style={{ fontWeight: 500 }}>{fromAmount} AE</span> for{' '}
            <span style={{ fontWeight: 500 }}>
              ≈{Number(toAmount).toFixed(2)} æETH.
            </span>{' '}
            You will receive the æETH tokens in your æternity account connected
            to this app.
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
            You have successfully received{' '}
            <span style={{ fontWeight: 500 }}>{fromAmount} æETH</span> to your
            connected æternity account.
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
            bridge.
            <br />
            You will receive{' '}
            <span style={{ fontWeight: 500 }}>≈{toAmount} AE</span>
          </>
        );
    }
  };

  return (
    <>
      <WizardFlowContainer
        title={'Bridge ETH to æETH'}
        buttonLabel="Next"
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
                <TokenTypography>ETH</TokenTypography>
              </AmountBox>
              <SwapArrowButton disabled />
              <AmountBox
                style={{
                  backgroundColor: theme.palette.primary.main,
                }}
              >
                <AmountTypography>
                  {formatNumber(Number(fromAmount), {
                    maximumFractionDigits: 8,
                  })}
                </AmountTypography>
                <TokenTypography>æETH</TokenTypography>
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

export default EthToAeStep3;
