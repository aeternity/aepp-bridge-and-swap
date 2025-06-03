import { AE_AVATAR_URL } from '../constants';

interface Type {
  address?: string;
}

const Avatar = (props: Type) => (
  <img
    src={AE_AVATAR_URL + props.address}
    alt="Avatar"
    style={{
      width: '20px',
      height: '20px',
      borderRadius: '50%',
      border: '1px solid rgba(64, 67, 80, 1)',
    }}
  />
);
export default Avatar;
