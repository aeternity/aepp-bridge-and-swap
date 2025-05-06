import routerACI from "dex-contracts-v2/build/AedexV2Router.aci.json";
import aex9ACI from "dex-contracts-v2/build/FungibleTokenFull.aci.json";

import WalletService from "./WalletService";
import { aeSdk } from "./WalletService";
import { payForTx } from "../app/actions/payForTx";
import { Contract, Tag } from "@aeternity/aepp-sdk";
import {
  Constants,
  AE_BALANCE_THRESHOLD
} from "../constants";

class DexService {
  static async changeAllowance(amountWei: bigint): Promise<void> {
    return WalletService.getAeBalance(aeSdk.address).then((balance) => {
      console.log(`Ae balance: ${balance}`);
      if (balance > AE_BALANCE_THRESHOLD) {
        this.changeAllowanceInternal(amountWei)
      } else {
        this.changeAllowanceInternalPayingFor(amountWei)
      }    
    });
  }
  
  // user pays fees
  static async changeAllowanceInternal(amountWei: bigint): Promise<void> {
    console.log('User pays for Dex transaction!');
    const tokenContract = await Contract.initialize({...aeSdk.getContext(), ...{
      aci: aex9ACI,
      address: Constants.ae_weth_address,
    }});

    let { decodedResult: allowance } = await tokenContract.allowance({from_account: aeSdk.address, for_account: Constants.ae_dex_router_address.replace("ct_", "ak_")}, { callStatic: true });

    if (allowance === undefined) {
      await tokenContract.create_allowance(Constants.ae_dex_router_address.replace("ct_", "ak_"), (amountWei * 2n).toString());
    } else {
      if (allowance < amountWei * 2n) {
        await tokenContract.change_allowance(Constants.ae_dex_router_address.replace("ct_", "ak_"), (amountWei * 2n - allowance).toString());
      }
    }
  }

  // fees are payed by internal wallet
  static async changeAllowanceInternalPayingFor(amountWei: bigint): Promise<void> {
    console.log('Internal wallet pays for Dex transaction!');
    const tokenContract = await aeSdk.initializeContract({
      aci: aex9ACI,
      address: Constants.ae_weth_address,
    });

    const tokenContractWallet = await Contract.initialize({...aeSdk.getContext(), ...{
      aci: aex9ACI,
      address: Constants.ae_weth_address,
    }});

    let { decodedResult: allowance } = await tokenContractWallet.allowance({from_account: aeSdk.address, for_account: Constants.ae_dex_router_address.replace("ct_", "ak_")}, { callStatic: true });

    if (allowance === undefined) {
      const calldata = tokenContract._calldata.encode(
        "FungibleTokenFull",
        "create_allowance",
        [
          Constants.ae_dex_router_address.replace("ct_", "ak_"),
          (amountWei * 2n).toString(),
        ],
      );

      const contractCallTx = await aeSdk.buildTx({
        tag: Tag.ContractCallTx,
        callerId: aeSdk.address,
        contractId: Constants.ae_weth_address,
        amount: 0,
        gasLimit: 1000000,
        gasPrice: 1500000000,
        callData: calldata,
      });

      const signedContractCallTx = await aeSdk.signTransaction(contractCallTx, {
        innerTx: true,
      });

      await payForTx(signedContractCallTx);
    } else {
      console.log("here 2");
      if (allowance < amountWei * 2n) {
        const calldata = tokenContract._calldata.encode(
          "FungibleTokenFull",
          "change_allowance",
          [
            Constants.ae_dex_router_address.replace("ct_", "ak_"),
            (amountWei * 2n - allowance).toString(),
          ],
        );

        const contractCallTx = await aeSdk.buildTx({
          tag: Tag.ContractCallTx,
          callerId: aeSdk.address,
          contractId: Constants.ae_weth_address,
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
    }
  }

  static async getAeWethBalance(): Promise<bigint> {
    const tokenInstance = await aeSdk.initializeContract({
      aci: aex9ACI,
      address: AE_WETH_ADDRESS,
    });
    try {
      // { onAccount: undefined } option is added, because current sdk version will fail
      // to get balance, in case account was never used before
      return BigInt((await tokenInstance.balance(aeSdk.address, { onAccount: undefined })).decodedResult ?? 0);
    } catch(e: any) {
      return BigInt(0);
    }
  }

  static async swapAeEthToAE(
    amountWei: bigint,
    aeAddress: string,
  ):  Promise<[bigint, bigint]> {
    return WalletService.getAeBalance(aeSdk.address).then((balance) => {
      console.log(`Ae balance: ${balance}`);
      if (balance > AE_BALANCE_THRESHOLD) {
        return this.swapAeEthToAEInternal(amountWei, aeAddress);
      } else {
        return this.swapAeEthToAEInternalPayFor(amountWei, aeAddress);
      }    
    });
  }
  
  // user pays fees !
  static async swapAeEthToAEInternal(
    amountWei: bigint,
    aeAddress: string,
  ): Promise<[bigint, bigint]> {
    console.log('User pays for Dex transaction!');    
    const routerContract = await Contract.initialize({...aeSdk.getContext(), ...{
      aci: routerACI,
      address: Constants.ae_dex_router_address,
    }});
    const aHourFromNow = Date.now() + 60 * 60 * 1000;
    const { decodedResult: result } = await routerContract.swap_exact_tokens_for_ae(
      amountWei,
      (amountWei / 100n) * 95n, // min amount out TODO: check this min amaount out
      [Constants.ae_weth_address, Constants.ae_wae_address],
      aeAddress,
      aHourFromNow
    );
    return result;
  }  
  
  // fees are paid from internal wallet !
  static async swapAeEthToAEInternalPayFor(
    amountWei: bigint,
    aeAddress: string,
  ): Promise<[bigint, bigint]> {
    console.log('Dex transaction is paid from internal wallet!');
    const routerContract = await aeSdk.initializeContract({
      aci: routerACI,
      address: Constants.ae_dex_router_address,
    });

    const aHourFromNow = Date.now() + 60 * 60 * 1000;
    const calldata = routerContract._calldata.encode(
      "AedexV2Router",
      "swap_exact_tokens_for_ae",
      [
        amountWei, // how much eth to swap for ae
        (amountWei / 100n) * 95n, // min amount out
        // [ aeEth, wAE] // path
        [Constants.ae_weth_address, Constants.ae_wae_address],
        aeAddress,
        aHourFromNow, // deadline is 1 hour
      ],
    );

    const contractCallTx = await aeSdk.buildTx({
      tag: Tag.ContractCallTx,
      callerId: aeSdk.address,
      contractId: Constants.ae_dex_router_address,
      amount: 0,
      gasLimit: 1000000,
      gasPrice: 1500000000,
      callData: calldata,
    });

    const signedContractCallTx = await aeSdk.signTransaction(contractCallTx, {
      innerTx: true,
    });

    const result = await payForTx(signedContractCallTx);

    console.info(`tx hash: ${result.hash}`)

    const swapResult = await fetch(
      `${Constants.ae_middleware_url}/transactions/${result.hash}`,
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
