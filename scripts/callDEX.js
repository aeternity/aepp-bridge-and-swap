#!/usr/bin/env node
import {
  AeSdk,
  Node,
  CompilerHttp,
  Contract,
  AccountMnemonicFactory,
} from "@aeternity/aepp-sdk";
import fs from "fs";

/*
This maps from mainnet eth to testnet ae
 */

/*
Bridge contract address: ct_2wP1RMbbEdCTdystsvYx4ZDXMsqFrH72RRrBqbd5JBoi9EFjN2
Token contract address: ct_mZPohW4DSd4EDQDoYesyo4Nd5Kbok76oV4EepKm45XLyBoQgL


 */

const WAE_MAINNET = "ct_J3zBY8xxjsRr3QojETNw48Eb38fjvEuJKkQ6KzECvubvEcvCa";
const AE_ETH_MAINNET = "ct_ryTY1mxqjCjq1yBn9i6HDaCSdA6thXUFZTA84EMzbWd1SLKdh";
const AE_ETH_PAIR_MAINNET =
  "ct_2iV2XwSftHrigPZGLrTJkhpxYvRQCHRgQA9V8NiEkGNe5Vb8hB";
const ROUTER_MAINNET = "ct_azbNZ1XrPjXfqBqbAh1ffLNTQ1sbnuUDFvJrXjYz7JQA1saQ3";

const node = new Node("https://mainnet.aeternity.io"); // ideally host your own node
const factory = new AccountMnemonicFactory(process.env.MNEMONIC);
const accounts = await factory.discover(node);
const compiler = new CompilerHttp("https://v8.compiler.aepps.com"); // host your own compiler

const aeSdk = new AeSdk({
  nodes: [{ name: "testnet", instance: node }],
  accounts: [accounts[0]],
  onCompiler: compiler,
});

const aci = fs.readFileSync(
  "node_modules/dex-contracts-v2/build/AedexV2Router.aci.json",
  "utf-8",
);

// assets : map(string, FungibleTokenFullInterface), native_ae : native_asset, native_eth : native_asset
// native_asset :  eth_addr: string, underlying_token: FungibleTokenFullInterface
const routerContract = await Contract.initialize({
  ...aeSdk.getContext(),
  aci: JSON.parse(aci),
  address: ROUTER_MAINNET,
});

const aHourFromNow = Date.now() + 60 * 60 * 1000;

const tx = await routerContract.$call(
  "swap_ae_for_exact_tokens",
  [
    10000000000, // how much tokens to buy
    // [ aeEth, wAE] // path
    [WAE_MAINNET, AE_ETH_MAINNET],
    // [AE_ETH_PAIR_MAINNET],
    "ak_rRVV9aDnmmLriPePDSvfTUvepZtR2rbYk2Mx4GCqGLcc1DMAq",
    aHourFromNow, // deadline is 1 hour,
  ],
  {
    amount: 1000000000000000,
  },
);

console.log("Bridge swap call:", tx);
