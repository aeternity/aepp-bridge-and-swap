import React, { useMemo } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { useWalletStore } from '../stores/walletStore';
import { formatNumber } from '../helpers';

type Protocol = 'ETH' | 'AE';

interface Props {
  protocol: Protocol;
}

const ConnectedWalletInfo = ({ protocol }: Props) => {
  const theme = useTheme();

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
      <>
        <Typography fontSize={'15px'}>
          {shortenAddress(address ?? '')}
        </Typography>
        <Box
          display="flex"
          alignItems={'center'}
          justifyContent={'center'}
          gap={'12px'}
          sx={{
            backgroundColor:
              protocol == 'AE'
                ? theme.palette.primary.main
                : theme.palette.secondary.main,
            borderRadius: '16px',
            padding: '4px',
            fontSize: '16px',
          }}
        >
          <Typography fontSize={'15px'} color="white">
            {balance} {coinLabel}
          </Typography>
        </Box>
      </>
    );
  }
};

export default ConnectedWalletInfo;
