import { ethers } from "ethers";

import { BRIDGE_ABI, Constants } from "../constants";

class BridgeService {
  static async bridgeEthToAe(amountInWei: bigint, aeAddress: string, signer: ethers.JsonRpcSigner): Promise<void> {
    const bridgeContract = new ethers.Contract(
      Constants.eth_bridge_address,
      BRIDGE_ABI,
      signer,
    );

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
}

export default BridgeService;
