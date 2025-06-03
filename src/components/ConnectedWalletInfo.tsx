import React, { useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { useWalletStore } from '../stores/walletStore';
import { formatNumber } from '../helpers';
import Avatar from './Avatar';

type Protocol = 'ETH' | 'AE';

interface Props {
  protocol: Protocol;
}

const ConnectedWalletInfo = ({ protocol }: Props) => {
  const { aeAccount, ethAccount } = useWalletStore();

  const isConnected =
    (protocol === 'ETH' && ethAccount) || (protocol === 'AE' && aeAccount);

  const shortenAddress = (
    address: string,
    startLen = 8,
    endLen = 4,
  ): string => {
    if (!address || address.length <= startLen + endLen) return address;
    const start = address.slice(0, startLen);
    const end = address.slice(-endLen);
    return `${start}...${end}`;
  };

  const { address, balance, coinLabel } = useMemo(() => {
    switch (protocol) {
      case 'ETH':
        return {
          coinLabel: 'ETH',
          address: ethAccount?.address,
          balance: formatNumber(Number(ethAccount?.balance), {
            maximumFractionDigits: 4,
          }),
        };
      case 'AE':
        return {
          coinLabel: 'AE',
          address: aeAccount?.address,
          balance: formatNumber(
            Number(aeAccount?.balance.dividedBy(10 ** 18)),
            { maximumFractionDigits: 4 },
          ),
        };
    }
  }, [
    protocol,
    aeAccount?.address,
    aeAccount?.balance,
    ethAccount?.address,
    ethAccount?.balance,
  ]);

  if (isConnected) {
    return (
      <Box
        display="flex"
        alignItems={'center'}
        gap={'12px'}
        sx={{
          backgroundColor: 'rgba(21, 23, 30, 1)',
          borderRadius: '16px',
          padding: '4px 10px 4px 4px',
          minHeight: '44px',
          fontSize: '16px',
          fontWeight: 500,
        }}
      >
        <Box
          display="flex"
          justifyContent={'center'}
          alignItems={'center'}
          gap={'8px'}
          sx={{
            backgroundColor: 'rgba(35, 38, 49, 1)',
            borderRadius: '12px',
            padding: '6px 10px',
          }}
        >
          <Avatar address={address} />
          <Typography fontSize={'15px'}>
            {shortenAddress(address ?? '')}
          </Typography>
        </Box>
        <Typography fontSize={'15px'}>
          {balance} {coinLabel}
        </Typography>
      </Box>
    );
  }
};

export default ConnectedWalletInfo;
