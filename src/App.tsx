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
import { fetchJson } from './helpers';
import { Constants } from './constants';
import { useFormStore } from './stores/formStore';


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
    };

    if (query.aeAddress) {
      connectAe(query.aeAddress);
    }

    if (query.transaction) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const unpackedTransaction = unpackTx(query.transaction as `tx_${string}`, Tag.SignedTx) as any;
      if (unpackedTransaction.encodedTx.contractId === Constants.ae_dex_router_address) {
        setFlow(query.flow as FlowType);
          fetchJson(`https://mainnet.aeternity.io/v3/contracts/${unpackedTransaction.encodedTx.contractId}/code`)
            .then(({ bytecode }) => {
              const bytecodeContractCallEncoder = new BytecodeContractCallEncoder(bytecode);
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const decodedCallData = bytecodeContractCallEncoder.decodeCall(unpackedTransaction.encodedTx.callData) as any;
              setFromAmount(BigNumber(decodedCallData.args[0] as bigint).shiftedBy(-18).toNumber());
              setToAmount(BigNumber(decodedCallData.args[1] as bigint).shiftedBy(-18).toNumber());
              setStep(Number(query.step));
          })
      }
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
