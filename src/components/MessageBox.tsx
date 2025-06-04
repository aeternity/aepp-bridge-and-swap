import React from 'react';
import { Box, Typography } from '@mui/material';
import InfoIcon from '../assets/InfoIcon';
import CheckmarkCircleIcon from '../assets/CheckmarkCircleIcon';
import CrossCircleIcon from '../assets/CrossCircleIcon';

interface MessageProps {
  icon?: React.ReactNode;
  message: React.ReactNode;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
}

const MessageBox = ({ icon, message, type = 'INFO' }: MessageProps) => {
  const BackgroundColor = () => {
    switch (type) {
      case 'INFO':
        return 'rgba(35, 38, 49, 1)';
      case 'SUCCESS':
        return 'rgba(0, 211, 161, 0.08)';
      case 'WARNING':
        return 'rgba(255, 180, 34, 0.08)';
      case 'ERROR':
        return 'rgba(255, 71, 70, 0.08)';
    }
  };
  const BorderColor = () => {
    switch (type) {
      case 'INFO':
        return 'rgba(64, 67, 80, 1)';
      case 'SUCCESS':
        return 'rgba(0, 211, 161, 1)';
      case 'WARNING':
        return 'rgba(255, 180, 34, 1)';
      case 'ERROR':
        return 'rgba(255, 71, 70, 1)';
    }
  };
  const TextColor = () => {
    if (type === 'INFO') {
      return '#fff';
    } else {
      return BorderColor();
    }
  };
  const Icon = () => {
    if (icon) {
      return icon;
    } else {
      switch (type) {
        case 'INFO':
          return <InfoIcon />;
        case 'SUCCESS':
          return <CheckmarkCircleIcon />;
        case 'WARNING':
          return <InfoIcon />;
        case 'ERROR':
          return <CrossCircleIcon />;
      }
    }
  };
  return (
    <Box
      display={'flex'}
      gap={'8px'}
      sx={{
        border: '1px solid ' + BorderColor(),
        borderRadius: '8px',
        padding: '8px',
        backgroundColor: BackgroundColor(),
        color: TextColor(),
      }}
    >
      <Box color={TextColor()}>{Icon()}</Box>
      <Typography fontSize={'14px'} fontWeight={400} sx={{ opacity: 0.8 }}>
        {message}
      </Typography>
    </Box>
  );
};

export default MessageBox;
