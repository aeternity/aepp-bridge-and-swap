import React, { useEffect, useState } from 'react';
import { Box, InputBase, TextField, Typography } from '@mui/material';
import styled from '@emotion/styled';
import TokenPriceService from '../../services/TokenPriceService';
import WebsocketService from '../../services/WebsocketService';
import { formatCurrency } from '../../helpers';

type Protocol = 'ETH' | 'AE';

interface Props {
  protocol: Protocol;
  onChange: (amount: Number | null) => void;
  value: string | number | null;
}

const TextInput = styled(InputBase)({
  '& .MuiInputBase-input': {
    textAlign: 'right',
    fontSize: '24px',
    padding: 0,
  },
});

const AmountInput = ({ protocol, onChange, value }: Props) => {
  const [prices, setPrices] = useState<{ AE: number; ETH: number }>();

  useEffect(() => {
    TokenPriceService.getPrices().then(setPrices);
    WebsocketService.init();
  }, []);

  const onInputChange = (e: any) => {
    onChange(e.target.value);
  };

  return (
    <Box
      display="flex"
      alignItems={'center'}
      justifyContent={'space-between'}
      gap={'12px'}
      sx={{
        backgroundColor: 'rgba(35, 38, 49, 1)',
        borderRadius: '16px',
        padding: '12px 16px',
        minHeight: '44px',
        fontSize: '16px',
        fontWeight: 500,
      }}
    >
      <Typography fontSize={'18px'}>{protocol}</Typography>
      <Box display={'flex'} flexDirection={'column'} alignItems={'end'}>
        <TextInput
          fullWidth
          placeholder="0.00"
          onChange={onInputChange}
          value={value}
        />
        <Typography fontSize="12px">
          {prices &&
            value &&
            formatCurrency(prices?.[protocol] * parseFloat(String(value)))}
        </Typography>
      </Box>
    </Box>
  );
};

export default AmountInput;
