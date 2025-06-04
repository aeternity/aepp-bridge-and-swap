import { createTheme } from '@mui/material/styles';

const PAGE_BACKGROUND_LIGHT = '#fff';
const PAGE_BACKGROUND_DARK = '#232631';

// Light theme
export const lightTheme = createTheme({
  typography: {
    fontFamily: 'var(--font-ibm-plex-sans), sans-serif',
  },
  components: {
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(35, 38, 49, 1)',
          borderRadius: '16px',
          padding: '4px',
          minHeight: '44px',
          color: 'white',
          fontSize: '16px',
          fontWeight: 500,
          textTransform: 'none',
        },
      },
    },
  },
  palette: {
    mode: 'light',
    background: {
      default: PAGE_BACKGROUND_LIGHT,
    },
  },
});

// Dark theme
export const darkTheme = createTheme({
  typography: {
    fontFamily: 'var(--font-ibm-plex-sans), sans-serif',
  },
  components: {
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(35, 38, 49, 1)',
          borderRadius: '16px',
          padding: '4px',
          minHeight: '44px',
          color: 'white',
          fontSize: '16px',
          fontWeight: 500,
          textTransform: 'none',
        },
      },
    },
  },
  palette: {
    mode: 'dark',
    background: {
      default: PAGE_BACKGROUND_DARK,
    },
  },
});
