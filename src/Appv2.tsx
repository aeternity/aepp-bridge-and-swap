import React from 'react';

import { ThemeProvider, CssBaseline } from '@mui/material';

import { lightTheme, darkTheme } from './app/theme';

import Header from './components/Header';
import DEXBridgeExchange from './components/Home/DEXBridgeExchange';
import { useExchangeStore } from './stores/exchangeStore';
import ExchangeFlow from './components/Flows/ExchangeFlow';

function App() {
  const { flow } = useExchangeStore();
  const [light, setLight] = React.useState(false);

  return (
    <ThemeProvider theme={light ? lightTheme : darkTheme}>
      <CssBaseline />
      <Header />
      {flow ? <ExchangeFlow /> : <DEXBridgeExchange />}
    </ThemeProvider>
  );
}

export default App;
