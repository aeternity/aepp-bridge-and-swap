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
        subtitle={
          <>
            Got your two wallets sorted?
            <br />
            Just hit connect!
          </>
        }
        buttonLabel="Next"
        buttonLoading={false}
        buttonDisabled={!aeAccount}
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
