import React from 'react';
import { AppBar, Toolbar, Button, Box } from '@mui/material';
import Logo from '../assets/Logo';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { useExchangeStore } from '../stores/exchangeStore';
import ConnectedWalletInfo from './ConnectedWalletinfo';

const Header = () => {
  const { reset } = useExchangeStore();

  return (
    <>
      <AppBar
        elevation={0}
        position="sticky"
        sx={{ backgroundColor: '#232631' }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Logo onClick={reset} style={{ cursor: 'pointer' }} />
          <Box display={'flex'} gap={'16px'}>
            <ConnectedWalletInfo protocol="ETH" />
            <ConnectedWalletInfo protocol="AE" />
          </Box>
          <Button
            sx={{
              minWidth: 44,
              width: 44,
              height: 44,
              borderRadius: 2,
              marginLeft: '81px',
              backgroundColor: '#15171E',
              color: 'white',
            }}
          >
            <MoreHorizIcon />
          </Button>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Header;
