import React from 'react';

import { ThemeProvider, CssBaseline } from '@mui/material';

import { darkTheme } from './app/theme';

import Header from './components/Header';
import DEXBridgeExchange from './components/Home/DEXBridgeExchange';
import { useExchangeStore } from './stores/exchangeStore';
import ExchangeFlow from './components/Flows/ExchangeFlow';
import { AppKitProvider } from './context/AppKitProvider';

function App() {
  const { flow } = useExchangeStore();
  // const [light] = useState(false);

  return (
    <ThemeProvider theme={darkTheme}>
      <AppKitProvider>
        <CssBaseline />
        <Header />
        {flow ? <ExchangeFlow /> : <DEXBridgeExchange />}
      </AppKitProvider>
    </ThemeProvider>
  );
}

export default App;
