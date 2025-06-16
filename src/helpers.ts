import { FlowType } from 'typescript';
import { DEFAULT_LOCALE } from './constants';

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
  navigator.userAgent.includes('Safari') && !navigator.userAgent.includes('Chrome');

export const createDeepLinkUrl = ({ type, callbackUrl, ...params }: {
  type: string,
  callbackUrl?: string,
  transaction?: string,
  networkId?: string,
  step?: number;
  flow?: FlowType;
  'x-success': string,
  'x-cancel': string,
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

export function sendTxDeepLinkUrl(networkId: string, encodedTx: string, flow: FlowType, step: number) {
  const currentUrl = new URL(window.location.href);
  // reset url
  currentUrl.searchParams.delete('transaction');
  currentUrl.searchParams.delete('transaction-status');
  currentUrl.searchParams.delete('flow');
  currentUrl.searchParams.delete('step');

  // append transaction parameter for success case
  const successUrl = new URL(currentUrl.href);
  successUrl.searchParams.set('transaction', '{transaction}');
  successUrl.searchParams.set('flow', flow as unknown as string);
  successUrl.searchParams.set('step', step.toString());

  // append transaction parameter for failed case
  const cancelUrl = new URL(currentUrl.href);
  cancelUrl.searchParams.set('transaction-status', 'cancelled');
  cancelUrl.searchParams.set('flow', flow as unknown as string);
  cancelUrl.searchParams.set('step', step.toString());

  return createDeepLinkUrl({
    type: 'sign-transaction',
    transaction: encodedTx,
    networkId,
    step,
    flow,
    // decode these urls because they will be encoded again
    'x-success': decodeURI(successUrl.href),
    'x-cancel': decodeURI(cancelUrl.href),
  });
}
