import type { Metadata } from 'next';
import '../index.css';
import { Tomorrow } from 'next/font/google';

const font = Tomorrow({
  subsets: ['latin'],
  weight: ['400', '800'],
  variable: '--my-font',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Superhero Swap',
  description:
    'Superhero Swap is a simple Web3 DEX bridge on the æternity blockchain. It allows users to swap ETH and aeTH quickly and securely across chains, with low fees and no KYC. Designed for fast cross-chain swaps, it is available within your Superhero wallet and works seamlessly on both desktop and mobile browsers.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={font.variable}>
      <head>
        <meta name="theme-color" content="#000000" />
      </head>
      <body>
        <noscript>You need to enable JavaScript to run this app.</noscript>
        <div id="root">{children}</div>
      </body>
    </html>
  );
}
