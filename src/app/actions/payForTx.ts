"use server";

import {
  AeSdk,
  Encoded,
  MemoryAccount,
  Node,
  Tag,
  unpackTx,
} from "@aeternity/aepp-sdk";
import { BytecodeContractCallEncoder } from "@aeternity/aepp-calldata";
import { Constants } from "../../constants";
import { fetchJson } from "../../helpers";

export interface AeDecodedCallData {
  functionName: string;
  args: string[];
}

if (!process.env.NEXT_PUBLIC_AE_PRIVATE_KEY) {
  throw new Error("NEXT_PUBLIC_AE_PRIVATE_KEY is required");
}

const payerAccount = new MemoryAccount(process.env.NEXT_PUBLIC_AE_PRIVATE_KEY! as `sk_${string}`);

const node = new Node(Constants.ae_node_url);
const aeSdk = new AeSdk({
  nodes: [{ name: Constants.ae_network_id, instance: node }],
  accounts: [payerAccount],
});

export async function payForTx(singedTx: Encoded.Transaction) {
  const result = unpackTx(singedTx, Tag.SignedTx);
  if (result.encodedTx.tag !== Tag.ContractCallTx)
    throw new Error("Wrong tx type");

  // check for token contract
  if (result.encodedTx.contractId === Constants.ae_weth_address) {
    const { bytecode } = await fetchJson(`https://mainnet.aeternity.io/v3/contracts/${result.encodedTx.contractId}/code`);

    const bytecodeContractCallEncoder = new BytecodeContractCallEncoder(bytecode);

    const transactionParams = bytecodeContractCallEncoder.decodeCall(
      result.encodedTx.callData,
    ) as AeDecodedCallData;

    if (
      transactionParams.functionName !== 'create_allowance'
      && transactionParams.functionName !== 'change_allowance'
    ) {
      throw new Error("Invalid function: " + transactionParams.functionName);
    }
    // check for router address
    if (transactionParams.args[0] !== Constants.ae_dex_router_address.replace("ct_", "ak_")) {
      throw new Error("Invalid router address");
    }
    // If the account was never used, upon transaction verifying sdk will throw an error: Account not found
    // this is a known issue from sdk, using { verify: false } to avoid it
    return aeSdk.payForTransaction(singedTx, { verify: false });
  }

  // check for swap
  if (result.encodedTx.contractId === Constants.ae_dex_router_address) {
    const { bytecode } = await fetchJson(`https://mainnet.aeternity.io/v3/contracts/${result.encodedTx.contractId}/code`);

    const bytecodeContractCallEncoder = new BytecodeContractCallEncoder(bytecode);

    const transactionParams = bytecodeContractCallEncoder.decodeCall(
      result.encodedTx.callData,
    ) as AeDecodedCallData;

    if (transactionParams.functionName !== 'swap_exact_tokens_for_ae') {
      throw new Error("Invalid function");
    }
    // check for router address
    if (
      transactionParams.args[2][0] !== Constants.ae_dex_router_address &&
      transactionParams.args[2][1] !== Constants.ae_wae_address
    ) {
      throw new Error("Invalid router address");
    }

    // If the account was never used, upon transaction verifying sdk will throw an error: Account not found
    // this is a known issue from sdk, using { verify: false } to avoid it
    return aeSdk.payForTransaction(singedTx, { verify: false });
  }

  throw Error("Could not determine contract");
}
