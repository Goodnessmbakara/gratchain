import { ReactNode } from 'react'
import { ConnectButton } from './ConnectButton'
import { Logo } from './Logo'
import { useAccount, useDisconnect } from 'wagmi'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-black/30 border-b border-white/20 shadow-2xl navbar-glass">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Logo size="md" showText={true} />

            {/* Navigation Links */}
            <nav className="hidden lg:flex items-center gap-8">
              <a 
                href="#creators" 
                className="text-white/90 hover:text-white transition-all duration-300 font-medium text-sm uppercase tracking-wide hover:scale-105 relative group"
              >
                Discover Creators
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a 
                href="#top-tippers" 
                className="text-white/90 hover:text-white transition-all duration-300 font-medium text-sm uppercase tracking-wide hover:scale-105 relative group"
              >
                Top Tippers
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a 
                href="#about" 
                className="text-white/90 hover:text-white transition-all duration-300 font-medium text-sm uppercase tracking-wide hover:scale-105 relative group"
              >
                Our Story
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-400 to-orange-400 transition-all duration-300 group-hover:w-full"></span>
              </a>
            </nav>

            {/* User Section / Connect Button */}
            <div className="flex items-center gap-4">
              {isConnected && address ? (
                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    </div>
                    <span className="text-white font-medium text-sm font-mono">
                      {truncateAddress(address)}
                    </span>
                  </div>
                  <button
                    onClick={() => disconnect()}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl border border-white/20 text-white font-medium text-sm transition-all duration-300 hover:scale-105"
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <ConnectButton />
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-white/10 backdrop-blur-md bg-black/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-white/80 text-sm">
            <p>
              Built for{' '}
              <a 
                href="https://base.org" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:underline font-semibold"
              >
                Base Builder Quest 11
              </a>
            </p>
            <div className="flex gap-6">
              <a 
                href="https://github.com/yourusername/gratchain" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                GitHub
              </a>
              <a 
                href="https://docs.base.org" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                Base Docs
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

