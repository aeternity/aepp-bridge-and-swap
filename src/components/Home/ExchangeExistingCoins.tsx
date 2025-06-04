import React from 'react';
import { Grid } from '@mui/material';
import EthLogo from '../../assets/EthLogo';
import AeLogo from '../../assets/AeLogo';
import HomeButton from './HomeButton';
import AeEthLogo from '../../assets/AeEthLogo';
import { useExchangeStore } from '../../stores/exchangeStore';

const ExchangeExistingCoins = () => {
  const { setFlow } = useExchangeStore();

  return (
    <>
      <Grid container display={'flex'} direction={'column'} gap="12px">
        <HomeButton
          fromIcon={<AeEthLogo />}
          toIcon={<AeLogo width={32} height={32} />}
          title="Exchange æETH to AE"
          subtitle="if you already have æETH tokens"
          onClick={() => setFlow('aeEthToAe')}
        />
        <HomeButton
          fromIcon={<AeEthLogo />}
          toIcon={<EthLogo width={32} height={32} />}
          title="Exchange æETH to ETH"
          subtitle="if you already have æETH tokens"
          onClick={() => setFlow('aeEthToEth')}
        />
      </Grid>
    </>
  );
};

export default ExchangeExistingCoins;
