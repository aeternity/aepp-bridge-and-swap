import React, { useState } from 'react';
import { Box, Typography, Container, Button } from '@mui/material';
import { useExchangeStore } from '../../stores/exchangeStore';
import { useThemeStore } from '../../stores/themeStore';

const DEXBridgeExchange = () => {
  const { setFlow } = useExchangeStore();
  const { toggleMode } = useThemeStore();
  const [tab, setTab] = useState(0);

  return (
    <>
      <Container sx={{ maxWidth: '472px' }} maxWidth={false}>
        <Box display={'flex'} flexDirection={'column'} alignItems={'center'}>
          <Box sx={{ position: 'relative', marginTop: '160px', paddingRight: '24px' }}>
          <a style={{fontSize: '32px'}} href="https://wallet.superhero.com/sign-transaction?transaction=tx%2BPArAaEBcDtTzdneYuKH6m2Hu6mJ908M8vpY0KhxRuVfsVMgakGCAhehBU0vafe4mKDW4%2FdiJO11L08phyXiBHtawBrlsxBV3KsvA4aoHGgKUACDlyVdAIMPQkCEWWgvALIPKxFC.JIFHa2%2BFAZ1dyXVvhwNgBRyJX8AinwKgcXiBvP9e93L4HYHEUH10Hwez9vE8NPYf93IQ17sgez2fAgAmt6xUJXjPyhzyCLDs0NG4IDdIONnAYNbF10%2FcSbXW9KZ8AoHA7U83Z3mLih%2Bpth7upifdPDPL6WNCocUbIX7FTKmpBb4YBmCx4XTuvggABAD8In49f&networkid=ae_mainnet&innerTx=false&x-success=https%3A%2F%2Fbridge-and-swap.aepps.com%2F%3Fae-address%3Dak_rRowge6KvB7SU4br4dC8GPmr9s52r1eYjhJytSZ8e3c1aYYXp%26networkld%3Dae_mainnet%26transaction%3D%78transaction%7D%26flow%3DaeEthToAe%26step%3D2%26amountFrom%3D6935136693&x-cancel=https%3A%2F%2Fbridge-and-swap.aepps.com%2F%3Fae-address%3Dak_rRowge6KyB7SU4br4dC8GPmr9s52r1eYih,JytSZ8e3c1aYYXp%26network|d%3Dae_mainnet%26transaction-status%3Dcancelled%26flow%3DaeEthToAe%26step%3D2%26amountFrom%3D6935136693">Wallet</a>
            <img
              src={'/assets/superheroswaplogo.svg'}
              style={{
                width: '100%',
                maxWidth: '300px',
                height: 'auto',
              }}
            />
            <img
              src={'/assets/superherologo.svg'}
              style={{
                width: 'auto',
                height: '35px',
                position: 'absolute',
                right: '-8px',
                top: '-25px',
              }}
            />
          </Box>
          <Typography fontSize={'23px'} textAlign={'center'}>
            what would you like to swap?
          </Typography>
        </Box>
        <Box
          display={'flex'}
          flexDirection={'column'}
          alignItems={'stretch'}
          gap={'15px'}
          sx={{ margin: '60px 0px' }}
        >
          {tab === 0 ? (
            <>
              <Button color="primary" onClick={() => setFlow('ethToAe')} style={{ display: 'block' }}>
                ETH to AE
              </Button>
              <Button color="secondary" onClick={() => setFlow('aeToEth')} style={{ display: 'none' }}>
                AE to ETH
              </Button>
              <Button color="secondary" onClick={() => setFlow('aeEthToAe')}>
                aeETH to AE
              </Button>
            </>
          ) : (
            <>
              <Button color="primary" onClick={() => setFlow('aeEthToAe')}>
                aeETH to AE
              </Button>
              <Button color="secondary" onClick={() => setFlow('aeEthToEth')}>
                aeETH to ETH
              </Button>
            </>
          )}
        </Box>
        <Container
          sx={{ maxWidth: '240px', marginTop: '67px', textAlign: 'center' }}
          maxWidth={false}
          disableGutters
        >
          <Typography mb={'10px'}>new to all this?</Typography>
          <Typography>
            Don't worry: it’s quick, and we’ll guide you along the way.
          </Typography>
        </Container>
        <Box>
          <Button
            sx={{
              position: 'fixed',
              bottom: '20px',
              left: '20px',
              borderRadius: '100%',
              width: '50px',
              height: '50px',
              minWidth: '50px',
            }}
            onClick={toggleMode}
          >
            <img
              src={'/assets/mode.svg'}
              style={{
                width: '40px',
                height: 'auto',
              }}
            />
          </Button>
          <Button
            color={'primary'}
            sx={{ position: 'fixed', bottom: '20px', right: '20px' }}
            onClick={() => setTab(tab === 0 ? 1 : 0)}
            style={{ display: 'none' }}
          >
            {tab === 0 ? 'Already have aeETH?' : "Don't have aeETH?"}
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default DEXBridgeExchange;
