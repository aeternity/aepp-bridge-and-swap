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
export function executeAndSetInterval(handler: () => any, timeout: number) {
  handler();
  return setInterval(handler, timeout);
}
