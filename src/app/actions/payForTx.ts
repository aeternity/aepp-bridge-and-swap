"use server";

import {
  AeSdk,
  Encoded,
  MemoryAccount,
  Node,
  Tag,
  unpackTx,
} from "@aeternity/aepp-sdk";
import aex9ACI from "dex-contracts-v2/build/FungibleTokenFull.aci.json";
import routerACI from "dex-contracts-v2/build/AedexV2Router.aci.json";
import {
  AE_DEX_ROUTER_ADDRESS,
  AE_NETWORK_ID,
  AE_NODE_URL,
  AE_WAE_ADDRESS,
  AE_WETH_ADDRESS,
} from "../../constants";

if (!process.env.AE_PRIVATE_KEY) {
  throw new Error("AE_PRIVATE_KEY is required");
}

const payerAccount = new MemoryAccount(process.env.AE_PRIVATE_KEY!);

const node = new Node(AE_NODE_URL);
const aeSdk = new AeSdk({
  nodes: [{ name: AE_NETWORK_ID, instance: node }],
  accounts: [payerAccount],
});

const tokenContract = await aeSdk.initializeContract({
  aci: aex9ACI,
  address: AE_WETH_ADDRESS,
});

const routerContract = await aeSdk.initializeContract({
  aci: routerACI,
  address: AE_DEX_ROUTER_ADDRESS,
});

export async function payForTx(singedTx: Encoded.Transaction) {
  const result = unpackTx(singedTx, Tag.SignedTx);
  if (result.encodedTx.tag !== Tag.ContractCallTx)
    throw new Error("Wrong tx type");

  // check for token contract
  if (result.encodedTx.contractId === AE_WETH_ADDRESS) {
    const args = tokenContract._calldata.decodeContractByteArray(
      result.encodedTx.callData,
    ) as [string, [string, bigint]];

    // hash of the allowance function
    if (Buffer.from(args[0]).toString("base64") !== "Pe+/vVrvv70=") {
      throw new Error("Invalid function");
    }
    // check for router address
    if (args[1][0] !== AE_DEX_ROUTER_ADDRESS.replace("ct_", "ak_")) {
      throw new Error("Invalid router address");
    }
    return aeSdk.payForTransaction(singedTx);
  }

  // check for swap
  if (result.encodedTx.contractId === AE_DEX_ROUTER_ADDRESS) {
    const args = routerContract._calldata.decodeContractByteArray(
      result.encodedTx.callData,
    ) as [string, [bigint, bigint, [string, string], string, bigint]];

    console.log(Buffer.from(args[0]).toString("base64"));
    // hash of the swap function
    if (Buffer.from(args[0]).toString("base64") !== "QiZRBw==") {
      throw new Error("Invalid function");
    }
    // check for router address
    if (
      args[1][2][0] !== AE_DEX_ROUTER_ADDRESS &&
      args[1][2][1] !== AE_WAE_ADDRESS
    ) {
      throw new Error("Invalid router address");
    }
    console.log(args);
    return aeSdk.payForTransaction(singedTx);
  }

  throw Error("Could not determine contract");
}
