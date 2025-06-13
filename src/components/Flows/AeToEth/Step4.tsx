import React, { useEffect, useState } from 'react';
import { Box, useTheme } from '@mui/material';
import WizardFlowContainer from '../../WizardFlowContainer';
import { useFormStore } from '../../../stores/formStore';
import Link from 'next/link';
import ExternalIcon from '../../../assets/ExternalIcon';
import { useWalletStore } from '../../../stores/walletStore';
import { formatNumber } from '../../../helpers';
import BridgeService from '../../../services/BridgeService';
import WebsocketService from '../../../services/WebsocketService';
import { Status, useExchangeStore } from '../../../stores/exchangeStore';
import SwapArrowButton from '../../Buttons/SwapArrowButton';
import {
  AmountBox,
  AmountTypography,
  BridgeBox,
  TokenTypography,
} from '../../shared';

const SKIP_ETH = !!process.env.NEXT_PUBLIC_SKIP_ETH;

const AeToEthStep4 = () => {
  const theme = useTheme();

  const { aeAccount, ethAccount } = useWalletStore();
  const { toAmount } = useFormStore();
  const { status, setStatus } = useExchangeStore();
  const [ranBridge, setRanBridge] = useState(false);

  useEffect(() => {
    setStatus(Status.PENDING);
  }, []);

  useEffect(() => {
    const Bridge = async () => {
      const ethAmount = toAmount?.toString();

      if (!ethAmount || !ethAccount?.address || !aeAccount?.address) {
        return;
      }

      const amountInWei = BigInt(
        Math.trunc(parseFloat(ethAmount.toString()) * 10 ** 18),
      );
      console.log('Skip', SKIP_ETH, process.env.NEXT_PUBLIC_SKIP_ETH);
      if (!SKIP_ETH) {
        await BridgeService.bridgeAeToEth(
          amountInWei,
          aeAccount.address,
          ethAccount.address,
        );
      }

      setStatus(Status.CONFIRMED);

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
    };
    if (aeAccount?.address && toAmount && !ranBridge) {
      Bridge();
      setRanBridge(true);
    }
  }, [aeAccount?.address, ethAccount?.address, toAmount, ranBridge]);

  const getMessageBoxContent = () => {
    switch (status) {
      case Status.PENDING:
        return (
          <>
            You are about to bridge{' '}
            <span style={{ fontWeight: 500 }}>{toAmount} æETH</span> to{' '}
            <span style={{ fontWeight: 500 }}>≈{toAmount} ETH.</span> Coins will
            be received by your connected Ethereum account.
          </>
        );
      case Status.CONFIRMED:
        return (
          <>
            Bridging <span style={{ fontWeight: 500 }}>æETH</span> to{' '}
            <span style={{ fontWeight: 500 }}>ETH</span> is in progress.
            <br />
            Usually it takes about 1-2 minutes to get the{' '}
            <span style={{ fontWeight: 500 }}>ETH</span> coins in the receiving
            Ethereum account.
          </>
        );
      case Status.COMPLETED:
        return (
          <>
            Yay!
            <br />
            Success!
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
            <span style={{ fontWeight: 500 }}>{toAmount} ETH</span> have been
            successfully received by your connected Ethereum account.
            <br />
            All done! Congrats.
          </>
        );
    }
  };

  return (
    <>
      <WizardFlowContainer
        title={'Bridge æETH to ETH'}
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
                  {formatNumber(Number(toAmount), {
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
                <TokenTypography>ETH</TokenTypography>
              </AmountBox>
            </BridgeBox>
          </>
        }
        footer={getMessageFooter()}
      />
    </>
  );
};

export default AeToEthStep4;
