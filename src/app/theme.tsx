import { createTheme, ThemeOptions } from '@mui/material/styles';

export const MAIN_GRADIENT = 'linear-gradient(to right, #2879e8, #53b6bf)';
export const SECONDARY_GRADIENT = 'linear-gradient(to left, #2879e8, #53b6bf)';
export const TEXT_GRADIENT = 'linear-gradient(to bottom, #00b2fe, #5adebe)';

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
          borderRadius: '100px',
          padding: '7px 14px',
          minHeight: '0px',
          color: 'white',
          fontSize: '16px',
          fontWeight: 500,
          textTransform: 'none',
          overflow: 'hidden',
        },
      },
      variants: [
        {
          props: { variant: 'primary' },
          style: {
            background: 'linear-gradient(to right, #2879e8, #53b6bf)',
            '&::after': {
              content: '""',
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0)',
              transition: 'background-color 0.3s ease',
              zIndex: 1,
              pointerEvents: 'none',
            },
            '&:hover::after': {
              backgroundColor: 'rgba(0, 0, 0, 0.2)',
            },
          },
        },
        {
          props: { variant: 'secondary' },
          style: {
            background: 'linear-gradient(to left, #2879e8, #53b6bf)',
            '&::after': {
              content: '""',
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0)',
              transition: 'background-color 0.3s ease',
              zIndex: 1,
              pointerEvents: 'none',
            },
            '&:hover::after': {
              backgroundColor: 'rgba(0, 0, 0, 0.2)',
            },
          },
        },
      ],
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
