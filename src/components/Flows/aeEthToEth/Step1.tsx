import React from 'react';
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
            <span style={{ color: '#00b2ff' }}>Got your two wallets sorted?</span>
            <br />
            Just hit connect!
          </>
        }
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
