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
        subtitle={
          <>
            Got your two wallets sorted?
            <br />
            Just hit connect!
          </>
        }
        buttonLabel="Next"
        buttonLoading={false}
        buttonDisabled={!aeAccount || !ethAccount}
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
