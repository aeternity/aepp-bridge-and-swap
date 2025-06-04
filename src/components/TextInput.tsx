import styled from '@emotion/styled';
import { TextField } from '@mui/material';

const TextInput = styled(TextField)({
  '& .MuiInputAdornment-root p': {
    color: 'white !important',
  },
  '& label': {
    color: 'white',
  },
  '& label.Mui-focused': {
    color: '#A0AAB4',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: '#B2BAC2',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#E0E3E7',
    },
    '&:hover fieldset': {
      borderColor: '#B2BAC2',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#6F7E8C',
    },
  },
});

export default TextInput;
