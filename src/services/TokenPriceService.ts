const API_KEY =
  "5b0cc90bc129718df8ef48bbcc7d31756802e97b9b06340e66adfb7410807956";
const BASE_URL = "https://min-api.cryptocompare.com/data/";

class TokenPriceService {
  static async getPrice(tokenSymbol: string): Promise<number> {
    const response = await fetch(
      `${BASE_URL}price?fsym=${tokenSymbol}&tsyms=USD&api_key=${API_KEY}`,
    );
    const result = await response.json();
    return result.USD;
  }

  static async getPrices(): Promise<{ AE: number; ETH: number }> {
    const response = await fetch(
      `${BASE_URL}pricemulti?fsyms=AE,ETH&tsyms=USD&api_key=${API_KEY}`,
    );
    const results = await response.json();

    return { AE: results.AE.USD, ETH: results.ETH.USD };
  }
}

export default TokenPriceService;
