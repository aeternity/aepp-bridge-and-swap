import * as React from 'react';
import { AE_AVATAR_URL, Constants } from '../constants';

const AeEthAvatar = (props: any) => (
  <img
    src={AE_AVATAR_URL + Constants.ae_weth_address}
    alt="Avatar"
    style={{
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      border: '1px solid rgba(64, 67, 80, 1)',
    }}
  />
);
export default AeEthAvatar;
