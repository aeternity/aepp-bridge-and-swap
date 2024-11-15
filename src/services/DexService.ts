import routerACI from "dex-contracts-v2/build/AedexV2Router.aci.json";
import aex9ACI from "dex-contracts-v2/build/FungibleTokenFull.aci.json";

import { aeSdk } from "./WalletService";
import { payForTx } from "../app/actions/payForTx";
import { Tag } from "@aeternity/aepp-sdk";

const WAE_MAINNET = "ct_J3zBY8xxjsRr3QojETNw48Eb38fjvEuJKkQ6KzECvubvEcvCa";
const AE_ETH_MAINNET = "ct_ryTY1mxqjCjq1yBn9i6HDaCSdA6thXUFZTA84EMzbWd1SLKdh";
const ROUTER_MAINNET = "ct_azbNZ1XrPjXfqBqbAh1ffLNTQ1sbnuUDFvJrXjYz7JQA1saQ3";

/*
const contract = await aeSdk.initializeContract(
  { sourceCode: CONTRACT_SOURCE_CODE, address: CONTRACT_ADDRESS },
);
const calldata = contract._calldata.encode('PayingForTxExample', 'set_last_caller', []);
const contractCallTx = await aeSdk.buildTx({
  tag: Tag.ContractCallTx,
  callerId: newUserAccount.address,
  contractId: CONTRACT_ADDRESS,
  amount: 0,
  gasLimit: 1000000,
  gasPrice: 1500000000,
  callData: calldata,
});
const signedContractCallTx = await aeSdk.signTransaction(
  contractCallTx,
  { onAccount: newUserAccount, innerTx: true },
);
 */

class DexService {
  static async changeAllowance(amountWei: bigint): Promise<void> {
    const tokenContract = await aeSdk.initializeContract({
      aci: aex9ACI,
      address: AE_ETH_MAINNET,
    });

    const calldata = tokenContract._calldata.encode(
      "FungibleTokenFull",
      "change_allowance",
      [ROUTER_MAINNET.replace("ct_", "ak_"), (amountWei * 2n).toString()],
    );

    const contractCallTx = await aeSdk.buildTx({
      tag: Tag.ContractCallTx,
      callerId: aeSdk.address,
      contractId: AE_ETH_MAINNET,
      amount: 0,
      gasLimit: 1000000,
      gasPrice: 1500000000,
      callData: calldata,
    });

    const signedContractCallTx = await aeSdk.signTransaction(contractCallTx, {
      innerTx: true,
    });

    await payForTx(signedContractCallTx);

    // await tokenContract.change_allowance(
    //   ROUTER_MAINNET.replace("ct_", "ak_"),
    //   (amountWei * 2n).toString(),
    // ); // double the amount so we can be sure
  }

  static async swapAeEthToAE(
    amountWei: bigint,
    aeAddress: string,
  ): Promise<[bigint, bigint]> {
    const routerContract = await aeSdk.initializeContract({
      aci: routerACI,
      address: ROUTER_MAINNET,
    });

    const aHourFromNow = Date.now() + 60 * 60 * 1000;
    const calldata = routerContract._calldata.encode(
      "AedexV2Router",
      "swap_exact_tokens_for_ae",
      [
        amountWei, // how much eth to swap for ae // set to 1 for demo
        0, // min amount out TODO make this save
        // [ aeEth, wAE] // path
        [AE_ETH_MAINNET, WAE_MAINNET],
        aeAddress,
        aHourFromNow, // deadline is 1 hour
      ],
    );

    const contractCallTx = await aeSdk.buildTx({
      tag: Tag.ContractCallTx,
      callerId: aeSdk.address,
      contractId: ROUTER_MAINNET,
      amount: 0,
      gasLimit: 1000000,
      gasPrice: 1500000000,
      callData: calldata,
    });

    const signedContractCallTx = await aeSdk.signTransaction(contractCallTx, {
      innerTx: true,
    });

    const result = await payForTx(signedContractCallTx);

    console.log("swap result", result);

    return [0n, 0n];
  }
}

export default DexService;
