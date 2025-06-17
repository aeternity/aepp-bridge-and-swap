import WizardFlowContainer from '../../WizardFlowContainer';
import ConnectWalletButton from '../../Buttons/ConnectWalletButton';
import { useWalletStore } from '../../../stores/walletStore';

const EthToAeStep1 = () => {
  const { aeAccount, ethAccount } = useWalletStore();

  return (
    <>
      <WizardFlowContainer
        title={'Connect Wallets'}
        subtitle={
          <>
            Got your two wallets sorted?
            <br />
            Just hit connect!
          </>
        }
        buttonDisabled={!aeAccount || !ethAccount}
        content={
          <>
            <ConnectWalletButton protocol={'AE'} />
            <ConnectWalletButton protocol={'ETH'} />
          </>
        }
        footer={'Just three steps to go!'}
      />
    </>
  );
};

export default EthToAeStep1;
