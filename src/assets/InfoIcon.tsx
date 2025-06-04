const InfoIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={25}
    height={24}
    fill="currentColor"
    viewBox="0 0 25 24"
    {...props}
  >
    <path d="M12.5 22c5.47 0 10-4.52 10-10 0-5.47-4.53-10-10.01-10C7.02 2 2.5 6.53 2.5 12c0 5.48 4.53 10 10 10Zm0-1.965A8.007 8.007 0 0 1 4.475 12a7.99 7.99 0 0 1 8.015-8.025A8.021 8.021 0 0 1 20.535 12a8.015 8.015 0 0 1-8.035 8.035Z" />
    <path d="M13.5 11a1 1 0 1 0-2 0v5a1 1 0 1 0 2 0v-5ZM13.5 8a1 1 0 1 0-2 0 1 1 0 0 0 2 0Z" />
  </svg>
);
export default InfoIcon;
