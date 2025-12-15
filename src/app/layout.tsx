import type { Metadata } from 'next';
import type { Viewport } from 'next';
import '../index.css';
import { Tomorrow } from 'next/font/google';

const font = Tomorrow({
  subsets: ['latin'],
  weight: ['400', '800'],
  variable: '--my-font',
  display: 'swap',
});

const siteUrl = 'https://swap.superhero.com'.replace(/\/$/, '');

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: 'Superhero Swap',
  title: {
    default: 'Superhero Swap',
    template: '%s | Superhero Swap',
  },
  description:
    'Superhero Swap is a simple Web3 DEX bridge on the æternity blockchain. It allows users to swap ETH and aeTH quickly and securely across chains, with low fees and no KYC. Designed for fast cross-chain swaps, it is available within your Superhero wallet and works seamlessly on both desktop and mobile browsers.',
  keywords: [
    'Superhero Swap',
    'æternity',
    'aeternity',
    'DEX',
    'bridge',
    'cross-chain',
    'ETH',
    'aeTH',
    'crypto',
    'web3',
  ],
  authors: [{ name: 'Superhero' }],
  alternates: {
    canonical: '/',
    languages: {
      'en': '/',
    },
  },
  openGraph: {
    type: 'website',
    url: siteUrl + '/',
    title: 'Superhero Swap',
    siteName: 'Superhero Swap',
    description:
      'Swap ETH and aeTH on the æternity blockchain with the Superhero DEX bridge. Fast, low-fee, and no KYC.',
    images: [
      {
        url: '/logo512.png',
        alt: 'Superhero Swap',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Superhero Swap',
    description:
      'Swap ETH and aeTH on the æternity blockchain with the Superhero DEX bridge. Fast, low-fee, and no KYC.',
    images: ['/logo512.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.ico' },
    ],
    apple: [
      { url: '/logo192.png', sizes: '192x192' },
    ],
  },
  category: 'technology',
};

export const viewport: Viewport = {
  themeColor: '#000000',
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
        <link rel="canonical" href={`${siteUrl}/`} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'WebSite',
                  name: 'Superhero Swap',
                  url: siteUrl + '/',
                  description:
                    'Superhero Swap is a Web3 DEX bridge on the æternity blockchain.',
                  potentialAction: {
                    '@type': 'SearchAction',
                    target: `${siteUrl}/?q={search_term_string}`,
                    'query-input': 'required name=search_term_string',
                  },
                },
                {
                  '@type': 'Organization',
                  name: 'Superhero',
                  url: siteUrl + '/',
                  logo: {
                    '@type': 'ImageObject',
                    url: `${siteUrl}/assets/superheroswaplogo.svg`,
                  },
                },
              ],
            }),
          }}
        />
      </head>
      <body>
        <noscript>You need to enable JavaScript to run this app.</noscript>
        <div id="root">{children}</div>
      </body>
    </html>
  );
}
