import { Theme } from '@mui/material';

export type StepProps = {
  theme?: Theme;
  completed?: boolean;
};

export type Route = {
  address: `ct_${string}`,
  token0: `ct_${string}`,
  token1: `ct_${string}`,
  synchronized: boolean,
  liquidityInfo: {
    totalSupply: number,
    reserve0: number,
    reserve1: number,
    height: number
  }
}
