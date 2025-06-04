import React from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  Typography,
  Container,
} from '@mui/material';
import Logo from '../assets/Logo';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <AppBar
        elevation={0}
        position="sticky"
        sx={{ backgroundColor: '#232631' }}
      >
        <Toolbar>
          <Box flexGrow={1}>
            <Logo />
          </Box>
          <Button
            sx={{
              minWidth: 44,
              width: 44,
              height: 44,
              borderRadius: 2,
              backgroundColor: '#15171E',
              color: 'white',
            }}
          >
            <MoreHorizIcon />
          </Button>
        </Toolbar>
      </AppBar>

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
        {children}
      </Container>
    </>
  );
};

export default Layout;
