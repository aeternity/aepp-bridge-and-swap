import React, { useState } from 'react';

import { ThemeProvider, CssBaseline } from '@mui/material';

import { lightTheme, darkTheme } from './app/theme';

import Header from './components/Header';
import DEXBridgeExchange from './components/Home/DEXBridgeExchange';
import { useExchangeStore } from './stores/exchangeStore';
import ExchangeFlow from './components/Flows/ExchangeFlow';
import { AppKitProvider } from './context/AppKitProvider';

function App() {
  const { flow } = useExchangeStore();
  const [light] = useState(false);

  return (
    <AppKitProvider>
      <ThemeProvider theme={light ? lightTheme : darkTheme}>
        <CssBaseline />
        <Header />
        {flow ? <ExchangeFlow /> : <DEXBridgeExchange />}
      </ThemeProvider>
    </AppKitProvider>
  );
}

export default App;
