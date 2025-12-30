export function Logo() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mr-2 text-primary"
    >
      <rect width="28" height="28" rx="6" fill="currentColor" />
      <path
        d="M6 8H12V10H8V13H11C12.1046 13 13 13.8954 13 15V18C13 19.1046 12.1046 20 11 20H6V8ZM8 15V18H11V15H8Z"
        fill="hsl(var(--primary-foreground))"
      />
      <path
        d="M15 8H21C22.1046 8 23 8.89543 23 10V12C23 13.1046 22.1046 14 21 14H18.5V16H21L23 20H20.5L18.5 16.5L15 20V8ZM17 10V12H21V10H17Z"
        fill="hsl(var(--primary-foreground))"
      />
    </svg>
  );
}
