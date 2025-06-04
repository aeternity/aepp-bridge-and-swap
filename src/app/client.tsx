'use client';

import dynamic from 'next/dynamic';

const App = dynamic(() => import('../Appv2'), { ssr: false });

export function ClientOnly() {
  return <App />;
}
