import { createAppKit } from '@reown/appkit/react';
import { EthersAdapter } from '@reown/appkit-adapter-ethers';
import { AppKitNetwork, mainnet } from '@reown/appkit/networks';

const networks = [mainnet] as [AppKitNetwork, ...AppKitNetwork[]];
const metadata = {
  name: 'AE Bridge and Swap',
  description: 'aeternity/aepp-bridge-and-swap',
  url: 'example.com',
  icons: [],
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
