import { BigNumber } from 'bignumber.js';
import { DEFAULT_LOCALE } from './constants';
import { Route } from './types';
import { FlowType } from './stores/exchangeStore';

export function splitAddress(address: string | null | undefined): string {
  return address
    ? address.match(/.{1,3}/g)!.reduce((acc, current) => `${acc} ${current}`)
    : '';
}

export function formatNumber(
  value: number,
  options: Intl.NumberFormatOptions = {},
) {
  return new Intl.NumberFormat(DEFAULT_LOCALE, options).format(value);
}

export function formatCurrency(value: number): string {
  let result = '';
  if (value < 0.01 && value > 0) {
    result += '<';
    value = 0.01;
  }
  result += new Intl.NumberFormat(DEFAULT_LOCALE, {
    style: 'currency',
    currencyDisplay: 'code',
    currency: 'usd',
  }).format(value);
  return result;
}

export function powerAndTruncFloat(
  value: string | number | bigint,
  power: number,
): bigint {
  return BigInt(Math.trunc(parseFloat(value.toString()) * 10 ** power));
}

export function shortenAddress(
  address: string,
  startLen = 8,
  endLen = 4,
): string {
  if (!address || address.length <= startLen + endLen) return address;
  const start = address.slice(0, startLen);
  const end = address.slice(-endLen);
  return `${start}...${end}`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function fetchJson<T = any>(
  url: string,
  options?: RequestInit,
): Promise<T | null> {
  const response = await fetch(url, options);
  if (response.status === 204) {
    return null;
  }
  return response.json();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function executeAndSetInterval(handler: () => any, timeout: number) {
  handler();
  return setInterval(handler, timeout);
}

export const createOnAccountObject = (address: string) => ({
  address,
  signTransaction: () => null,
});

export const isSafariBrowser = () =>
  navigator.userAgent.includes('Safari') &&
  !navigator.userAgent.includes('Chrome');

export const createDeepLinkUrl = ({
  type,
  callbackUrl,
  ...params
}: {
  type: string;
  callbackUrl?: string;
  transaction?: string;
  networkId?: string;
  innerTx?: boolean;
  'x-success': string;
  'x-cancel': string;
}) => {
  const url = new URL(`https://wallet.superhero.com/${type}`);
  if (callbackUrl) {
    url.searchParams.set('x-success', callbackUrl);
    url.searchParams.set('x-cancel', callbackUrl);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Object.entries(params as any)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .filter(([, value]) => ![undefined, null].includes(value as any))
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .forEach(([name, value]) => url.searchParams.set(name, value as any));
  return url;
};

export function sendTxDeepLinkUrl(
  networkId: string,
  encodedTx: string,
  flow: FlowType,
  step: number,
  amountWei: bigint,
  isInnerTransaction?: boolean,
) {
  const currentUrl = new URL(window.location.href);
  // reset url
  currentUrl.searchParams.delete('transaction');
  currentUrl.searchParams.delete('transaction-status');
  currentUrl.searchParams.delete('flow');
  currentUrl.searchParams.delete('step');

  // append transaction parameter for success case
  const successUrl = new URL(currentUrl.href);
  // successUrl.searchParams.set('transaction', '{transaction}');
  // successUrl.searchParams.set('flow', flow as unknown as string);
  // successUrl.searchParams.set('step', step.toString());
  // successUrl.searchParams.set('amountFrom', amountWei.toString());

  // append transaction parameter for failed case
  const cancelUrl = new URL(currentUrl.href);
  // cancelUrl.searchParams.set('transaction-status', 'cancelled');
  // cancelUrl.searchParams.set('flow', flow as unknown as string);
  // cancelUrl.searchParams.set('step', step.toString());
  // cancelUrl.searchParams.set('amountFrom', amountWei.toString());

  return createDeepLinkUrl({
    type: 'sign-transaction',
    transaction: encodedTx,
    networkId,
    innerTx: isInnerTransaction,
    // decode these urls because they will be encoded again
    'x-success': decodeURI(successUrl.href),
    'x-cancel': decodeURI(cancelUrl.href),
  });
}

// DEX utils functions
/**
 * A number, or a string containing a number.
 * @typedef {(BigNumber|number|bigint|string)} NumberLike
 * @typedef {[ NumberLike, NumberLike ]} Reserves
 */

/**
 * @description orders the route in the proper direction depending on the starting token
 * NOTE: is useful for swaps
 */
function orderRoute(route: Route[], tokenA: `ct_${string}`): Route[] {
  if (!route || !route.length) return [];
  return route.length < 2 ||
    route[0].token0 === tokenA ||
    route[0].token1 === tokenA
    ? route
    : [...route].reverse();
}
/**
 * @description extracts the pair reserves from a swap-route
 * @param {array} route - the route in the shape received from 'dex-backend'
 * @param {string} tokenA tokenA address
 * @return {Reserves[]}
 * NOTE: doesn't matter if the route starts with tokenA or with tokenB.
 * the function is capable to figure out the right order
 */
export function getRouteReserves(
  route: Route[],
  tokenA: `ct_${string}`,
): number[][] {
  if (!route || !route.length) return [];
  return orderRoute(route, tokenA).reduce(
    (
      [acc, prev],
      { token0, token1, liquidityInfo: { reserve0, reserve1 } },
    ) => {
      const [reserves, next] =
        token0 === prev
          ? [[reserve0, reserve1], token1]
          : [[reserve1, reserve0], token0];
      return [acc.concat([reserves]), next];
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [[], tokenA] as any,
  )[0];
}

const ratioFromPairReserves = (pairReserves: number[][]) =>
  pairReserves.reduce(
    (ratio, [reserveA, reserveB]) =>
      ratio.multipliedBy(BigNumber(reserveB).div(reserveA)),
    BigNumber(1),
  );

/**
 * @description gets ratio from a full swap-route path
 * @param {array} route path
 * @param {string} tokenA address
 * @return {BigNumber}
 */
export const ratioFromRoute = (route: Route[], tokenA: `ct_${string}`) =>
  ratioFromPairReserves(getRouteReserves(route, tokenA));

export const extractErrorMessage = (e: unknown): string => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const error = e as any;
  return (
    error?.info?.error?.message || error?.message || 'Something went wrong.'
  );
};
