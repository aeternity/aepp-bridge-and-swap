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
              ? 'linear-gradient(340deg,rgba(0, 211, 161, 0) 50%, #53b6bf 100%);'
              : 'linear-gradient(156deg,rgba(0, 211, 161, 0) 50%, #53b6bf 100%);',
          backgroundAttachment: 'fixed',
          opacity: 0.4,
        }}
      ></Box>
    </>
  );
};

export default Background;
