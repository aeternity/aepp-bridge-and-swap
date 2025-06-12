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
  title: 'DEXBridge',
  description:
    'A website which can be used to buy Aeternity coins with native Ethereum',
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
