import { Creator } from '../types'
import { Heart, Github, Twitter } from 'lucide-react'
import { useState } from 'react'

interface CreatorCardProps {
  creator: Creator
  onTip?: (creator: Creator) => void
  isLoading?: boolean
}

export function CreatorCard({ creator, onTip, isLoading }: CreatorCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const handleTipClick = () => {
    if (onTip && !isLoading) {
      onTip(creator)
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'developer':
        return 'bg-blue-500/20 text-blue-300'
      case 'artist':
        return 'bg-purple-500/20 text-purple-300'
      case 'writer':
        return 'bg-green-500/20 text-green-300'
      default:
        return 'bg-pink-500/20 text-pink-300'
    }
  }

  return (
    <div
      className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 transition-all hover:scale-105 hover:shadow-2xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Avatar and Name */}
      <div className="flex items-start gap-4 mb-4">
        <img
          src={creator.avatar}
          alt={creator.name}
          className="w-16 h-16 rounded-full border-2 border-white/30"
        />
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold text-white truncate">{creator.name}</h3>
          <p className="text-white/70 text-sm">{creator.username}</p>
          <span
            className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-semibold ${getCategoryColor(
              creator.category
            )}`}
          >
            {creator.category}
          </span>
        </div>
      </div>

      {/* Bio */}
      <p className="text-white/80 text-sm mb-4 line-clamp-3">{creator.bio}</p>

      {/* Socials */}
      {creator.socials && (
        <div className="flex gap-2 mb-4">
          {creator.socials.twitter && (
            <a
              href={`https://twitter.com/${creator.socials.twitter}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              aria-label={`${creator.name} on Twitter`}
            >
              <Twitter className="w-4 h-4 text-white" />
            </a>
          )}
          {creator.socials.github && (
            <a
              href={`https://github.com/${creator.socials.github}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              aria-label={`${creator.name} on GitHub`}
            >
              <Github className="w-4 h-4 text-white" />
            </a>
          )}
          {creator.socials.farcaster && (
            <a
              href={`https://warpcast.com/${creator.socials.farcaster}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white text-xs font-bold"
              aria-label={`${creator.name} on Farcaster`}
            >
              FC
            </a>
          )}
        </div>
      )}

      {/* Tip Button */}
      <button
        onClick={handleTipClick}
        disabled={isLoading || !onTip}
        className={`w-full py-3 rounded-full font-semibold transition-all flex items-center justify-center gap-2 ${
          isLoading
            ? 'bg-gray-500/50 cursor-not-allowed'
            : 'bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white shadow-lg'
        } ${isHovered && !isLoading ? 'animate-pulse-slow' : ''}`}
      >
        <Heart className={`w-5 h-5 ${isLoading ? 'animate-pulse' : ''}`} />
        <span>{isLoading ? 'Tipping...' : 'Tip 0.001 ETH'}</span>
      </button>

      {/* Wallet Address (truncated) */}
      <p className="text-white/50 text-xs text-center mt-3 font-mono">
        {creator.walletAddress.slice(0, 6)}...{creator.walletAddress.slice(-4)}
      </p>
    </div>
  )
}

