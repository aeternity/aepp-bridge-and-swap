import type { Metadata } from "next";
import "../index.css";

export const metadata: Metadata = {
  title: "Buy AE with ETH",
  description:
    "A website which can be used to buy Aeternity coins with native Ethereum",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
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
