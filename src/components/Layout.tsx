import { ReactNode } from 'react'
import { ConnectButton } from './ConnectButton'
import { Globe } from 'lucide-react'
import { useAccount } from 'wagmi'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  const { address, isConnected } = useAccount()

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-black/20 border-b border-white/10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">GratChain</h1>
            </div>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-8">
              <a 
                href="#creators" 
                className="text-white hover:text-blue-300 transition-colors font-medium"
              >
                Discover Creators
              </a>
              <a 
                href="#top-tippers" 
                className="text-white hover:text-blue-300 transition-colors font-medium"
              >
                Top Tippers
              </a>
              <a 
                href="#about" 
                className="text-white hover:text-blue-300 transition-colors font-medium"
              >
                Our Story
              </a>
            </nav>

            {/* User Section / Connect Button */}
            <div className="flex items-center gap-3">
              {isConnected && address ? (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">😊</span>
                  </div>
                  <span className="text-white font-medium font-mono">
                    {truncateAddress(address)}
                  </span>
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

