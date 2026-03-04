'use client'

import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  size?: number
  showText?: boolean
}

export function Logo({ className, size = 32, showText = false }: LogoProps) {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        {/* Document outline - teal */}
        <path
          d="M12 6C12 4.89543 12.8954 4 14 4H28L38 14V42C38 43.1046 37.1046 44 36 44H14C12.8954 44 12 43.1046 12 42V6Z"
          stroke="#2DD4BF"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Document fold */}
        <path
          d="M28 4V14H38"
          stroke="#2DD4BF"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Document lines */}
        <line x1="18" y1="22" x2="28" y2="22" stroke="#2DD4BF" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="18" y1="28" x2="32" y2="28" stroke="#2DD4BF" strokeWidth="2.5" strokeLinecap="round" />
        {/* Upward arrow - dark blue */}
        <path
          d="M20 40L36 16"
          stroke="#1e3a5f"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M20 40L26 36"
          stroke="#1e3a5f"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M36 16L32 24"
          stroke="#1e3a5f"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M36 16L42 20"
          stroke="#1e3a5f"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
      {showText && (
        <span className="text-lg font-semibold text-foreground tracking-tight">RoleMark</span>
      )}
    </div>
  )
}

export function LogoMark({ className, size = 32 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('shrink-0', className)}
    >
      {/* Document outline - teal */}
      <path
        d="M12 6C12 4.89543 12.8954 4 14 4H28L38 14V42C38 43.1046 37.1046 44 36 44H14C12.8954 44 12 43.1046 12 42V6Z"
        stroke="#2DD4BF"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Document fold */}
      <path
        d="M28 4V14H38"
        stroke="#2DD4BF"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Document lines */}
      <line x1="18" y1="22" x2="28" y2="22" stroke="#2DD4BF" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="18" y1="28" x2="32" y2="28" stroke="#2DD4BF" strokeWidth="2.5" strokeLinecap="round" />
      {/* Upward arrow - dark blue */}
      <path
        d="M20 40L36 16"
        stroke="#1e3a5f"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M20 40L26 36"
        stroke="#1e3a5f"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M36 16L32 24"
        stroke="#1e3a5f"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M36 16L42 20"
        stroke="#1e3a5f"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  )
}
