/** Контурный зуб из макета — знак в шапке и подвале. */
export default function ToothIcon({ className = '', strokeWidth = 2 }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M24 10c-6-5-17-5-17 6 0 7 4 11 5 19 1 9 5 9 7 0 2-10 8-10 10 0 2 9 6 9 7 0 1-8 5-12 5-19 0-11-11-11-17-6Z" />
      <path d="M19 9c3 3 6 4 10 3" />
    </svg>
  );
}
