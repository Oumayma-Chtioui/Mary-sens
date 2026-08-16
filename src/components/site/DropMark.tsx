// The recurring signature motif, redrawn from the Mary'sens logo's
// droplet + leaf mark. Used as a quiet section divider throughout the site.
export default function DropMark({ className = "drop-mark" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path
        d="M20 2C26 12 35 20 35 30C35 38 28 44 20 44C12 44 5 38 5 30C5 20 14 12 20 2Z"
        stroke="#A9803F"
        strokeWidth="1.3"
      />
    </svg>
  );
}
