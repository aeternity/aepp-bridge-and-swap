import React from 'react';
import { Grid } from '@mui/material';
import EthLogo from '../../assets/EthLogo';
import AeLogo from '../../assets/AeLogo';
import HomeButton from './HomeButton';
import { useExchangeStore } from '../../stores/exchangeStore';

const ExchangeCoins = () => {
  const { setFlow } = useExchangeStore();

  return (
    <>
      <Grid container display={'flex'} direction={'column'} gap="12px">
        <HomeButton
          fromIcon={<AeLogo />}
          toIcon={<EthLogo />}
          title="Exchange ETH to AE"
          subtitle="ETH → æETH → AE"
          onClick={() => setFlow('ethToAe')}
        />
        <HomeButton
          fromIcon={<EthLogo />}
          toIcon={<AeLogo />}
          title="Exchange AE to ETH"
          subtitle="AE → æETH → ETH"
          onClick={() => setFlow('aeToEth')}
        />
      </Grid>
    </>
  );
};

export default ExchangeCoins;
