import React, { useEffect, useState } from 'react';
import { Box, InputBase, Typography, useTheme } from '@mui/material';
import styled from '@emotion/styled';
import TokenPriceService from '../../services/TokenPriceService';
import WebsocketService from '../../services/WebsocketService';
import { formatCurrency } from '../../helpers';

type Protocol = 'ETH' | 'AE';

interface Props {
  protocol: Protocol;
  onChange: (amount: string | null) => void;
  value: string | number | null;
  label?: string;
  backgroundColor?: string;
}

const TextInput = styled(InputBase)({
  '& .MuiInputBase-input': {
    textAlign: 'right',
    fontSize: '24px',
    padding: 0,
    color: 'white',
  },
  'input::-webkit-outer-spin-button, input::-webkit-inner-spin-button': {
    WebkitAppearance: 'none',
    margin: 0,
  },
  'input[type=number]': {
    MozAppearance: 'textfield',
  },
});

const AmountInput = ({
  protocol,
  onChange,
  value,
  label,
  backgroundColor,
}: Props) => {
  const theme = useTheme();

  const [prices, setPrices] = useState<{ AE: number; ETH: number }>();

  useEffect(() => {
    TokenPriceService.getPrices().then(setPrices);
    WebsocketService.init();
  }, []);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value) {
      onChange(null);
    } else {
      // we are allowing to paste only positive values
      onChange(Number(e.target.value) < 0 ? null : e.target.value);
    }
  };

  const formattedValue = (val: string | number | null) => {
    if (val === null || val === '') return '';

    const str = String(val);

    // Allow the user to type '0.', '0.0', etc.
    if (/^0\.\d*$/.test(str) || str === '0') {
      return str;
    }

    // Otherwise, remove leading zeros (but preserve decimal places)
    return str.replace(/^0+(?=\d)/, '');
  };

  return (
    <Box
      display="flex"
      alignItems={'center'}
      justifyContent={'space-between'}
      gap={'12px'}
      sx={{
        backgroundColor: backgroundColor ?? theme.palette.primary.main,
        borderRadius: '16px',
        padding: '12px 16px',
        minHeight: '44px',
        fontSize: '16px',
        fontWeight: 500,
        maxWidth: '300px',
      }}
    >
      <Typography fontSize={'18px'} color="white">
        {label || protocol}
      </Typography>
      <Box display={'flex'} flexDirection={'column'} alignItems={'end'}>
        <TextInput
          inputProps={{ min: 0 }}
          fullWidth
          placeholder="0.00"
          onChange={onInputChange}
          type="number"
          value={formattedValue(value)}
        />
        <Typography fontSize="12px" color="white">
          {prices &&
            value &&
            formatCurrency(prices?.[protocol] * parseFloat(String(value)))}
        </Typography>
      </Box>
    </Box>
  );
};

export default AmountInput;
