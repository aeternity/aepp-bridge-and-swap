import styled from '@emotion/styled';
import {
  Box,
  Button,
  Container,
  Theme,
  Typography,
  useTheme,
} from '@mui/material';
import { Status, useExchangeStore } from '../stores/exchangeStore';
import ConnectedWalletInfo from './ConnectedWalletInfo';
import StepArrowButton from './Buttons/StepArrowButton';

type StyledProps = {
  theme?: Theme;
};

const StyledContainer = styled(Container)<StyledProps>(({ theme }) => ({
  minHeight: '436px',
  margin: '120px 0px 20px 0px',
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '0px 20px',
  [theme.breakpoints.down('sm')]: {
    margin: '20px 0px',
    padding: '0px 5px',
  },
}));

const ContentBox = styled(Box)<StyledProps>(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '16px',
  margin: '30px 0px',
  minWidth: '320px',
  [theme.breakpoints.down('md')]: {
    order: 1,
    flex: '100%',
    margin: '30px 0px 0px 0px',
  },
}));

const BackBox = styled(Box)<StyledProps>(({ theme }) => ({
  marginTop: '50px',
  [theme.breakpoints.down('md')]: {
    marginTop: '0px',
    order: 2,
  },
}));

const NextBox = styled(Box)<StyledProps>(({ theme }) => ({
  marginTop: '50px',
  [theme.breakpoints.down('md')]: {
    marginTop: '0px',
    order: 3,
  },
}));

const WizardFlowContainer = ({
  title,
  footer,
  error,
  subtitle,
  content,
  buttonDisabled,
  retry,
  ...props
}: {
  title: string;
  footer?: React.ReactNode;
  subtitle?: React.ReactNode;
  error?: string;
  content: React.ReactNode;
  buttonDisabled: boolean;
  retry?: () => {};
}) => {
  const theme = useTheme();

  const { flow, nextStep, prevStep, currentStep, reset, steps, status } =
    useExchangeStore();

  function resetState() {
    const query = {
      aeAddress: new URLSearchParams(window.location.search).get('ae-address'),
    };
    window.history.pushState(
      {},
      document.title,
      `/${query.aeAddress ? `?ae-address=${query.aeAddress}` : ''}`,
    );
    reset();
  }

  return (
    <StyledContainer maxWidth={false} disableGutters {...props}>
      <Box
        display={'flex'}
        justifyContent={'space-between'}
        width={'100%'}
        maxWidth={'700px'}
        marginBottom={'15px'}
      >
        <Box flex={1}>
          {flow != 'aeEthToAe' && <ConnectedWalletInfo protocol={'ETH'} />}
        </Box>
        <Box flex={1} display={'flex'} justifyContent={'center'}>
          <Box
            position={'relative'}
            sx={{
              width: '60px',
              height: '60px',
              borderRadius: '100%',
              backgroundColor: theme.palette.primary.main,
            }}
          >
            <Typography
              sx={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                color: 'white',
                fontSize: '40px',
              }}
            >
              {currentStep + 1}
            </Typography>
          </Box>
        </Box>
        <Box flex={1}>
          <ConnectedWalletInfo protocol={'AE'} />
        </Box>
      </Box>
      <Box display="flex" flexDirection="column" height={'100%'}>
        <Typography fontSize="40px" mb={'10px'}>
          {title}
        </Typography>
        <Typography fontSize="20px" minHeight={'60px'}>
          {subtitle}
        </Typography>
      </Box>
      <Box display="flex" flexDirection="column" height={'100%'}>
        <Box
          display={'flex'}
          flexDirection={'row'}
          alignItems={'start'}
          justifyContent={'center'}
          columnGap={'40px'}
          flexWrap={'wrap'}
        >
          <BackBox>
            {(currentStep !== steps.length - 1 ||
              status !== Status.COMPLETED) &&
              currentStep < 2 && (
                <StepArrowButton
                  text={'Back'}
                  rotation={'-180deg'}
                  onClick={currentStep == 0 ? reset : prevStep}
                />
              )}
          </BackBox>
          <ContentBox>{content}</ContentBox>
          <NextBox>
            {(currentStep !== steps.length - 1 ||
              status !== Status.COMPLETED) && (
              <StepArrowButton
                text={'Next'}
                onClick={nextStep}
                disabled={buttonDisabled}
              />
            )}
          </NextBox>
        </Box>
        <Typography fontSize="16px" color={'error'}>
          {error}
        </Typography>
        {error && retry ? (
          <Box>
            <Button onClick={retry}>Retry</Button>
          </Box>
        ) : (
          <Typography fontSize="16px">{footer}</Typography>
        )}
      </Box>
      <Button
        color={'primary'}
        sx={{ position: 'fixed', bottom: '20px', right: '20px' }}
        onClick={resetState}
      >
        {currentStep === steps.length - 1 && status === Status.COMPLETED
          ? 'Do another:)'
          : 'Cancel'}
      </Button>
    </StyledContainer>
  );
};

export default WizardFlowContainer;
