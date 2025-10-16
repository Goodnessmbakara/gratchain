import { useState } from 'react'
import { Layout } from './components/Layout'
import { NetworkGuard } from './components/NetworkGuard'
import { CreatorGrid } from './components/CreatorGrid'
import { useAccount } from 'wagmi'
import { Lightning, HeartStraight, UsersThree, Fish, Wrench, Heart } from 'phosphor-react'
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
        <div className="relative text-center mb-16">
          {/* Background Image */}
          <div className="absolute inset-0 -z-10">
            <img 
              src="/images/hero-bg-animated.svg" 
              alt="Abstract geometric background"
              className="w-full h-full object-cover opacity-25"
            />
            {/* Gradient overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-transparent to-slate-900/70"></div>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Tip Seamlessly <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Onchain</span>
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
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 text-center hover:scale-105 transition-all duration-300 hover:bg-white/10">
            <div className="w-12 h-12 rounded-full bg-slate-600/30 flex items-center justify-center mx-auto mb-4">
              <Lightning className="w-6 h-6 text-slate-300" weight="duotone" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Zero Pop-ups</h3>
            <p className="text-white/70 text-sm">
              Tip multiple creators without repeated wallet confirmations
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 text-center hover:scale-105 transition-all duration-300 hover:bg-white/10">
            <div className="w-12 h-12 rounded-full bg-slate-600/30 flex items-center justify-center mx-auto mb-4">
              <HeartStraight className="w-6 h-6 text-slate-300" weight="duotone" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Batch Tipping</h3>
            <p className="text-white/70 text-sm">
              Tip multiple creators in a single transaction
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 text-center hover:scale-105 transition-all duration-300 hover:bg-white/10">
            <div className="w-12 h-12 rounded-full bg-slate-600/30 flex items-center justify-center mx-auto mb-4">
              <UsersThree className="w-6 h-6 text-slate-300" weight="duotone" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Support Creators</h3>
            <p className="text-white/70 text-sm">
              Empower artists, devs, and writers with onchain value
            </p>
          </div>
        </div>

        {/* Creators Section */}
        {isConnected ? (
          <div id="creators" className="mb-16 scroll-mt-20">
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
          <div id="creators" className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-12 text-center max-w-2xl mx-auto scroll-mt-20">
            <h3 className="text-3xl font-bold text-white mb-4">
              Connect to See Creators
            </h3>
            <p className="text-white/70">
              Connect your wallet to discover and tip amazing creators on Base.
            </p>
          </div>
        )}

        {/* Top Tippers Section */}
        <div id="top-tippers" className="mb-16 scroll-mt-20">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-white mb-2">Top Tippers</h3>
            <p className="text-white/70">Community members supporting creators</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { name: "CryptoWhale", tips: "12.5 ETH", icon: Fish },
              { name: "BaseBuilder", tips: "8.3 ETH", icon: Wrench },
              { name: "CreatorFan", tips: "6.7 ETH", icon: Heart }
            ].map((tipper, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-all duration-300">
                <div className="w-16 h-16 rounded-full bg-slate-600/30 flex items-center justify-center mx-auto mb-4">
                  <tipper.icon className="w-8 h-8 text-slate-300" weight="duotone" />
                </div>
                <h4 className="text-xl font-bold text-white mb-1">{tipper.name}</h4>
                <p className="text-emerald-400 font-semibold">{tipper.tips} tipped</p>
              </div>
            ))}
          </div>
        </div>

        {/* About Section */}
        <div id="about" className="mb-16 scroll-mt-20">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-12 text-center max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold text-white mb-6">Our Story</h3>
            <p className="text-white/70 text-lg leading-relaxed mb-6">
              GratChain was born from the vision of frictionless onchain tipping. 
              We believe creators deserve seamless support from their communities, 
              without the barriers of repeated wallet confirmations.
            </p>
            <p className="text-white/70 text-lg leading-relaxed">
              Built on Base with Spend Permissions, we're pioneering the future 
              of creator monetization—where supporting your favorite artists, 
              developers, and writers feels as easy as a social media like.
            </p>
          </div>
        </div>
      </NetworkGuard>
    </Layout>
  )
}

export default App

