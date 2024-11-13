import routerACI from 'dex-contracts-v2/build/AedexV2Router.aci.json';
import aex9ACI from 'dex-contracts-v2/build/FungibleTokenFull.aci.json';

import { Sdk } from "./WalletService";

const WAE_MAINNET = 'ct_J3zBY8xxjsRr3QojETNw48Eb38fjvEuJKkQ6KzECvubvEcvCa';
const AE_ETH_MAINNET = 'ct_ryTY1mxqjCjq1yBn9i6HDaCSdA6thXUFZTA84EMzbWd1SLKdh';
const ROUTER_MAINNET = 'ct_azbNZ1XrPjXfqBqbAh1ffLNTQ1sbnuUDFvJrXjYz7JQA1saQ3';


class DexService {

    static async changeAllowance(amountWei: bigint): Promise<void> {
        const tokenContract = await Sdk.initializeContract({
            aci: aex9ACI,
            address: AE_ETH_MAINNET,
        });
        await tokenContract.change_allowance(ROUTER_MAINNET.replace('ct_', 'ak_'), (amountWei * 2n).toString()) // double the amount so we can be sure
    }

    static async swapAeEthToAE(amountWei: bigint, aeAddress: string): Promise<void> {
        const routerContract = await Sdk.initializeContract({
            aci: routerACI,
            address: ROUTER_MAINNET,
        });

        // debugger;
        // do swap
        const aHourFromNow = Date.now() + 60 * 60 * 1000;
        await routerContract.swap_exact_tokens_for_ae(
            1,
            0, // min amount out TODO make this save
            // [ aeEth, wAE] // path
            [AE_ETH_MAINNET, WAE_MAINNET],
            aeAddress,
            aHourFromNow // deadline is 1 hour
        );
    }
}

export default DexService;
