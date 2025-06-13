import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from '@mui/material';
import { useWalletStore } from '../../stores/walletStore';
import WalletService from '../../services/WalletService';
import { BigNumber } from 'bignumber.js';
import { executeAndSetInterval, formatNumber } from '../../helpers';
import { useAppKit, useAppKitAccount } from '@reown/appkit/react';
import DisconnectIcon from '../../assets/DisconnectIcon';

type Protocol = 'ETH' | 'AE';

interface Props {
  protocol: Protocol;
}

const ConnectWalletButton = ({ protocol }: Props) => {
  let pollAeBalanceInterval: NodeJS.Timer;
  let pollEthBalanceInterval: NodeJS.Timer;

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

  const isConnected = !!(
    (protocol === 'ETH' && ethereumAddressFromProvider && isAppKitConnected) ||
    (protocol === 'AE' && aeAccount)
  );

  const connectAeternity = useCallback(async () => {
    try {
      setIsConnecting(true);
      const address = await WalletService.connectSuperHero();
      connectAe(address);
      if (!pollAeBalanceInterval) {
        pollAeBalanceInterval = executeAndSetInterval(async () => {
          const balance = await WalletService.getAeBalance(
            address as `ak_${string}`,
          );
          updateAeBalance(BigNumber(balance.toString()));
        }, 5000);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsConnecting(false);
    }
  }, [connectAe, updateAeBalance]);

  const connectEthereum = useCallback(async () => {
    try {
      setIsConnecting(true);
      await open({ view: 'Connect' });
    } catch (error) {
      console.error(error);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnectAeternity = useCallback(() => {
    WalletService.disconnectWallet();
    disconnectAe();
    if (pollAeBalanceInterval) {
      clearInterval(pollAeBalanceInterval);
    }
  }, [disconnectAe]);

  const disconnectEthereum = useCallback(() => {
    WalletService.disconnectWallet();
    disconnectEth();
    if (pollEthBalanceInterval) {
      clearInterval(pollEthBalanceInterval);
    }
  }, [disconnectEth]);

  const { label, connect, disconnect } = useMemo(() => {
    switch (protocol) {
      case 'ETH':
        return {
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

  useEffect(() => {
    if (isAppKitConnected && ethereumAddressFromProvider) {
      connectEth(ethereumAddressFromProvider);

      if (!pollEthBalanceInterval) {
        pollEthBalanceInterval = executeAndSetInterval(() => {
          WalletService.getEthBalance(ethereumAddressFromProvider)
            .then((balance) => {
              updateEthBalance(BigNumber(balance.toString()));
              setIsConnecting(false);
            })
            .catch(() => setIsConnecting(false));
        }, 5000);
      }
    }
  }, [isAppKitConnected, ethereumAddressFromProvider]);

  return (
    <Button
      color={protocol === 'AE' ? 'primary' : 'secondary'}
      onClick={isConnected ? disconnect : connect}
      loading={isConnecting}
      sx={{
        minWidth: '272px',
        justifyContent: isConnected ? 'end' : 'center',
        backgroundColor: isConnected ? '#adadad' : '',
      }}
      endIcon={isConnected && <DisconnectIcon />}
    >
      {isConnected ? 'Disconnect' : 'Connect'}
      {` ${label} Wallet`}
    </Button>
  );
};

export default ConnectWalletButton;
