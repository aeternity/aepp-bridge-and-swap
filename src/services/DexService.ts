import routerACI from "dex-contracts-v2/build/AedexV2Router.aci.json";
import aex9ACI from "dex-contracts-v2/build/FungibleTokenFull.aci.json";

import WalletService from "./WalletService";
import { aeSdk } from "./WalletService";
import { payForTx } from "../app/actions/payForTx";
import { Contract, Tag, getExecutionCost } from "@aeternity/aepp-sdk";
import { Constants } from "../constants";

class DexService {
  static async changeAllowance(amountWei: bigint): Promise<void> {
    return WalletService
      .getAeBalance(aeSdk.address)
      .then((balance: bigint) => 
        this.changeAllowanceInternal(amountWei, balance)
      );
  }

  static async changeAllowanceInternal(amountWei: bigint, userBalance: bigint): Promise<void> {
    console.log(`Change allowance, user balance:${userBalance}!`);
    const tokenContract = await aeSdk.initializeContract({
      aci: aex9ACI,
      address: Constants.ae_weth_address,
    });

    const tokenContractWallet = await Contract.initialize({
      ...aeSdk.getContext(),
      aci: aex9ACI,
      address: Constants.ae_weth_address,
    });

    let newAccount = false;

    let { decodedResult: allowance } = await tokenContractWallet
      .allowance(
        { from_account: aeSdk.address,
          for_account: Constants.ae_dex_router_address.replace("ct_", "ak_")},
        { callStatic: true }
      )
      .catch((error) => {
        console.info(error);
        if (error?.statusCode === 404) {
          newAccount = true;
        }

        return {
          decodedResult: undefined
        };
      }); // catches account not found, assumes no allowance exist for an empty address


    if (allowance === undefined) {
      console.info('Creating allowance.');
      const calldata = tokenContract._calldata.encode(
        "FungibleTokenFull",
        "create_allowance",
        [
          Constants.ae_dex_router_address.replace("ct_", "ak_"),
          amountWei + (amountWei * Constants.allowance_slippage) / 100n,
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
        ...newAccount ? { nonce: 1} : {},
      });

      let cost = getExecutionCost(contractCallTx)
      let isUserHaveEnoughCoins = userBalance > cost + Constants.ae_balance_threshold;          
      const signedContractCallTx = await aeSdk.signTransaction(contractCallTx, 
        isUserHaveEnoughCoins ? {} : { innerTx: true },
      );

      isUserHaveEnoughCoins ?
        await aeSdk.api.postTransaction({ tx: signedContractCallTx}) :
        await payForTx(signedContractCallTx);
    } else {
      console.info("Changing allowance.");
      let amount_with_allowance_slippage = amountWei + (amountWei * Constants.allowance_slippage) / 100n;
      if (allowance < amount_with_allowance_slippage) {
        const calldata = tokenContract._calldata.encode(
          "FungibleTokenFull",
          "change_allowance",
          [
            Constants.ae_dex_router_address.replace("ct_", "ak_"),
            (amount_with_allowance_slippage - allowance).toString(),
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

        let cost = getExecutionCost(contractCallTx)
        let isUserHaveEnoughCoins = userBalance > cost + Constants.ae_balance_threshold;

        const signedContractCallTx = await aeSdk.signTransaction(contractCallTx, 
          isUserHaveEnoughCoins ? {} : { innerTx: true },
        );

        isUserHaveEnoughCoins ?
          await aeSdk.api.postTransaction({ tx: signedContractCallTx}) :
          await payForTx(signedContractCallTx);
      }
    }
  }

  static async getAeWethBalance(): Promise<bigint> {
    const tokenInstance = await aeSdk.initializeContract({
      aci: aex9ACI,
      address: Constants.ae_weth_address,
    });
    try {
      // { onAccount: undefined } option is added, because current sdk version will fail
      // to get balance, in case account was never used before
      return BigInt((await tokenInstance.balance(aeSdk.address, { onAccount: undefined })).decodedResult ?? 0);
    } catch(e: any) {
      return BigInt(0);
    }
  }

  static async swapAetoAeEth(
    amountinAettos: bigint,
    amountOut: bigint,
    aeAddress: string,
  ) {
    const routerContract = await aeSdk.initializeContract({
      aci: routerACI,
      address: Constants.ae_dex_router_address,
    });

    const aHourFromNow = Date.now() + 60 * 60 * 1000;

    return routerContract.swap_exact_ae_for_tokens(
        (amountOut / 100n) * 95n,
        [Constants.ae_wae_address, Constants.ae_weth_address],
        aeAddress,
        aHourFromNow,
        undefined,
        { amount: amountinAettos.toString() },
    )
  }

  static async swapAeEthToAE(
    amountWei: bigint,
    aeAddress: string,
  ):  Promise<[bigint, bigint]> {
    return WalletService
      .getAeBalance(aeSdk.address)
      .then((balance: bigint) => 
        this.swapAeEthToAEInternal(amountWei, aeAddress, balance)
      )
  }

  static async swapAeEthToAEInternal(
    amountWei: bigint,
    aeAddress: string,
    userBalance: bigint
  ): Promise<[bigint, bigint]> {
    console.log('Swap aeEth to AE');
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
    let cost = getExecutionCost(contractCallTx);
    let isUserHaveEnoughCoins = userBalance > cost + Constants.ae_balance_threshold;    
    
    const signedContractCallTx = await aeSdk.signTransaction(contractCallTx, 
      isUserHaveEnoughCoins ? {} : { innerTx: true },      
    );

    const result = isUserHaveEnoughCoins ?
      await aeSdk.api.postTransaction({ tx: signedContractCallTx}).then((result) => ({ hash: result.txHash })) :
      await payForTx(signedContractCallTx)

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
