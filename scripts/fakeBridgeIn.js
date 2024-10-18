#!/usr/bin/env node
import { AeSdk, Node, CompilerHttp, Contract, AccountMnemonicFactory } from '@aeternity/aepp-sdk';
import fs from 'fs';

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

// assets : map(string, FungibleTokenFullInterface), native_ae : native_asset, native_eth : native_asset
// native_asset :  eth_addr: string, underlying_token: FungibleTokenFullInterface
const bridgeContract = await Contract.initialize({
  ...aeSdk.getContext(),
  sourceCode: bridgeContractSource,
  address: 'ct_2wP1RMbbEdCTdystsvYx4ZDXMsqFrH72RRrBqbd5JBoi9EFjN2'
});


// (nonce, _asset, destination, amount, action_type)
const tx = await bridgeContract.bridge_in(
  [8, "0xabae76f98a84d1dc3e0af8ed68465631165d33b2", "ak_rRVV9aDnmmLriPePDSvfTUvepZtR2rbYk2Mx4GCqGLcc1DMAq", 485457781487507, 1]
, {
    omitUnknown: true
  });

console.log('Bridge swap call:', tx);


