import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import MessageBox from '../../MessageBox';
import WizardFlowContainer from '../../WizardFlowContainer';
import { useFormStore } from '../../../stores/formStore';
import AeLogo from '../../../assets/AeLogo';
import styled from '@emotion/styled';
import Link from 'next/link';
import ExternalIcon from '../../../assets/ExternalIcon';
import AeEthAvatar from '../../../assets/AeEthAvatar';
import { formatNumber } from '../../../helpers';
import { BigNumber } from 'bignumber.js';

const Separator = styled(Box)(({ completed }) => ({
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

const BridgeBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  padding: '0px 17px',
  alignItems: 'center',
  marginBottom: '37px',
  [theme.breakpoints.up('sm')]: {
    padding: '0px 52px',
  },
}));
const AmountBox = styled(Box)(({ theme }) => ({
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
const AmountTypography = styled(Typography)(({ theme }) => ({
  fontSize: '18px',
  opacity: '60%',
  lineHeight: '28px',
  fontWeight: 500,
}));
const TokenTypography = styled(Typography)(({ theme }) => ({
  fontSize: '14px',
  lineHeight: '24px',
  fontWeight: 500,
}));

enum Status {
  PENDING,
  CONFIRMED,
  COMPLETED,
}

const AeToEthStep3 = () => {
  const { fromAmount, toAmount } = useFormStore();
  const [status, setStatus] = useState(Status.PENDING);

  useEffect(() => {
    setTimeout(() => {
      setStatus(Status.CONFIRMED);
      setTimeout(() => {
        setStatus(Status.COMPLETED);
      }, 3000);
    }, 3000);
  }, []);

  const getMessageBoxContent = () => {
    switch (status) {
      case Status.PENDING:
        return (
          <>
            You are about to bridge{' '}
            <span style={{ fontWeight: 500 }}>{fromAmount} ETH</span> to{' '}
            <span style={{ fontWeight: 500 }}>
              ≈{toAmount?.toFixed(2)} æETH.
            </span>{' '}
            You will receive the æETH tokens in your æternity account connected
            to this app.
          </>
        );
      case Status.CONFIRMED:
        return (
          <>
            Bridging <span style={{ fontWeight: 500 }}>ETH</span> to{' '}
            <span style={{ fontWeight: 500 }}>æETH</span> (wrapped ETH) is in
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
            swap.
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
                  <AeLogo width={'100%'} height={'100%'} />
                </Box>
                <AmountBox>
                  <AmountTypography>
                    {formatNumber(Number(BigNumber(fromAmount ?? 0)), {
                      maximumFractionDigits: 8,
                    })}
                  </AmountTypography>
                  <TokenTypography>AE</TokenTypography>
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
                    {formatNumber(Number(BigNumber(toAmount ?? 0)), {
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

export default AeToEthStep3;
