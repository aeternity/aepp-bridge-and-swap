import { BigNumber } from 'bignumber.js';

import { Constants } from "../constants";
import { fetchJson, ratioFromRoute } from "../helpers";
import { Route } from '../types';

const API_KEY = "5b0cc90bc129718df8ef48bbcc7d31756802e97b9b06340e66adfb7410807956";
const BASE_URL = "https://min-api.cryptocompare.com/data/";

class TokenPriceService {
  static async getPrice(tokenSymbol: string): Promise<number> {
    const result = await fetchJson(
      `${BASE_URL}price?fsym=${tokenSymbol}&tsyms=USD&api_key=${API_KEY}`,
    );
    return result.USD;
  }

  static async getPrices(): Promise<{ AE: number; ETH: number, aeEthToAeRatio: BigNumber }> {
    const [coinsPrice, aeEthPrice] = await Promise.all([
      fetchJson(`${BASE_URL}pricemulti?fsyms=AE,ETH&tsyms=USD&api_key=${API_KEY}`),
      fetchJson(`https://dex-backend-mainnet.prd.service.aepps.com/swap-routes/ct_J3zBY8xxjsRr3QojETNw48Eb38fjvEuJKkQ6KzECvubvEcvCa/ct_ryTY1mxqjCjq1yBn9i6HDaCSdA6thXUFZTA84EMzbWd1SLKdh`)
      .then((result: Route[][]) => {
        return ratioFromRoute(result[0], Constants.ae_weth_address);
      })
    ]);

    return { AE: coinsPrice.AE.USD, ETH: coinsPrice.ETH.USD, aeEthToAeRatio: aeEthPrice };
  }
}

export default TokenPriceService;
