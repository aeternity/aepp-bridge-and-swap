#!/usr/bin/env node
import { AeSdk, Node, CompilerHttp, Contract, AccountMnemonicFactory } from '@aeternity/aepp-sdk';
import fs from 'fs';

const ETH_MAINNET_WETH_ADDRESS = '0xabae76f98a84d1dc3e0af8ed68465631165d33b2';
const ETH_MAINNET_WAE_ADDRESS = '0xCa781A1779c8f363f7F82BF6f4B406e5d54bAE1F';
const AE_TESTNET_WRAPPED_AE_ADDRESS = 'ct_JDp175ruWd7mQggeHewSLS1PFXt9AzThCDaFedxon8mF8xTRF';

/*
This maps from mainnet eth to testnet ae
 */

/*
Bridge contract address: ct_2wP1RMbbEdCTdystsvYx4ZDXMsqFrH72RRrBqbd5JBoi9EFjN2
Token contract address: ct_mZPohW4DSd4EDQDoYesyo4Nd5Kbok76oV4EepKm45XLyBoQgL
 */

const node = new Node('https://testnet.aeternity.io'); // ideally host your own node
const factory = new AccountMnemonicFactory(process.env.MNEMONIC);
const accounts = await factory.discover(node);
const compiler = new CompilerHttp('https://v8.compiler.aepps.com'); // host your own compiler


const aeSdk = new AeSdk({
  nodes: [{ name: 'testnet', instance: node }],
  accounts: [accounts[0]],
  onCompiler: compiler,
});

const bridgeContractSource = fs.readFileSync('./contracts/Bridge.aes', 'utf-8');
const tokenContractSource = fs.readFileSync('./contracts/FungibleTokenFull.aes', 'utf-8');



// name: string, decimals : int, symbol : string, initial_owner_balance : option(int)
const tokenContract = await Contract.initialize({
  ...aeSdk.getContext(),
  sourceCode: tokenContractSource,
});

await tokenContract.init("BridgeWrappedEthTest", 18, "BWET");

// assets : map(string, FungibleTokenFullInterface), native_ae : native_asset, native_eth : native_asset
// native_asset :  eth_addr: string, underlying_token: FungibleTokenFullInterface
const bridgeContract = await Contract.initialize({
  ...aeSdk.getContext(),
  sourceCode: bridgeContractSource,
});

await bridgeContract.init(
  [], // assets
  { eth_addr: ETH_MAINNET_WAE_ADDRESS, underlying_token: AE_TESTNET_WRAPPED_AE_ADDRESS }, // native_ae
  { eth_addr: ETH_MAINNET_WETH_ADDRESS, underlying_token: tokenContract.$options.address }, // native_eth
);

console.log('Bridge contract address:', bridgeContract.$options.address);
console.log('Token contract address:', tokenContract.$options.address);

// 0. Add user as processor on the bridge
await bridgeContract.add_processor(accounts[0].address);

// 1. Call change_owner on the token to allow the bridge to mint
await tokenContract.change_owner(bridgeContract.$options.address);

// 2. Call confirm_asset_owner on the bridge to confirm the token owner
await bridgeContract.confirm_asset_owner(ETH_MAINNET_WETH_ADDRESS);
