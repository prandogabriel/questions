interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showText?: boolean
  className?: string
}

const sizeMap = {
  sm: 24,
  md: 32,
  lg: 48,
  xl: 64,
}

export function Logo({ size = 'md', showText = false, className = '' }: LogoProps) {
  const dimension = sizeMap[size]

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <svg
        width={dimension}
        height={dimension}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        {/* Gradient Definition */}
        <defs>
          <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#8B5CF6', stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: '#EC4899', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#F97316', stopOpacity: 1 }} />
          </linearGradient>
        </defs>

        {/* Background */}
        <rect width="32" height="32" rx="6" fill="url(#logo-gradient)" />

        {/* Question Mark */}
        <g transform="translate(16, 16)">
          <path
            d="M -4 -7 Q -4 -10, -1 -10 Q 2 -10, 4 -8.5 Q 6 -7, 6 -4.5 Q 6 -2, 4 0 L 1 3.5"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="1" cy="7" r="1.5" fill="white" />
        </g>
      </svg>

      {showText && (
        <span className="font-bold text-gray-900 dark:text-white tracking-tight">
          Realtime Q&A
        </span>
      )}
    </div>
  )
}
