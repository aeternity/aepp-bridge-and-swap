import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Box, Button, ButtonBase, Typography } from '@mui/material';
import EthLogo from '../../assets/EthLogo';
import AeLogoWhite from '../../assets/AeLogoWhite';
import { useWalletStore } from '../../stores/walletStore';
import DisconnectIcon from '../../assets/DisconnectIcon';
import WalletService from '../../services/WalletService';
import { BigNumber } from 'bignumber.js';
import { formatNumber } from '../../helpers';
import Avatar from '../Avatar';
import { useAppKit, useAppKitAccount } from '@reown/appkit/react';

type Protocol = 'ETH' | 'AE';

interface Props {
  protocol: Protocol;
}

const ConnectWalletButton = ({ protocol }: Props) => {
  const {
    connectEth,
    connectAe,
    disconnectAe,
    disconnectEth,
    aeAccount,
    ethAccount,
    updateAeBalance,
    updateEthBalance,
  } = useWalletStore();
  const { open } = useAppKit();
  const {
    address: ethereumAddressFromProvider,
    isConnected: isAppKitConnected,
  } = useAppKitAccount();

  const [isConnecting, setIsConnecting] = useState(false);

  const isConnected =
    (protocol === 'ETH' && ethereumAddressFromProvider && isAppKitConnected) ||
    (protocol === 'AE' && aeAccount);

  const connectAeternity = useCallback(async () => {
    try {
      setIsConnecting(true);
      const address = await WalletService.connectSuperHero();
      const balance = await WalletService.getAeBalance(
        address as `ak_${string}`,
      );
      connectAe(address);
      updateAeBalance(BigNumber(balance.toString()));
    } catch (error) {
      console.error(error);
    } finally {
      setIsConnecting(false);
    }
  }, [connectAe, updateAeBalance]);

  const connectEthereum = useCallback(async () => {
    try {
      console.log('connect eth');
      setIsConnecting(true);
      await open({ view: 'Connect' });
      // const address = await WalletService.connectMetamask();
      // const balance = await WalletService.getEthBalance(address);
      // connectEth(address);
      // updateEthBalance(BigNumber(balance));
    } catch (error) {
      console.error(error);
    } finally {
      setIsConnecting(false);
    }
  }, []);
  // }, [connectEth, updateEthBalance]);

  const disconnectAeternity = useCallback(() => {
    WalletService.disconnectWallet();
    disconnectAe();
  }, [disconnectAe]);

  const disconnectEthereum = useCallback(() => {
    WalletService.disconnectWallet();
    disconnectEth();
  }, [disconnectEth]);

  const { icon, label, connect, disconnect, address, balance, coinLabel } =
    useMemo(() => {
      switch (protocol) {
        case 'ETH':
          return {
            icon: <EthLogo />,
            label: 'Ethereum',
            coinLabel: 'ETH',
            address: ethAccount?.address,
            balance: formatNumber(Number(ethAccount?.balance), {
              maximumFractionDigits: 4,
            }),
            connect: connectEthereum,
            disconnect: disconnectEthereum,
          };
        case 'AE':
          return {
            icon: <AeLogoWhite />,
            label: 'æternity',
            coinLabel: 'AE',
            address: aeAccount?.address,
            balance: formatNumber(
              Number(aeAccount?.balance.dividedBy(10 ** 18)),
              { maximumFractionDigits: 4 },
            ),
            connect: connectAeternity,
            disconnect: disconnectAeternity,
          };
      }
    }, [
      protocol,
      connectAeternity,
      connectEthereum,
      aeAccount?.address,
      aeAccount?.balance,
      ethAccount?.address,
      ethAccount?.balance,
      disconnectEthereum,
      disconnectAeternity,
    ]);

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

  useEffect(() => {
    if (isAppKitConnected && ethereumAddressFromProvider) {
      connectEth(ethereumAddressFromProvider);

      WalletService.getEthBalance(ethereumAddressFromProvider)
        .then((balance) => {
          updateEthBalance(BigNumber(balance.toString()));
          setIsConnecting(false);
        })
        .catch(() => setIsConnecting(false));
    }
  }, [isAppKitConnected, ethereumAddressFromProvider]);

  if (isConnected) {
    return (
      <Box
        display="flex"
        alignItems={'center'}
        gap={'12px'}
        sx={{
          backgroundColor: 'rgba(35, 38, 49, 1)',
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
            backgroundColor: 'rgba(21, 23, 30, 1)',
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
        <ButtonBase onClick={disconnect} style={{ marginLeft: 'auto' }}>
          <DisconnectIcon />
        </ButtonBase>
      </Box>
    );
  }

  return (
    <Button startIcon={icon} onClick={connect} loading={isConnecting}>
      Connect {label} Wallet
    </Button>
  );
};

export default ConnectWalletButton;
