import { ReactNode } from 'react'
import { ConnectButton } from './ConnectButton'
import { Zap } from 'lucide-react'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/10 border-b border-white/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">GratChain</h1>
                <p className="text-xs text-white/80 -mt-1">Seamless Tipping</p>
              </div>
            </div>

            {/* Connect Button */}
            <ConnectButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-white/20 backdrop-blur-md bg-white/5">
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

