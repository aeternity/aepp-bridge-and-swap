import React from 'react';
import { Box, useTheme } from '@mui/material';

const Background = () => {
  const theme = useTheme();

  return (
    <>
      <Box
        className="background"
        sx={{
          position: 'fixed',
          inset: '0',
          zIndex: -2,
          background:
            theme.palette.mode === 'dark'
              ? 'linear-gradient(340deg, #141414 50%, #1b3c3f 100%);'
              : 'linear-gradient(160deg, white 30%, #53b6bf 100%);',
          backgroundAttachment: 'fixed',
          opacity: theme.palette.mode === 'dark' ? 1 : 0.4,
        }}
      />
    </>
  );
};

export default Background;
