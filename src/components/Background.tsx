import React from 'react';
import { Box, Button } from '@mui/material';
import { useThemeStore } from '../stores/themeStore';
import ModeIcon from '../assets/ModeIcon';

const Background = () => {
  const { toggleMode, mode } = useThemeStore();

  return (
    <>
      <Box
        className="background"
        sx={{
          position: 'fixed',
          inset: '0',
          zIndex: -2,
          background:
            mode === 'dark'
              ? 'linear-gradient(180deg, transparent 80%, #53b6bf8c 120%), url("assets/darkthemebg.png")'
              : 'linear-gradient(180deg, white 20%, #53b6bf 100%);',
          backgroundAttachment: 'fixed',
          opacity: mode === 'dark' ? 1 : 0.4,
        }}
      />
      <Button
        sx={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          borderRadius: '100%',
          width: '50px',
          height: '50px',
          minWidth: '50px',
          padding: 0,
        }}
        onClick={toggleMode}
      >
        <ModeIcon
          color={mode === 'dark' ? 'black' : 'white'}
          width={'40px'}
          height={'auto'}
        />
      </Button>
    </>
  );
};

export default Background;
