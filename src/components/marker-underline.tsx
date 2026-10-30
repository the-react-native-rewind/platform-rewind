export function MarkerUnderline({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 300 10"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
      className={`marker-underline ${className}`.trim()}
    >
      <path
        d="M3 7c70-6 168-7 294-3"
        stroke="currentColor"
        strokeWidth="8"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}
