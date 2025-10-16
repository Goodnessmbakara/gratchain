interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
  className?: string
}

export function Logo({ size = 'md', showText = true, className = '' }: LogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12', 
    lg: 'w-16 h-16'
  }

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl'
  }

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {/* Custom GratChain Logo */}
      <div className="relative">
        <div className={`${sizeClasses[size]} rounded-xl bg-gradient-to-br from-slate-600 via-slate-700 to-slate-800 flex items-center justify-center shadow-lg`}>
          {/* GratChain "G" Logo */}
          <svg
            width={size === 'sm' ? 20 : size === 'md' ? 28 : 36}
            height={size === 'sm' ? 20 : size === 'md' ? 28 : 36}
            viewBox="0 0 28 28"
            fill="none"
            className="text-white"
          >
            {/* Outer ring */}
            <circle
              cx="14"
              cy="14"
              r="12"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
            {/* Inner "G" shape - stylized for tipping/gratitude */}
            <path
              d="M14 6 C18.4183 6 22 9.58172 22 14 C22 18.4183 18.4183 22 14 22 C9.58172 22 6 18.4183 6 14 C6 9.58172 9.58172 6 14 6 Z M14 10 C11.7909 10 10 11.7909 10 14 C10 16.2091 11.7909 18 14 18 C16.2091 18 18 16.2091 18 14 L15 14 L15 12 L18 12 L18 10 L14 10 Z"
              fill="currentColor"
            />
          </svg>
        </div>
        {/* Subtle glow effect */}
        <div className={`absolute inset-0 ${sizeClasses[size]} rounded-xl bg-gradient-to-br from-slate-500 via-slate-600 to-slate-700 opacity-10 blur-md`}></div>
      </div>
      
      {showText && (
        <div>
          <h1 className={`${textSizeClasses[size]} font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent`}>
            GratChain
          </h1>
          <p className="text-xs text-white/70 -mt-1 font-medium">Onchain Tipping</p>
        </div>
      )}
    </div>
  )
}
