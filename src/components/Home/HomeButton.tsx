import React from 'react';
import { Box, Typography } from '@mui/material';

interface HomeButtonProps {
  fromIcon: React.ReactNode;
  toIcon: React.ReactNode;
  title: string;
  subtitle: string;
  onClick: () => void;
}

const HomeButton = ({
  fromIcon,
  toIcon,
  title,
  subtitle,
  onClick,
}: HomeButtonProps) => {
  return (
    <Box
      onClick={onClick}
      sx={{
        cursor: 'pointer',
        padding: '16px 12px',
        backgroundColor: '#2a2c37',
        borderRadius: '16px',
        textAlign: 'center',
      }}
    >
      <Box>
        <Box component="span" sx={{ position: 'relative', zIndex: 1 }}>
          {fromIcon}
        </Box>
        <Box component="span" sx={{ position: 'relative', left: '-8px' }}>
          {toIcon}
        </Box>
      </Box>
      <Typography mt={'8px'} fontSize={'18px'} fontWeight={600}>
        {title}
      </Typography>
      <Typography mt={'4px'} fontSize={'15px'} sx={{ opacity: 0.8 }}>
        {subtitle}
      </Typography>
    </Box>
  );
};

export default HomeButton;
