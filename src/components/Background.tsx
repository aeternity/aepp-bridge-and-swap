import React from 'react';
import { Box, useTheme } from '@mui/material';

const Background = () => {
  const theme = useTheme();

  return (
    <>
      <Box
        sx={{
          position: 'fixed',
          inset: '0',
          zIndex: -2,
          background:
            theme.palette.mode === 'dark'
              ? ''
              : 'linear-gradient(to bottom, transparent 0%, transparent 66%, #bdbdbd 100%)',
          backgroundAttachment: 'fixed',
        }}
      ></Box>
    </>
  );
};

export default Background;
