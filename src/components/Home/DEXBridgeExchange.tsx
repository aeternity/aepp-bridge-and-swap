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
      <Container sx={{ maxWidth: '472px' }} maxWidth={false} disableGutters>
        <Box display={'flex'} flexDirection={'column'} alignItems={'center'}>
          <Box sx={{ position: 'relative', marginTop: '160px' }}>
            <img
              src={'/assets/superheroswaplogo.svg'}
              style={{
                width: '300px',
                height: 'auto',
              }}
            />
            <img
              src={'/assets/superherologo.svg'}
              style={{
                width: 'auto',
                height: '35px',
                position: 'absolute',
                right: '-30px',
                top: '-25px',
              }}
            />
          </Box>
          <Typography fontSize={'23px'}>
            what would you like to swap?
          </Typography>
        </Box>
        <Box
          display={'flex'}
          flexDirection={'column'}
          alignItems={'stretch'}
          gap={'15px'}
          sx={{ margin: '67px 0px' }}
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
