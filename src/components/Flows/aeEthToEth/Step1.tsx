import React from 'react';
import { Box } from '@mui/material';
import MessageBox from '../../MessageBox';
import WizardFlowContainer from '../../WizardFlowContainer';
import ConnectWalletButton from '../../Buttons/ConnectWalletButton';
import { useWalletStore } from '../../../stores/walletStore';

const AeEthToEthStep1 = () => {
  const { aeAccount, ethAccount } = useWalletStore();

  return (
    <>
      <WizardFlowContainer
        title={'Connect your wallets'}
        buttonLabel="Next"
        buttonLoading={false}
        buttonDisabled={!aeAccount || !ethAccount}
        header={
          <Box mt={'16px'}>
            <MessageBox
              message={
                <>
                  Please connect both your Ethereum and aeternity wallets in
                  order to exchange{' '}
                  <span style={{ fontWeight: 500 }}>æETH</span> to{' '}
                  <span style={{ fontWeight: 500 }}>ETH</span> coins.
                </>
              }
            />
          </Box>
        }
        content={
          <>
            <ConnectWalletButton protocol={'ETH'} />
            <ConnectWalletButton protocol={'AE'} />
          </>
        }
      />
    </>
  );
};

export default AeEthToEthStep1;
