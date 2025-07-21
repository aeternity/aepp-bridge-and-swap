import routerACI from 'dex-contracts-v2/build/AedexV2Router.aci.json';
import aex9ACI from 'dex-contracts-v2/build/FungibleTokenFull.aci.json';

import WalletService from './WalletService';
import { aeSdk } from './WalletService';
import { payForTx } from '../app/actions/payForTx';
import {
  Contract,
  Encoded,
  getExecutionCost,
  getExecutionCostBySignedTx,
  Tag,
  unpackTx,
} from '@aeternity/aepp-sdk';
import { Constants } from '../constants';
import { isSafariBrowser, sendTxDeepLinkUrl } from '../helpers';
import { FlowType } from '../stores/exchangeStore';

export async function postOrPayForTransaction(signedTransaction: `tx_${string}`, isPost: boolean) {
  return isPost
    ? aeSdk.api
        .postTransaction({ tx: signedTransaction })
        .then((result) => ({ hash: result.txHash }))
    : payForTx(signedTransaction);
}

class DexService {
  address: `ak_${string}`;
  flow: FlowType;
  step: number;

  constructor(address: `ak_${string}`, flow: FlowType, step: number) {
    this.address = address;
    this.step = step;
    this.flow = flow;
  }

  async buildAndSend(
    callData: `cb_${string}`,
    contractId: `ct_${string}`,
    userBalance: bigint,
    amountWei: bigint,
    newAccount: boolean,
  ) {

    const query = {
      transaction: new URLSearchParams(window.location.search).get('transaction'),
    };

    if (query.transaction) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const unpackedTransaction = unpackTx(query.transaction as `tx_${string}`, Tag.SignedTx) as any;

      const cost = getExecutionCostBySignedTx(query.transaction as `tx_${string}`, 'ae_mainnet', { innerTx: "fee-payer" });
      const isUserHaveEnoughCoins = userBalance > cost + Constants.ae_balance_threshold;
      if (unpackedTransaction.encodedTx.contractId === contractId) {
        return postOrPayForTransaction(query.transaction as `tx_${string}`, isUserHaveEnoughCoins);
      }
    }
    const contractCallTx = await aeSdk.buildTx({
      tag: Tag.ContractCallTx,
      callerId: this.address,
      contractId,
      amount: 0,
      gasLimit: 1000000,
      gasPrice: 1500000000,
      ttl: await aeSdk.getHeight({ cached: true }) + 3,
      callData,
      ...(newAccount ? { nonce: 1 } : {}),
    });

    const cost = getExecutionCost(contractCallTx);
    const isUserHaveEnoughCoins =
      userBalance > cost + Constants.ae_balance_threshold;

    if ((window.navigator.userAgent.includes('Mobi') || isSafariBrowser()) && window.parent === window) {
      console.log('sendTxDeepLinkUrl');
      if (window.confirm('Open in mobile?')) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        window.location = sendTxDeepLinkUrl('ae_mainnet', contractCallTx, this.flow, this.step, amountWei, !isUserHaveEnoughCoins);
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
      return;
    }
    const signedContractCallTx = await aeSdk.signTransaction(
      contractCallTx,
      isUserHaveEnoughCoins ? {} : { innerTx: true },
    );
    return postOrPayForTransaction(signedContractCallTx, isUserHaveEnoughCoins);
  }

  async changeAllowance(amountWei: bigint): Promise<{ hash: Encoded.TxHash } | undefined> {
    return WalletService.getAeBalance(this.address).then((balance: bigint) =>
      this.changeAllowanceInternal(amountWei, balance),
    );
  }

  async changeAllowanceInternal(
    amountWei: bigint,
    userBalance: bigint,
  ) {
    console.log(`Change allowance, user balance:${userBalance}!`);
    const tokenContract = await Contract.initialize({
      ...aeSdk.getContext(),
      aci: aex9ACI,
      address: Constants.ae_weth_address,
    });

    const tokenContractWallet = await Contract.initialize({
      ...aeSdk.getContext(),
      aci: aex9ACI,
      address: Constants.ae_weth_address,
    });

    const newAccount = await WalletService.isNewAccount(this.address);

    const { decodedResult: allowance } = await tokenContractWallet
      .allowance(
        {
          from_account: this.address,
          for_account: Constants.ae_dex_router_address.replace('ct_', 'ak_'),
        },
        { callStatic: true },
      )
      .catch((error) => {
        console.info(error);

        return {
          decodedResult: undefined,
        };
      }); // catches account not found, assumes no allowance exist for an empty address

    if (allowance === undefined) {
      console.info('Creating allowance.');
      const calldata = tokenContract._calldata.encode(
        'FungibleTokenFull',
        'create_allowance',
        [
          Constants.ae_dex_router_address.replace('ct_', 'ak_'),
          amountWei + (amountWei * Constants.allowance_slippage) / 100n,
        ],
      );
      return this.buildAndSend(calldata, Constants.ae_weth_address, userBalance, amountWei, newAccount);
    } else {
      const amount_with_allowance_slippage =
        amountWei + (amountWei * Constants.allowance_slippage) / 100n;
      if (allowance < amount_with_allowance_slippage) {
        console.info('Changing allowance.');
        const calldata = tokenContract._calldata.encode(
          'FungibleTokenFull',
          'change_allowance',
          [
            Constants.ae_dex_router_address.replace('ct_', 'ak_'),
            (amount_with_allowance_slippage - allowance).toString(),
          ],
        );
        return this.buildAndSend(calldata, Constants.ae_weth_address, userBalance, amountWei, newAccount);
      }
    }
  }

  async swapAetoAeEth(
    amountinAettos: bigint,
    amountOut: bigint,
  ) {
    const routerContract = await Contract.initialize({
      ...aeSdk.getContext(),
      aci: routerACI,
      address: Constants.ae_dex_router_address,
    });

    const aHourFromNow = Date.now() + 60 * 60 * 1000;

    return routerContract.swap_exact_ae_for_tokens(
      (amountOut / 100n) * 95n,
      [Constants.ae_wae_address, Constants.ae_weth_address],
      this.address,
      aHourFromNow,
      undefined,
      { amount: amountinAettos.toString() },
    );
  }

  async swapAeEthToAE(amountWei: bigint, amountOut: bigint): Promise<Encoded.TxHash> {
    return WalletService.getAeBalance(this.address).then((balance: bigint) =>
      this.swapAeEthToAEInternal(amountWei, amountOut, balance),
    );
  }

  async swapAeEthToAEInternal(
    amountWei: bigint,
    amountOut: bigint,
    userBalance: bigint,
  ): Promise<Encoded.TxHash> {
    console.log('Swap aeEth to AE');
    const routerContract = await Contract.initialize({
      ...aeSdk.getContext(),
      aci: routerACI,
      address: Constants.ae_dex_router_address,
    });

    const aHourFromNow = Date.now() + 60 * 60 * 1000;
    const calldata = routerContract._calldata.encode(
      'AedexV2Router',
      'swap_exact_tokens_for_ae',
      [
        amountWei, // how much eth to swap for ae
        (amountOut / 100n) * 95n, // min amount out
        // [ aeEth, wAE] // path
        [Constants.ae_weth_address, Constants.ae_wae_address],
        this.address,
        aHourFromNow, // deadline is 1 hour
      ],
    );
    const result = await this.buildAndSend(calldata, Constants.ae_dex_router_address, userBalance, amountWei, false);
    if (!result?.hash) {
      throw new Error('Failed to build and send the transaction');
    }

    return result.hash;
  }

  async pollSwapAeEthToAE(
    txHash: Encoded.TxHash,
  ): Promise<{ success: boolean; error?: string; values?: [bigint, bigint] }> {
    await aeSdk.poll(txHash, { blocks: 15 });

    // We are waiting for it to appear in the mdw
    // TODO: do it with websocket
    await new Promise((resolve) => setTimeout(resolve, 10000));

    const swapResult = await fetch(
      `${Constants.ae_middleware_url}/transactions/${txHash}`,
    ).then((res) => res.json());

    console.log('swap result', swapResult);

    if (swapResult.error) {
      return { success: false, error: swapResult.error };
    }

    let values: [bigint, bigint];
    if (swapResult?.tx?.result === 'ok') {
      values = [
        swapResult.tx.return.value[0].value,
        swapResult.tx.return.value[1].value,
      ];
    } else if (swapResult?.tx?.tx?.tx?.result === 'ok') {
      values = [
        swapResult.tx.tx.tx.return.value[0].value,
        swapResult.tx.tx.tx.return.value[1].value,
      ];
    }

    if (values!) {
      return { success: true, values };
    }

    return { success: false, error: 'Invalid transaction result' };
  }
}

export default DexService;
