import React from 'react';
import { Box } from '@mui/material';
import MessageBox from '../../MessageBox';
import WizardFlowContainer from '../../WizardFlowContainer';
import ConnectWalletButton from '../../Buttons/ConnectWalletButton';
import { useWalletStore } from '../../../stores/walletStore';

const AeEthToAeStep1 = () => {
  const { aeAccount } = useWalletStore();

  return (
    <>
      <WizardFlowContainer
        title={'Connect your wallets'}
        buttonLabel="Next"
        buttonLoading={false}
        buttonDisabled={!aeAccount}
        header={
          <Box mt={'16px'}>
            <MessageBox
              message={
                <>
                  Please connect your aeternity wallet in order to exchange{' '}
                  <span style={{ fontWeight: 500 }}>æETH</span> to{' '}
                  <span style={{ fontWeight: 500 }}>AE</span> coins.
                </>
              }
            />
          </Box>
        }
        content={
          <>
            <ConnectWalletButton protocol={'AE'} />
          </>
        }
      />
    </>
  );
};

export default AeEthToAeStep1;
