import { ethers } from "ethers";
import aex9ACI from "dex-contracts-v2/build/FungibleTokenFull.aci.json";

import { BRIDGE_ABI, BRIDGE_ACI, Constants } from "../constants";
import { aeSdk } from "./WalletService";

class BridgeService {
  static async bridgeEthToAe(amount: number, aeAddress: string): Promise<void> {
    const provider = new ethers.BrowserProvider(window.ethereum!);
    const signer = await provider.getSigner();
    const bridgeContract = new ethers.Contract(
      Constants.eth_bridge_address,
      BRIDGE_ABI,
      signer,
    );

    const amountInWei = BigInt(amount * 1e18);

    return bridgeContract.bridge_out(
      Constants.eth_mock_address,
      aeAddress,
      amountInWei.toString(),
      Constants.bridge_eth_action_type,
      {
        value: amountInWei,
      },
    );
  }

  static async bridgeAeToEth(amount: number, aeternityAddress: string, ethereumAddress: string) {
    const amountInWei = BigInt(amount * 1e18);

      const asset_contract = await aeSdk.initializeContract({
        aci: aex9ACI,
        address: Constants.ae_weth_address,
        omitUnknown: true,
      });

      const { decodedResult: allowance } = await asset_contract.allowance({
        from_account: aeternityAddress,
        for_account: Constants.ae_bridge_address.replace('ct_', 'ak_'),
      });

      if (allowance === undefined) {
          await asset_contract.create_allowance(
            Constants.ae_bridge_address.replace('ct_', 'ak_'),
            amountInWei.toString(),
          );
      } else if (amountInWei > allowance) {
          await asset_contract.change_allowance(
            Constants.ae_bridge_address.replace('ct_', 'ak_'),
            amountInWei.toString(),
          );
      }

      const bridge_contract = await aeSdk.initializeContract({
        aci: BRIDGE_ACI,
        address: Constants.ae_bridge_address,
        omitUnknown: true,
      });
      return bridge_contract.bridge_out(
        [Constants.eth_mock_address, ethereumAddress, amountInWei.toString(), Constants.bridge_eth_action_type],
        { waitMined: true},
      );
  }
}

export default BridgeService;
