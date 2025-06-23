import React from 'react';
import WizardFlowContainer from '../../WizardFlowContainer';
import ConnectWalletButton from '../../Buttons/ConnectWalletButton';
import { useWalletStore } from '../../../stores/walletStore';
import { Box } from '@mui/material';

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
        buttonDisabled={!aeAccount}
        content={<ConnectWalletButton protocol={'AE'} />}
      />
    </>
  );
};

export default AeEthToAeStep1;
