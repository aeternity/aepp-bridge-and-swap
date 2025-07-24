import React from 'react';
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
            <span style={{ color: '#00b2ff' }}>Got your two wallets sorted?</span>
            <br />
            Just hit connect!
          </>
        }
        buttonDisabled={!aeAccount}
        content={<ConnectWalletButton protocol={'AE'} />}
        footer={'Just two steps to go!'}
      />
    </>
  );
};

export default AeEthToAeStep1;
