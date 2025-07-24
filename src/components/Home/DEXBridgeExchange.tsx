import React, { useState } from 'react';
import { Box, Typography, Container, Button } from '@mui/material';
import { useExchangeStore } from '../../stores/exchangeStore';

const DEXBridgeExchange = () => {
  const { setFlow } = useExchangeStore();
  const [tab, setTab] = useState(0);

  return (
    <>
      <Container sx={{ maxWidth: '472px' }} maxWidth={false}>
        <Box display={'flex'} flexDirection={'column'} alignItems={'center'}>
          <Box sx={{ position: 'relative', marginTop: '160px', paddingRight: '24px' }}>
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
          sx={{ margin: '60px auto', maxWidth: '150px' }}
        >
          {tab === 0 ? (
            <>
              <Button variant="primary" onClick={() => setFlow('ethToAe')} style={{ display: 'block' }}>
                ETH to AE
              </Button>
              <Button variant="secondary" onClick={() => setFlow('aeToEth')} style={{ display: 'none' }}>
                AE to ETH
              </Button>
              <Button variant="secondary" onClick={() => setFlow('aeEthToAe')}>
                aeETH to AE
              </Button>
            </>
          ) : (
            <>
              <Button variant="primary" onClick={() => setFlow('aeEthToAe')}>
                aeETH to AE
              </Button>
              <Button variant="secondary" onClick={() => setFlow('aeEthToEth')}>
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
          <Typography mb={'10px'} color='#269ad6' fontFamily={'sans-serif'}>are you <b>new</b> to all this?</Typography>
          <Typography fontFamily={'sans-serif'}>
            Don't worry: it’s quick, and we’ll guide you along the way.
          </Typography>
        </Container>
        <Box>
          <Button
            variant={'primary'}
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
