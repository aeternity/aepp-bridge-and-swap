import { createTheme } from '@mui/material/styles';

const PAGE_BACKGROUND_LIGHT = '#fff';
const PAGE_BACKGROUND_DARK = '#232631';

const commonSettings = {
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
};

// Light theme
export const lightTheme = createTheme({
  ...commonSettings,
  palette: {
    mode: 'light',
    background: {
      default: PAGE_BACKGROUND_LIGHT,
    },
    common: {
      tabs: {
        active: '#1B1D26',
        inactive: PAGE_BACKGROUND_LIGHT,
      },
    },
  },
});

// Dark theme
export const darkTheme = createTheme({
  ...commonSettings,
  palette: {
    mode: 'dark',
    background: {
      default: PAGE_BACKGROUND_DARK,
    },
    common: {
      tabs: {
        active: '#1B1D26',
        inactive: PAGE_BACKGROUND_DARK,
      },
    },
  },
});
