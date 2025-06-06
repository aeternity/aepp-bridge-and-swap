import styled from '@emotion/styled';
import { Box, Button, Container, Typography } from '@mui/material';
import AnimatedStepper from './AnimatedStepper';
import { useExchangeStore } from '../stores/exchangeStore';

const StyledContainer = styled(Container)({
  display: 'flex',
  maxWidth: '618px',
  minHeight: '436px',
  borderRadius: '24px',
  overflow: 'hidden',
  marginTop: '32px',
});

const WizardFlowContainer = ({
  title,
  header,
  content,
  buttonLabel,
  buttonLoading,
  buttonDisabled,
   error,
  ...props
}: {
  title: string;
  header: React.ReactNode;
  content: React.ReactNode;
  buttonLabel: string;
  buttonLoading: boolean;
  buttonDisabled: boolean;
  error?: string;
}) => {
  const { nextStep } = useExchangeStore();

  return (
    <StyledContainer maxWidth={false} disableGutters {...props}>
      <Box
        flex={'0 0 220px'}
        padding={'64px 24px'}
        sx={{ backgroundColor: 'rgba(21, 23, 30, 0.6)' }}
      >
        <AnimatedStepper />
      </Box>
      <Box padding={'24px'} sx={{ backgroundColor: 'rgba(21, 23, 30, 1)' }}>
        <Box display="flex" flexDirection="column" height={'100%'}>
          <Typography fontSize="16px" fontWeight={600} sx={{ opacity: 0.8 }}>
            {title}
          </Typography>
          {header}
          <Box
            flex={1}
            display={'flex'}
            flexDirection={'column'}
            justifyContent={'center'}
            gap={'16px'}
          >
            {content}
          </Box>
          {error && (<Typography fontSize="16px" fontWeight={600} sx={{ opacity: 0.8, color: 'red' }}>
            {error}
          </Typography>
          )}
          <Button
            disabled={buttonDisabled}
            loading={buttonLoading}
            onClick={nextStep}
          >
            {buttonLabel}
          </Button>
        </Box>
      </Box>
    </StyledContainer>
  );
};

export default WizardFlowContainer;
