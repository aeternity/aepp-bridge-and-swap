import { ethers } from 'ethers';
import {
  BRIDGE_ABI,
  BRIDGE_ETH_ACTION_TYPE,
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

    return await bridgeContract.bridge_out(
      ETH_MOCK_ADDRESS,
      aeAddress,
      amountInWei.toString(),
      BRIDGE_ETH_ACTION_TYPE,
      {
        value: amountInWei,
      },
    );
  }
}

export default BridgeService;
