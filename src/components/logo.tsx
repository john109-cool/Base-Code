export function Logo() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mr-2"
    >
      <g clipPath="url(#clip0_105_2)">
        <rect width="28" height="28" rx="6" fill="url(#paint0_linear_105_2)" />
        <g filter="url(#filter0_f_105_2)">
          <circle cx="14" cy="14" r="8" fill="white" fillOpacity="0.5" />
        </g>
        <rect
          x="0.5"
          y="0.5"
          width="27"
          height="27"
          rx="5.5"
          stroke="white"
          strokeOpacity="0.3"
        />
      </g>
      <defs>
        <filter
          id="filter0_f_105_2"
          x="2"
          y="2"
          width="24"
          height="24"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur stdDeviation="2" result="effect1_foregroundBlur_105_2" />
        </filter>
        <linearGradient
          id="paint0_linear_105_2"
          x1="0"
          y1="0"
          x2="28"
          y2="28"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#005BEA" />
          <stop offset="1" stopColor="#00C5EA" />
        </linearGradient>
        <clipPath id="clip0_105_2">
          <rect width="28" height="28" rx="6" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
