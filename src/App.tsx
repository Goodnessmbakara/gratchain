import { useState } from 'react'
import { Layout } from './components/Layout'
import { NetworkGuard } from './components/NetworkGuard'
import { CreatorGrid } from './components/CreatorGrid'
import { useAccount } from 'wagmi'
import { Heart, Zap, Users } from 'lucide-react'
import { creators } from './data/creators'
import { Creator } from './types'
import toast from 'react-hot-toast'

function App() {
  const { isConnected } = useAccount()
  const [loadingCreatorId, setLoadingCreatorId] = useState<string | null>(null)

  const handleTipCreator = async (creator: Creator) => {
    setLoadingCreatorId(creator.id)
    
    // Simulate tipping process (will be replaced with actual tipping logic)
    try {
      // TODO: Implement actual tipping logic with spend permissions
      await new Promise((resolve) => setTimeout(resolve, 2000))
      toast.success(`Successfully tipped ${creator.name}! 🎉`)
    } catch (error) {
      toast.error('Failed to send tip. Please try again.')
      console.error('Tip error:', error)
    } finally {
      setLoadingCreatorId(null)
    }
  }

  return (
    <Layout>
      <NetworkGuard>
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Tip Seamlessly <span className="text-yellow-300">Onchain</span>
          </h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
            Support creators with zero-popup tipping powered by Base. 
            Tip once, tip often—no wallet friction.
          </p>
          
          {!isConnected && (
            <div className="flex justify-center">
              <div className="animate-pulse">
                <p className="text-white/80 mb-4">👆 Connect your wallet to get started</p>
              </div>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center hover:scale-105 transition-transform">
            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-4">
              <Zap className="w-6 h-6 text-blue-300" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Zero Pop-ups</h3>
            <p className="text-white/80 text-sm">
              Tip multiple creators without repeated wallet confirmations
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center hover:scale-105 transition-transform">
            <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
              <Heart className="w-6 h-6 text-purple-300" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Batch Tipping</h3>
            <p className="text-white/80 text-sm">
              Tip multiple creators in a single transaction
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center hover:scale-105 transition-transform">
            <div className="w-12 h-12 rounded-full bg-pink-500/20 flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-pink-300" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Support Creators</h3>
            <p className="text-white/80 text-sm">
              Empower artists, devs, and writers with onchain value
            </p>
          </div>
        </div>

        {/* Creators Section */}
        {isConnected ? (
          <div className="mb-16">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-white mb-2">Featured Creators</h3>
              <p className="text-white/70">
                Discover amazing creators building on Base
              </p>
            </div>
            <CreatorGrid
              creators={creators}
              onTipCreator={handleTipCreator}
              loadingCreatorId={loadingCreatorId}
            />
            <div className="mt-8 text-center">
              <p className="text-white/60 text-sm">
                ⚠️ Spend permissions coming soon! Currently simulating tips.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-12 text-center max-w-2xl mx-auto">
            <h3 className="text-3xl font-bold text-white mb-4">
              Connect to See Creators
            </h3>
            <p className="text-white/80">
              Connect your wallet to discover and tip amazing creators on Base.
            </p>
          </div>
        )}
      </NetworkGuard>
    </Layout>
  )
}

export default App

