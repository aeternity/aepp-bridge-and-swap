import React, { useEffect, useState } from 'react';
import { useTheme } from '@mui/material';
import { ethers, Eip1193Provider } from 'ethers';
import { useAppKitProvider } from '@reown/appkit/react';

import WizardFlowContainer from '../../WizardFlowContainer';
import { useFormStore } from '../../../stores/formStore';
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

let isCancelled = false;
let currentSubstep: () => Promise<void>;
const EthToAeStep3 = () => {
  const theme = useTheme();

  const { aeAccount } = useWalletStore();
  const { fromAmount, toAmount } = useFormStore();
  const { status, setStatus } = useExchangeStore();
  const [ranBridge, setRanBridge] = useState(false);
  const [error, setError] = useState('');
  const { walletProvider } = useAppKitProvider<Eip1193Provider>('eip155');

  useEffect(() => {
    setStatus(Status.PENDING);

    return () => {
      isCancelled = true;
    };
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
            if (isCancelled) return;
            const provider = new ethers.BrowserProvider(walletProvider);
            const signer = await provider.getSigner();
            await BridgeService.bridgeEthToAe(
              amountInWei,
              aeAccount.address,
              signer,
            );
            if (isCancelled) return;
          }
          setStatus(Status.CONFIRMED);
          setError('');
          await attemptWaitForBridge();
        } catch (e: unknown) {
          setStatus(Status.PENDING);
          setError(e instanceof Error ? e.message : 'Something went wrong.');
          currentSubstep = attemptBridge;
        }
      };

      const attemptWaitForBridge = async () => {
        try {
          if (!SKIP_ETH) {
            if (isCancelled) return;
            // Wait for a moment to let the bridge finalize
            await WebsocketService.waitForBridgeToComplete(
              amountInWei,
              aeAccount.address,
            );
            if (isCancelled) return;
          } else {
            if (isCancelled) return;
            await new Promise((resolve) => setTimeout(resolve, 1000));
            if (isCancelled) return;
          }
          setStatus(Status.COMPLETED);
          setError('');
        } catch (e: unknown) {
          setStatus(Status.PENDING);
          setError(e instanceof Error ? e.message : 'Something went wrong.');
          currentSubstep = attemptWaitForBridge;
        }
      };

      await attemptBridge();
    };
    if (aeAccount?.address && fromAmount && !ranBridge) {
      isCancelled = false;
      Bridge();
      setRanBridge(true);
    }
  }, [aeAccount?.address, fromAmount, ranBridge]);

  const getMessageBoxContent = () => {
    switch (status) {
      case Status.PENDING:
        return (
          <>
            You are about to bridge{' '}
            <span style={{ fontWeight: 500 }}>{fromAmount} ETH</span> to{' '}
            <span style={{ fontWeight: 500 }}>≈{fromAmount} æETH.</span> You
            will receive the æETH tokens in your æternity account connected to
            this app.
          </>
        );
      case Status.CONFIRMED:
        return (
          <>
            Bridging <span style={{ fontWeight: 500 }}>ETH</span> to{' '}
            <span style={{ fontWeight: 500 }}>æETH (wrapped ETH)</span> is in
            progress.
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
        retry={currentSubstep}
      />
    </>
  );
};

export default EthToAeStep3;
