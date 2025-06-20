import React, { useEffect } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { unpackTx, Tag } from '@aeternity/aepp-sdk';
import { BytecodeContractCallEncoder } from '@aeternity/aepp-calldata';
import { BigNumber } from 'bignumber.js';

import { darkTheme, lightTheme } from './app/theme';

import Background from './components/Background';
import DEXBridgeExchange from './components/Home/DEXBridgeExchange';
import { useExchangeStore } from './stores/exchangeStore';
import ExchangeFlow from './components/Flows/ExchangeFlow';
import { AppKitProvider } from './context/AppKitProvider';
import { useThemeStore } from './stores/themeStore';
import { FlowType } from './stores/exchangeStore';
import { useWalletStore } from './stores/walletStore';
import { useFormStore } from './stores/formStore';
import TokenPriceService from './services/TokenPriceService';


function App() {
  const { connectAe } = useWalletStore();
  const { setFromAmount, setToAmount } = useFormStore();
  const { flow, setStep, setFlow } = useExchangeStore();
  const { mode, setMode } = useThemeStore();

  useEffect(() => {
    const search = new URLSearchParams(window.location.search);
    const query = {
      aeAddress: search.get('ae-address'),
      flow: search.get('flow'),
      step: search.get('step'),
      transaction: search.get('transaction'),
      amountFrom: search.get('amountFrom'),
    };

    if (query.aeAddress) {
      connectAe(query.aeAddress);
    }
    if (query.flow) {
      setFlow(query.flow as FlowType);
    }
    TokenPriceService.getPrices().then((prices) => {
      if (query.transaction && query.amountFrom) {
        setFromAmount(BigNumber(query.amountFrom).shiftedBy(-18).toNumber());
        setToAmount(BigNumber(query.amountFrom).multipliedBy(prices.aeEthToAeRatio).shiftedBy(-18).toNumber());
        setStep(Number(query.step));
      }
    });

    if (!query.transaction && query.flow) {
      setFlow(query.flow as FlowType);
      setStep(Number(query.step));
    }


    const stored = localStorage.getItem('theme-mode');
    if (stored === 'light' || stored === 'dark') {
      setMode(stored);
    } else if (window.matchMedia?.('(prefers-color-scheme: dark)')?.matches) {
      setMode('dark');
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
