import routerACI from "dex-contracts-v2/build/AedexV2Router.aci.json";
import aex9ACI from "dex-contracts-v2/build/FungibleTokenFull.aci.json";

import { aeSdk } from "./WalletService";
import { payForTx } from "../app/actions/payForTx";
import { Tag } from "@aeternity/aepp-sdk";
import {
  AE_DEX_ROUTER_ADDRESS,
  AE_MIDDLEWARE_URL,
  AE_WAE_ADDRESS,
  AE_WETH_ADDRESS,
} from "../constants";

class DexService {
  static async changeAllowance(amountWei: bigint): Promise<void> {
    const tokenContract = await aeSdk.initializeContract({
      aci: aex9ACI,
      address: AE_WETH_ADDRESS,
    });

    const calldata = tokenContract._calldata.encode(
      "FungibleTokenFull",
      "change_allowance",
      [
        AE_DEX_ROUTER_ADDRESS.replace("ct_", "ak_"),
        (amountWei * 2n).toString(),
      ],
    );

    const contractCallTx = await aeSdk.buildTx({
      tag: Tag.ContractCallTx,
      callerId: aeSdk.address,
      contractId: AE_WETH_ADDRESS,
      amount: 0,
      gasLimit: 1000000,
      gasPrice: 1500000000,
      callData: calldata,
    });

    const signedContractCallTx = await aeSdk.signTransaction(contractCallTx, {
      innerTx: true,
    });

    await payForTx(signedContractCallTx);
  }

  static async swapAeEthToAE(
    amountWei: bigint,
    aeAddress: string,
  ): Promise<[bigint, bigint]> {
    const routerContract = await aeSdk.initializeContract({
      aci: routerACI,
      address: AE_DEX_ROUTER_ADDRESS,
    });

    const aHourFromNow = Date.now() + 60 * 60 * 1000;
    const calldata = routerContract._calldata.encode(
      "AedexV2Router",
      "swap_exact_tokens_for_ae",
      [
        amountWei, // how much eth to swap for ae
        (amountWei / 100n) * 95n, // min amount out
        // [ aeEth, wAE] // path
        [AE_WETH_ADDRESS, AE_WAE_ADDRESS],
        aeAddress,
        aHourFromNow, // deadline is 1 hour
      ],
    );

    const contractCallTx = await aeSdk.buildTx({
      tag: Tag.ContractCallTx,
      callerId: aeSdk.address,
      contractId: AE_DEX_ROUTER_ADDRESS,
      amount: 0,
      gasLimit: 1000000,
      gasPrice: 1500000000,
      callData: calldata,
    });

    const signedContractCallTx = await aeSdk.signTransaction(contractCallTx, {
      innerTx: true,
    });

    const result = await payForTx(signedContractCallTx);

    const swapResult = await fetch(
      `${AE_MIDDLEWARE_URL}/transactions/${result.hash}`,
    ).then((res) => res.json());

    console.log("swap result", swapResult);

    if (swapResult?.tx?.tx?.tx?.result === "ok") {
      return [
        swapResult.tx.tx.tx.return.value[0].value,
        swapResult.tx.tx.tx.return.value[1].value,
      ];
    }
    return [0n, 0n];
  }
}

export default DexService;
