import React, { useEffect } from 'react';

import { ThemeProvider, CssBaseline } from '@mui/material';

import { darkTheme, lightTheme } from './app/theme';

import Background from './components/Background';
import DEXBridgeExchange from './components/Home/DEXBridgeExchange';
import { useExchangeStore } from './stores/exchangeStore';
import ExchangeFlow from './components/Flows/ExchangeFlow';
import { AppKitProvider } from './context/AppKitProvider';
import { useThemeStore } from './stores/themeStore';

function App() {
  const { flow } = useExchangeStore();
  const { mode, setMode } = useThemeStore();

  useEffect(() => {
    const stored = localStorage.getItem('theme-mode');
    if (stored === 'light' || stored === 'dark') {
      setMode(stored);
    } else {
      setMode('light');
    }
  }, []);

  if (!mode) {
    return;
  }

  return (
    <ThemeProvider theme={mode === 'dark' ? darkTheme : lightTheme}>
      <AppKitProvider>
        <CssBaseline />
        <Background />
        {flow ? <ExchangeFlow /> : <DEXBridgeExchange />}
      </AppKitProvider>
    </ThemeProvider>
  );
}

export default App;
