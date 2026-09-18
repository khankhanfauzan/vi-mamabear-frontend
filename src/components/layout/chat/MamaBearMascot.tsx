export function MamaBearMascot({ className = "" }: { className?: string }) {
  return (
    <div className={`mama-bear-stage ${className}`} aria-hidden>
      <svg
        className="mama-bear-figure h-full w-full"
        viewBox="0 0 160 176"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <ellipse cx="80" cy="164" rx="42" ry="8" fill="#6c4735" opacity="0.18" />

        <ellipse cx="48" cy="42" rx="18" ry="16" fill="#fff8f2" />
        <ellipse cx="112" cy="42" rx="18" ry="16" fill="#fff8f2" />
        <ellipse cx="48" cy="44" rx="9" ry="8" fill="#fbcbd9" />
        <ellipse cx="112" cy="44" rx="9" ry="8" fill="#fbcbd9" />

        <ellipse cx="80" cy="78" rx="48" ry="44" fill="#fff8f2" />
        <path
          d="M44 108c8 28 24 44 36 48 12-4 28-20 36-48 0 22-16 48-36 56-20-8-36-34-36-56Z"
          fill="#fff8f2"
        />

        <g className="mama-bear-arm">
          <path
            d="M118 96c18-6 34-28 30-46-2 14-12 26-24 32-6 4-14 10-18 18 6 2 10 0 12-4Z"
            fill="#fff8f2"
          />
          <circle cx="146" cy="48" r="11" fill="#fff8f2" />
          <circle cx="146" cy="44" r="3.5" fill="#fbcbd9" />
        </g>

        <ellipse cx="64" cy="118" rx="12" ry="16" fill="#ffe8dc" />
        <ellipse cx="80" cy="124" rx="22" ry="18" fill="#6c4735" />
        <circle cx="72" cy="118" r="5" fill="#3d2418" />
        <circle cx="88" cy="118" r="5" fill="#3d2418" />
        <ellipse cx="80" cy="128" rx="6" ry="4" fill="#3d2418" />

        <ellipse cx="64" cy="76" rx="5" ry="6" fill="#6c4735" />
        <ellipse cx="96" cy="76" rx="5" ry="6" fill="#6c4735" />
        <ellipse cx="80" cy="90" rx="7" ry="5" fill="#6c4735" />
        <path
          d="M76 94c2.4 4 8 4 10.4 0"
          stroke="#6c4735"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="58" cy="86" r="5" fill="#fbcbd9" opacity="0.9" />
        <circle cx="102" cy="86" r="5" fill="#fbcbd9" opacity="0.9" />
      </svg>
    </div>
  );
}
