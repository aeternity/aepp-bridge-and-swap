import {
  AeSdkAepp,
  BrowserWindowMessageConnection,
  Node,
  SUBSCRIPTION_TYPES,
  walletDetector,
} from "@aeternity/aepp-sdk";
import { AE_NODE_URL } from "../constants";

export const aeSdk = new AeSdkAepp({
  name: "Bridge and Swap App",
  nodes: [
    {
      name: "mainnet",
      instance: new Node(AE_NODE_URL),
    },
  ],
  onNetworkChange: async ({ networkId }) => {
    console.log(await aeSdk.getNodesInPool(), networkId);
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
    console.log("setNetworkId", networkId);
  },
  onAddressChange: ({ current }) => console.log(Object.keys(current)[0]),
  onDisconnect: () => console.log("Aepp is disconnected"),
});

// TODO rewrite this to use the new SDK https://github.com/aeternity/aepp-sdk-js/blob/2d6ec8138af448204271b10c7517ede96f0ef998/examples/browser/aepp/src/components/ConnectFrame.vue#L61
export default class WalletService {
  static async connectMetamask() {
    const accounts = await window.ethereum?.request({
      method: "eth_requestAccounts",
    });
    return accounts[0];
  }

  static async getEthBalance(address: string): Promise<number> {
    const balance = await window.ethereum?.request({
      method: "eth_getBalance",
      params: [address, "latest"],
    });

    return balance ? parseInt(balance) / 1e18 : 0;
  }

  static async connectSuperHero(): Promise<string> {
    return new Promise((resolve, reject) => {
      const handleWallets = async ({ wallets, newWallet }: any) => {
        try {
          newWallet ||= Object.values(wallets)[0];
          if (newWallet) {
            const walletInfo = await aeSdk.connectToWallet(
              newWallet.getConnection(),
            );
            const {
              address: { current },
            } = await aeSdk.subscribeAddress(
              "subscribe" as SUBSCRIPTION_TYPES,
              "connected",
            );
            const address = Object.keys(current)[0];
            console.log(walletInfo, current);
            resolve(address);
          }
          stopScan();
          reject();
        } catch (e) {
          reject(e);
        }
      };

      const scannerConnection = new BrowserWindowMessageConnection();
      const stopScan = walletDetector(scannerConnection, handleWallets);
    });
  }
}
