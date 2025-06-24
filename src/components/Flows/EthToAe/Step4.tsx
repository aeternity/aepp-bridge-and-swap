import React, { useEffect, useState } from 'react';
import { useTheme } from '@mui/material';
import WizardFlowContainer from '../../WizardFlowContainer';
import { useFormStore } from '../../../stores/formStore';
import Link from 'next/link';
import ExternalIcon from '../../../assets/ExternalIcon';
import { useWalletStore } from '../../../stores/walletStore';
import { extractErrorMessage, formatNumber } from '../../../helpers';
import DexService from '../../../services/DexService';
import { BigNumber } from 'bignumber.js';
import { Status, useExchangeStore } from '../../../stores/exchangeStore';
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
const EthToAeStep4 = () => {
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
        aeAccount.address as `ak_${string}`,
        'ethToAe',
        3,
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
          setError('');
          setStatus(Status.PENDING);
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
            You are about to bridge{' '}
            <span style={{ fontWeight: 500 }}>{fromAmount} æETH</span> to{' '}
            <span style={{ fontWeight: 500 }}>≈{toAmount} AE.</span>
            <br />
            Coins will be received by your connected æternity account.
          </>
        );
      case Status.CONFIRMED:
        return (
          <>
            Swapping <span style={{ fontWeight: 500 }}>æETH</span> to{' '}
            <span style={{ fontWeight: 500 }}>AE</span> is in progress.
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
            Usually it takes about 1-2 minutes to get the AE coins in the
            receiving æternity account.
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
            {swapResult?.aeOut.toString()} AE have been successfully received by
            your æternity account.
            <br />
            All done! Congrats.
          </>
        );
    }
  };

  return (
    <>
      <WizardFlowContainer
        title={'Swap æETH for AE'}
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

export default EthToAeStep4;
