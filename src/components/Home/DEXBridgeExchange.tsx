import React, { useState } from 'react';
import { Box, Typography, Container, Tabs, Tab } from '@mui/material';
import { darkTheme } from '../../app/theme';
import LightbulbCircleIcon from '../../assets/LightbulbCircleIcon';
import ExchangeCoins from './ExchangeCoins';
import ExchangeExistingCoins from './ExchangeExistingCoins';
import MessageBox from '../MessageBox';

const tabs = ['Exchange coins', 'Already have æETH?'];

const DEXBridgeExchange = () => {
  const [tab, setTab] = useState(0);

  const handleChange = (event, newValue) => {
    setTab(newValue);
  };

  return (
    <>
      <Typography
        sx={{
          textAlign: 'center',
          mb: 4,
          fontSize: '32px',
          fontWeight: 600,
          lineHeight: '72px',
        }}
      >
        Welcome To <span style={{ color: '#00D3A1' }}>DEX</span>Bridge Exchange
      </Typography>
      <Container sx={{ maxWidth: '472px' }} maxWidth={false} disableGutters>
        <Tabs
          value={tab}
          onChange={handleChange}
          variant="fullWidth"
          sx={{
            minHeight: 0,
          }}
          slotProps={{
            indicator: {
              style: {
                display: 'none',
              },
            },
          }}
        >
          {tabs.map((label, index) => (
            <Tab
              disableRipple
              key={index}
              label={
                <Box
                  display={'flex'}
                  alignItems={'center'}
                  justifyContent={'center'}
                  sx={{
                    fontSize: '20px',
                    height: '100%',
                    width: '100%',
                    bgcolor:
                      tab === index
                        ? darkTheme.palette.common.tabs.active
                        : darkTheme.palette.common.tabs.inactive,
                    fontWeight: tab === index ? 600 : 500,
                    borderTopLeftRadius: 0,
                    borderTopRightRadius: 0,
                    borderBottomRightRadius: index === 0 ? '16px' : 0,
                    borderBottomLeftRadius: index === 0 ? 0 : '16px',
                    transition:
                      'background-color 0.2s ease-in-out, color 0.2s ease-in-out',
                    color: tab === index ? '#fff' : '#00D1B2',
                  }}
                >
                  <Box sx={{ padding: '10px 24px' }}>{label}</Box>
                </Box>
              }
              sx={{
                flex: index === 0 ? '0 1 auto' : '1',
                textTransform: 'none',
                minWidth: 'auto',
                minHeight: 0,
                padding: 0,
                borderRadius: '16px 16px 0 0',
                backgroundColor: '#1B1D26',
                transition: 'all 0.2s ease-in-out',
              }}
            />
          ))}
        </Tabs>
        <Box
          sx={{
            backgroundColor: '#1B1D26',
            borderRadius: '16px',
            padding: '24px',
            borderTopLeftRadius: tab === 0 ? 0 : '16px',
            borderTopRightRadius: tab === 1 ? 0 : '16px',
            transition: 'all 0.2s ease-in-out',
          }}
        >
          {tab === 0 ? <ExchangeCoins /> : <ExchangeExistingCoins />}
        </Box>
        <Box mt={'16px'}>
          <MessageBox
            icon={<LightbulbCircleIcon />}
            message={
              <>
                <span style={{ fontWeight: 500 }}>Tip:</span> if you already
                have <span style={{ fontWeight: 500 }}>æETH</span> (wrapped ETH)
                tokens in your æternity wallet you may directly exchange them
                for <span style={{ fontWeight: 500 }}>AE</span> or{' '}
                <span style={{ fontWeight: 500 }}>ETH</span>.
              </>
            }
          />
        </Box>
      </Container>
    </>
  );
};

export default DEXBridgeExchange;
