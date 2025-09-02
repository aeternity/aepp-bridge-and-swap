import { createAppKit } from '@reown/appkit/react';
import { EthersAdapter } from '@reown/appkit-adapter-ethers';
import { AppKitNetwork, mainnet } from '@reown/appkit/networks';

const networks = [mainnet] as [AppKitNetwork, ...AppKitNetwork[]];
const metadata = {
  name: 'Superhero Swap',
  description: 'Superhero Swap is a simple Web3 DEX bridge on the æternity blockchain. It allows users to swap ETH and aeTH quickly and securely across chains, with low fees and no KYC. Designed for fast cross-chain swaps, it is available within your Superhero wallet and works seamlessly on both desktop and mobile browsers',
  url: window.location.origin,
  icons: ['https://swap.superhero.com/favicon.ico'],
};

createAppKit({
  adapters: [new EthersAdapter()],
  networks,
  metadata,
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!,
  themeVariables: {
    '--w3m-color-mix': '#f5274e',
    '--w3m-color-mix-strength': 10,
    '--w3m-font-family':
      ': -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;',
    '--w3m-border-radius-master': '.5px',
  },
  featuredWalletIds: [
    'd15c9975084e5bc349d63aa83be8d9a053941483aa2c3934d00d4c4d73d45667',
    'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96'
  ],
  features: {
    analytics: false,
    email: false,
    socials: false,
    swaps: false,
    onramp: false,
  },
});

export function AppKitProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
