import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import MessageBox from '../../MessageBox';
import WizardFlowContainer from '../../WizardFlowContainer';
import { useFormStore } from '../../../stores/formStore';
import styled from '@emotion/styled';
import Link from 'next/link';
import ExternalIcon from '../../../assets/ExternalIcon';
import EthLogo from '../../../assets/EthLogo';
import BridgeService from '../../../services/BridgeService';
import { useWalletStore } from '../../../stores/walletStore';
import WebsocketService from '../../../services/WebsocketService';
import { formatNumber } from '../../../helpers';
import AeEthAvatar from '../../../assets/AeEthAvatar';
import { StepProps } from '../../../types';

const SKIP_ETH = !!process.env.NEXT_PUBLIC_SKIP_ETH;

const Separator = styled(Box)<StepProps>(({ completed }) => ({
  position: 'relative',
  height: '1px',
  width: '100%',
  backgroundColor: 'rgba(64, 67, 80, 1)',

  '&::after': {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 0,
    height: 0,
    borderTop: '10px solid transparent',
    borderBottom: '10px solid transparent',
    borderLeft: '18px solid rgba(64, 67, 80, 1)',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 0,
    height: 0,
    borderTop: '8px solid transparent',
    borderBottom: '8px solid transparent',
    borderLeft: '16px solid #282c34',
    borderLeftColor: completed ? '#00D3A1' : '#282c34',
    zIndex: 1,
  },
}));

const BridgeBox = styled(Box)<StepProps>(({ theme }) => ({
  display: 'flex',
  padding: '0px 17px',
  alignItems: 'center',
  marginBottom: '37px',
  [theme.breakpoints.up('sm')]: {
    padding: '0px 52px',
  },
}));
const AmountBox = styled(Box)(({}) => ({
  backgroundColor: 'rgba(142, 152, 186, 0.15)',
  padding: '3px 12px',
  borderRadius: '20px',
  display: 'flex',
  gap: '2px',
  alignItems: 'end',
  position: 'absolute',
  left: '50%',
  transform: 'translate(-50%)',
  bottom: '-28px',
}));
const AmountTypography = styled(Typography)(() => ({
  fontSize: '18px',
  opacity: '60%',
  lineHeight: '28px',
  fontWeight: 500,
}));
const TokenTypography = styled(Typography)(() => ({
  fontSize: '14px',
  lineHeight: '24px',
  fontWeight: 500,
}));

enum Status {
  PENDING,
  CONFIRMED,
  COMPLETED,
}

const EthToAeStep3 = () => {
  const { aeAccount } = useWalletStore();
  const { fromAmount, toAmount } = useFormStore();
  const [status, setStatus] = useState(Status.PENDING);
  const [ranBridge, setRanBridge] = useState(false);

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
      if (!SKIP_ETH) {
        await BridgeService.bridgeEthToAe(
          amountInWei,
          aeAccount.address,
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
            <Link
              href="https://google.com"
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
        buttonDisabled={false}
        header={
          <Box mt={'16px'}>
            <MessageBox
              message={getMessageBoxContent()}
              type={status === Status.COMPLETED ? 'SUCCESS' : 'INFO'}
            />
          </Box>
        }
        content={
          <>
            <BridgeBox>
              <Box position={'relative'}>
                <Box
                  position={'relative'}
                  zIndex={1}
                  width={'48px'}
                  height={'48px'}
                >
                  <EthLogo width={'100%'} height={'100%'} />
                </Box>
                <AmountBox>
                  <AmountTypography>
                    {formatNumber(Number(fromAmount), {
                      maximumFractionDigits: 8,
                    })}
                  </AmountTypography>
                  <TokenTypography>ETH</TokenTypography>
                </AmountBox>
              </Box>
              <Separator completed={status === Status.COMPLETED} />
              <Box position={'relative'}>
                <Box
                  position={'relative'}
                  zIndex={1}
                  width={'48px'}
                  height={'48px'}
                >
                  <AeEthAvatar />
                </Box>
                <AmountBox>
                  <AmountTypography>
                    {formatNumber(Number(fromAmount), {
                      maximumFractionDigits: 8,
                    })}
                  </AmountTypography>
                  <TokenTypography>æETH</TokenTypography>
                </AmountBox>
              </Box>
            </BridgeBox>
            <Typography fontSize={'14px'} textAlign={'center'}>
              {getMessageFooter()}
            </Typography>
          </>
        }
      />
    </>
  );
};

export default EthToAeStep3;
