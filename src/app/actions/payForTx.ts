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
import { Constants } from "../../constants";

if (!process.env.NEXT_PUBLIC_AE_PRIVATE_KEY) {
  throw new Error("NEXT_PUBLIC_AE_PRIVATE_KEY is required");
}

const payerAccount = new MemoryAccount(process.env.NEXT_PUBLIC_AE_PRIVATE_KEY!);

const node = new Node(Constants.ae_node_url);
const aeSdk = new AeSdk({
  nodes: [{ name: Constants.ae_network_id, instance: node }],
  accounts: [payerAccount],
});

const tokenContract = await aeSdk.initializeContract({
  aci: aex9ACI,
  address: Constants.ae_weth_address,
});

const routerContract = await aeSdk.initializeContract({
  aci: routerACI,
  address: Constants.ae_dex_router_address,
});

export async function payForTx(singedTx: Encoded.Transaction) {
  const result = unpackTx(singedTx, Tag.SignedTx);
  if (result.encodedTx.tag !== Tag.ContractCallTx)
    throw new Error("Wrong tx type");

  // check for token contract
  if (result.encodedTx.contractId === Constants.ae_weth_address) {
    const args = tokenContract._calldata.decodeContractByteArray(
      result.encodedTx.callData,
    ) as [string, [string, bigint]];

    // hash of the change_allowance or create_allowance functions
    if (
      Buffer.from(args[0]).toString("base64") !== "Pe+/vVrvv70="
      && Buffer.from(args[0]).toString("base64") !== "78xY4Q=="
      && Buffer.from(args[0]).toString("base64") !== "PYVajg=="
    ) { 
      throw new Error("Invalid function: " + Buffer.from(args[0]).toString("base64"));
    }
    // check for router address
    if (args[1][0] !== Constants.ae_dex_router_address.replace("ct_", "ak_")) {
      throw new Error("Invalid router address");
    }
    // If the account was never used, upon transaction verifying sdk will throw an error: Account not found
    // this is a known issue from sdk
    return aeSdk.payForTransaction(singedTx, { verify: false });
  }

  // check for swap
  if (result.encodedTx.contractId === Constants.ae_dex_router_address) {
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
      args[1][2][0] !== Constants.ae_dex_router_address &&
      args[1][2][1] !== Constants.ae_wae_address
    ) {
      throw new Error("Invalid router address");
    }

    // If the account was never used, upon transaction verifying sdk will throw an error: Account not found
    // this is a known issue from sdk
    return aeSdk.payForTransaction(singedTx, { verify: false });
  }

  throw Error("Could not determine contract");
}
