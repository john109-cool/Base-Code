export function Logo() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mr-2 text-primary"
    >
      <rect width="24" height="24" rx="6" fill="currentColor" />
      <path
        d="M7 7H17V9H9V11H15V13H9V15H17V17H7V7Z"
        fill="hsl(var(--primary-foreground))"
      />
    </svg>
  );
}
