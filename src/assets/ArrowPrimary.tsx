const ArrowPrimary = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={57}
    height={71}
    viewBox="0 0 42.75 53.25"
    {...props}
  >
    <defs>
      <clipPath id="a">
        <path d="M16 0h26.328v52.508H16Zm0 0" />
      </clipPath>
      <clipPath id="b">
        <path d="M.176 0H27v52.508H.176Zm0 0" />
      </clipPath>
    </defs>
    <g clipPath="url(#a)">
      <path
        d="M25.34.21h-9.133l16.984 26.161-16.96 26.137h9.101l16.98-26.137Zm0 0"
        style={{
          stroke: 'none',
          fillRule: 'nonzero',
          fill: 'currentColor',
          fillOpacity: 1,
        }}
      />
    </g>
    <g clipPath="url(#b)">
      <path
        d="M.195.21 17.18 26.372.195 52.508h9.133l16.98-26.137L9.329.211Zm0 0"
        style={{
          stroke: 'none',
          fillRule: 'nonzero',
          fill: 'currentColor',
          fillOpacity: 1,
        }}
      />
    </g>
  </svg>
);
export default ArrowPrimary;
