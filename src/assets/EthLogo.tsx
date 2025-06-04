const EthLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={18}
    height={18}
    fill="none"
    viewBox="0 0 18 18"
    style={{ border: '1px solid rgba(64, 67, 80, 1)', borderRadius: '50%' }}
    {...props}
  >
    <g>
      <path
        fill="#fff"
        d="M17.729 11.177A8.998 8.998 0 1 1 .269 6.824a8.996 8.996 0 1 1 17.46 4.353Z"
      />
      <path
        fill="#000"
        d="m8.998 6.853-5.06 2.3 5.06 2.992 5.062-2.992-5.062-2.3Z"
        opacity={0.6}
      />
      <path
        fill="#000"
        d="M3.94 9.153 9 12.145V.756L3.94 9.153Z"
        opacity={0.45}
      />
      <path fill="#000" d="M9 .756v11.389l5.06-2.992L9 .756Z" opacity={0.8} />
      <path
        fill="#000"
        d="m3.938 10.113 5.06 7.132v-4.142l-5.06-2.99Z"
        opacity={0.45}
      />
      <path
        fill="#000"
        d="M8.998 13.103v4.142l5.064-7.132-5.064 2.99Z"
        opacity={0.8}
      />
    </g>
    <defs>
      <clipPath id="a">
        <rect width={18} height={18} fill="#fff" rx={9} />
      </clipPath>
    </defs>
  </svg>
);
export default EthLogo;
