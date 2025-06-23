import { createTheme, ThemeOptions } from '@mui/material/styles';

const common: ThemeOptions = {
  typography: {
    fontFamily: 'var(--my-font), sans-serif',
  },
  components: {
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
        variant: 'contained',
      },
      styleOverrides: {
        root: {
          borderRadius: '16px',
          padding: '7px 14px',
          minHeight: '0px',
          color: 'white',
          fontSize: '16px',
          fontWeight: 500,
          textTransform: 'none',
        },
      },
    },
  },
};

export const lightTheme = createTheme({
  ...common,
  typography: {
    ...common.typography,
    allVariants: {
      color: '#53b6bf',
    },
  },
  palette: {
    mode: 'light',
    primary: {
      main: '#2879e8',
    },
    secondary: {
      main: '#155195',
    },
    action: {
      disabledBackground: '',
      disabledOpacity: 0.5,
    },
  },
});

export const darkTheme = createTheme({
  ...common,
  typography: {
    ...common.typography,
    allVariants: {
      color: '#53b6bf',
    },
  },
  palette: {
    mode: 'dark',
    background: {
      default: 'transparent',
    },
    primary: {
      main: '#53b6bf',
    },
    secondary: {
      main: '#155195',
    },
    action: {
      disabledBackground: '',
      disabledOpacity: 0.5,
    },
  },
});
