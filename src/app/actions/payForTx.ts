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

const NODE_URL = "https://mainnet.aeternity.io";
const WAE_MAINNET = "ct_J3zBY8xxjsRr3QojETNw48Eb38fjvEuJKkQ6KzECvubvEcvCa";
const AE_ETH_MAINNET = "ct_ryTY1mxqjCjq1yBn9i6HDaCSdA6thXUFZTA84EMzbWd1SLKdh";
const ROUTER_MAINNET = "ct_azbNZ1XrPjXfqBqbAh1ffLNTQ1sbnuUDFvJrXjYz7JQA1saQ3";

if (!process.env.AE_PRIVATE_KEY) {
  throw new Error("AE_PRIVATE_KEY is required");
}

const payerAccount = new MemoryAccount(process.env.AE_PRIVATE_KEY);
console.log(payerAccount.address);
const node = new Node(NODE_URL); // TODO move to env
const aeSdk = new AeSdk({
  nodes: [{ name: "mainnet", instance: node }],
  accounts: [payerAccount],
});

const tokenContract = await aeSdk.initializeContract({
  aci: aex9ACI,
  address: AE_ETH_MAINNET,
});

const routerContract = await aeSdk.initializeContract({
  aci: routerACI,
  address: ROUTER_MAINNET,
});

export async function payForTx(singedTx: Encoded.Transaction) {
  const result = unpackTx(singedTx, Tag.SignedTx);
  if (result.encodedTx.tag !== Tag.ContractCallTx)
    throw new Error("Wrong tx type");

  // check for token contract
  if (
    result.encodedTx.contractId ===
    "ct_ryTY1mxqjCjq1yBn9i6HDaCSdA6thXUFZTA84EMzbWd1SLKdh"
  ) {
    const args = tokenContract._calldata.decodeContractByteArray(
      result.encodedTx.callData,
    ) as [string, [string, bigint]];

    // hash of the allowance function
    if (Buffer.from(args[0]).toString("base64") !== "Pe+/vVrvv70=") {
      throw new Error("Invalid function");
    }
    // check for router address
    if (args[1][0] !== ROUTER_MAINNET.replace("ct_", "ak_")) {
      throw new Error("Invalid router address");
    }
    return aeSdk.payForTransaction(singedTx);
  }

  // check for swap
  if (
    result.encodedTx.contractId ===
    "ct_azbNZ1XrPjXfqBqbAh1ffLNTQ1sbnuUDFvJrXjYz7JQA1saQ3"
  ) {
    const args = routerContract._calldata.decodeContractByteArray(
      result.encodedTx.callData,
    ) as [string, [bigint, bigint, [string, string], string, bigint]];

    console.log(Buffer.from(args[0]).toString("base64"));
    // hash of the swap function
    if (Buffer.from(args[0]).toString("base64") !== "QiZRBw==") {
      throw new Error("Invalid function");
    }
    // check for router address
    if (args[1][2][0] !== ROUTER_MAINNET && args[1][2][1] !== WAE_MAINNET) {
      throw new Error("Invalid router address");
    }
    console.log(args);
    return aeSdk.payForTransaction(singedTx);
  }

  throw Error("Could not determine contract");
}
