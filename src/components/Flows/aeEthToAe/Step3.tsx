import React, { useEffect, useState } from 'react';
import { BigNumber } from 'bignumber.js';
import { useTheme } from '@mui/material';
import Link from 'next/link';

import WizardFlowContainer from '../../WizardFlowContainer';
import { useFormStore } from '../../../stores/formStore';
import { useWalletStore } from '../../../stores/walletStore';
import DexService from '../../../services/DexService';
import { Status, useExchangeStore } from '../../../stores/exchangeStore';

import ExternalIcon from '../../../assets/ExternalIcon';
import { extractErrorMessage, formatNumber } from '../../../helpers';
import {
  AmountBox,
  AmountTypography,
  BridgeBox,
  TokenTypography,
} from '../../shared';
import SwapArrowButton from '../../Buttons/SwapArrowButton';
import { aeSdk } from '../../../services/WalletService';

let isCancelled = false;
let currentSubstep: () => Promise<void>;
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

      if (!ethAmount || !aeAccount?.address || !toAmount) {
        return;
      }

      const DexServiceInstance = new DexService(
        aeAccount?.address as `ak_${string}`,
        'aeEthToAe',
        2,
      );

      const amountInWei = BigInt(
        Math.trunc(parseFloat(ethAmount.toString()) * 10 ** 18),
      );

      const amountOutWei = BigInt(
        Math.trunc(parseFloat(toAmount.toString()) * 10 ** 18),
      );

      const attemptChangeAllowance = async () => {
        try {
          setError('');
          if (isCancelled) return;
          const { hash } = (await DexServiceInstance.changeAllowance(amountInWei)) || {};
          if (hash) {
            await aeSdk.poll(hash, { blocks: 3 });
          }
          if (isCancelled) return;
          setStatus(Status.CONFIRMED);
          setError('');
          await attemptSwapAeEthToAe();
        } catch (e: unknown) {
          setStatus(Status.PENDING);
          currentSubstep = attemptChangeAllowance;
          setError(extractErrorMessage(e));
        }
      };

      const attemptSwapAeEthToAe = async () => {
        try {
          setStatus(Status.PENDING);
          setError('');
          if (isCancelled) return;
          const txHash = await DexServiceInstance.swapAeEthToAE(
            amountInWei,
            amountOutWei,
          );
          setHash(txHash);
          if (isCancelled) return;

          setStatus(Status.CONFIRMED);
          setError('');

          const { success, values, error } =
            await DexServiceInstance.pollSwapAeEthToAE(txHash);
          if (success && values) {
            const [aeEthIn, aeOut] = values;
            setSwapResult({
              aeOut: BigNumber(aeOut).dividedBy(10 ** 18),
              aeEthIn: BigNumber(aeEthIn),
            });
            setError('');
            setStatus(Status.COMPLETED);
          } else {
            throw new Error(error ?? 'Something went wrong.');
          }
        } catch (e: unknown) {
          setStatus(Status.PENDING);
          currentSubstep = attemptSwapAeEthToAe;
          setError(extractErrorMessage(e));
        }
      };

      await attemptChangeAllowance();
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
                View in blockchain explorer <ExternalIcon style={{ verticalAlign: 'sub'}}/>
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
        retry={currentSubstep}
      />
    </>
  );
};

export default AeEthToAeStep3;
