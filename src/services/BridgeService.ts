import { ethers } from "ethers";
import aex9ACI from "dex-contracts-v2/build/FungibleTokenFull.aci.json";

import { aeSdk } from "./WalletService";

import {
  AE_BRIDGE_ADDRESS,
  AE_WETH_ADDRESS,
  BRIDGE_ABI,
  BRIDGE_ACI,
  BRIDGE_ETH_ACTION_TYPE,
  ETH_MAINNET_WAE_ADDRESS,
  ETH_BRIDGE_ADDRESS,
  ETH_MOCK_ADDRESS,
} from "../constants";

class BridgeService {
  static async bridgeEthToAe(amount: number, aeAddress: string): Promise<void> {
    const provider = new ethers.BrowserProvider(window.ethereum!);
    const signer = await provider.getSigner();
    const bridgeContract = new ethers.Contract(
      ETH_BRIDGE_ADDRESS,
      BRIDGE_ABI,
      signer,
    );

    const amountInWei = BigInt(amount * 1e18);

    return bridgeContract.bridge_out(
      ETH_MOCK_ADDRESS,
      aeAddress,
      amountInWei.toString(),
      BRIDGE_ETH_ACTION_TYPE,
      {
        value: amountInWei,
      },
    );
  }

  static async bridgeAeToEth(amount: number, aeternityAddress: string, ethereumAddress: string) {
    const amountInWei = BigInt(amount * 1e18);

      const asset_contract = await aeSdk.initializeContract({
        aci: aex9ACI,
        address: AE_WETH_ADDRESS as `ct_${string}`,
        omitUnknown: true,
      });

      const { decodedResult: allowance } = await asset_contract.allowance({
        from_account: aeternityAddress,
        for_account: AE_BRIDGE_ADDRESS.replace('ct_', 'ak_'),
      });

      if (allowance === undefined) {
          await asset_contract.create_allowance(
            AE_BRIDGE_ADDRESS.replace('ct_', 'ak_'),
            amountInWei.toString(),
          );
      } else if (amountInWei > allowance) {
          await asset_contract.change_allowance(
            AE_BRIDGE_ADDRESS.replace('ct_', 'ak_'),
            amountInWei.toString(),
          );
      }

      const bridge_contract = await aeSdk.initializeContract({
        aci: BRIDGE_ACI,
        address: AE_BRIDGE_ADDRESS,
        omitUnknown: true,
      });
      return bridge_contract.bridge_out(
        [ETH_MAINNET_WAE_ADDRESS, ethereumAddress, amountInWei.toString(), BRIDGE_ETH_ACTION_TYPE],
        { waitMined: true},
      );
  }
}

export default BridgeService;
