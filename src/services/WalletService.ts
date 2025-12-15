import {
  AeSdkAepp,
  BrowserWindowMessageConnection,
  Contract,
  Node,
  SUBSCRIPTION_TYPES,
  walletDetector,
} from '@aeternity/aepp-sdk';
import aex9ACI from 'dex-contracts-v2/build/FungibleTokenFull.aci.json';

import { Constants } from '../constants';

export const aeSdk = new AeSdkAepp({
  name: 'ChainFusion',
  nodes: [
    {
      name: Constants.name,
      instance: new Node(Constants.ae_node_url),
    },
  ],
  onNetworkChange: async ({ networkId }) => {
    const currentNetwork = (await aeSdk.getNodesInPool()).filter(
      (node) => node.nodeNetworkId === networkId,
    );
    if (!currentNetwork.length) {
      alert(
        `Unsupported network "${networkId}". Please switch to aeternity mainnet.`,
      );
      return;
    }

    const [{ name }] = currentNetwork;
    aeSdk.selectNode(name);
    console.log('setNetworkId', networkId);
  },
  onAddressChange: ({ current }) => console.log(Object.keys(current)[0]),
  onDisconnect: () => console.log('Aepp is disconnected'),
});

// TODO rewrite this to use the new SDK https://github.com/aeternity/aepp-sdk-js/blob/2d6ec8138af448204271b10c7517ede96f0ef998/examples/browser/aepp/src/components/ConnectFrame.vue#L61
export default class WalletService {
  static async getEthBalance(address: string): Promise<number> {
    const balance = await window.ethereum?.request({
      method: 'eth_getBalance',
      params: [address, 'latest'],
    });

    return balance ? parseInt(balance) / 1e18 : 0;
  }

  static getAeBalance(address: `ak_${string}`): Promise<bigint> {
    return aeSdk
      .getBalance(address)
      .then((balance) => BigInt(balance))
      .catch((error) => {
        console.info(error);
        return 0n;
      });
  }

  static isNewAccount(address: `ak_${string}`): Promise<boolean> {
    return aeSdk
      .getBalance(address)
      .then(() => false)
      .catch(() => true);
  }

  static async getAeWethBalance(address: `ak_${string}`): Promise<bigint> {
    const tokenInstance = await Contract.initialize({
      ...aeSdk.getContext(),
      aci: aex9ACI,
      address: Constants.ae_weth_address,
    });
    try {
      // { onAccount: undefined } option is added, because current sdk version will fail
      // to get balance, in case account was never used before
      return BigInt(
        (await tokenInstance.balance(address, { onAccount: undefined }))
          .decodedResult ?? 0,
      );
    } catch (e: unknown) {
      console.log(e);
      return BigInt(0);
    }
  }

  static connectSuperHero(): Promise<string> {
    return new Promise((resolve, reject) => {
      let walletFound = false;

      type WalletLike = {
        getConnection: () => unknown;
      };

      type WalletDetectorEvent = {
        wallets?: Record<string, WalletLike>;
        newWallet?: WalletLike;
      };

      const handleWallets = async (event: unknown) => {
        const { wallets, newWallet }: WalletDetectorEvent =
          (event as WalletDetectorEvent) ?? {};
        walletFound = true;
        try {
          const selectedWallet = newWallet ?? Object.values(wallets ?? {})[0];
          if (selectedWallet) {
            const walletInfo = await aeSdk.connectToWallet(
              selectedWallet.getConnection() as Parameters<typeof aeSdk.connectToWallet>[0],
            );
            const {
              address: { current },
            } = await aeSdk.subscribeAddress(
              'subscribe' as SUBSCRIPTION_TYPES,
              'connected',
            );
            const address = Object.keys(current)[0];
            console.log(walletInfo, current);
            resolve(address);
            stopScan();
            return;
          }
          stopScan();
          reject();
        } catch (e) {
          reject(e);
        }
      };

      const scannerConnection = new BrowserWindowMessageConnection();
      const stopScan = walletDetector(scannerConnection, handleWallets);
      // Reject if no wallet found in 8 seconds
      setTimeout(() => {
        if (!walletFound) {
          reject(new Error('Timeout'));
        }
      }, 8000);
    });
  }

  static disconnectWallet() {
    try {
      aeSdk.disconnectWallet();
    } catch (e: unknown) {
      console.error(e);
    }
  }
}
