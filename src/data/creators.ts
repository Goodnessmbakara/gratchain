import { Creator } from '../types'

// Mock creator data for MVP
// In production, this would come from an API or onchain registry
export const creators: Creator[] = [
  {
    id: 'creator-1',
    name: 'Alex Chen',
    username: '@alexbuilds',
    walletAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1',
    bio: 'Building the future of decentralized social. Open source enthusiast and Base advocate.',
    avatar: 'https://i.pravatar.cc/150?img=1',
    category: 'developer',
    socials: {
      twitter: 'alexbuilds',
      github: 'alexchen',
    },
  },
  {
    id: 'creator-2',
    name: 'Maya Rodriguez',
    username: '@mayaart',
    walletAddress: '0x8d12A197cB00D4747a1fe03395095ce2A5CC6819',
    bio: 'Digital artist exploring the intersection of AI and blockchain. NFT creator.',
    avatar: 'https://i.pravatar.cc/150?img=5',
    category: 'artist',
    socials: {
      twitter: 'mayaart',
      farcaster: 'maya',
    },
  },
  {
    id: 'creator-3',
    name: 'Dev Patel',
    username: '@devonchain',
    walletAddress: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
    bio: 'Smart contract security researcher. Making onchain safer, one audit at a time.',
    avatar: 'https://i.pravatar.cc/150?img=12',
    category: 'developer',
    socials: {
      twitter: 'devonchain',
      github: 'devpatel',
    },
  },
  {
    id: 'creator-4',
    name: 'Luna Brooks',
    username: '@lunawrits',
    walletAddress: '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
    bio: 'Web3 writer and educator. Simplifying crypto for everyone. Check out my newsletter!',
    avatar: 'https://i.pravatar.cc/150?img=9',
    category: 'writer',
    socials: {
      twitter: 'lunawrits',
      farcaster: 'luna',
    },
  },
  {
    id: 'creator-5',
    name: 'Sam Johnson',
    username: '@samcodes',
    walletAddress: '0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65',
    bio: 'Full-stack dev building cool apps on Base. Creator of popular DeFi tools.',
    avatar: 'https://i.pravatar.cc/150?img=33',
    category: 'developer',
    socials: {
      github: 'samjohnson',
      twitter: 'samcodes',
    },
  },
  {
    id: 'creator-6',
    name: 'Zara Kim',
    username: '@zara3d',
    walletAddress: '0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc',
    bio: '3D artist and metaverse builder. Creating immersive onchain experiences.',
    avatar: 'https://i.pravatar.cc/150?img=20',
    category: 'artist',
    socials: {
      twitter: 'zara3d',
    },
  },
  {
    id: 'creator-7',
    name: 'Marcus Lee',
    username: '@marcusmusic',
    walletAddress: '0x976EA74026E726554dB657fA54763abd0C3a0aa9',
    bio: 'Electronic music producer. Releasing music as NFTs. Support independent artists!',
    avatar: 'https://i.pravatar.cc/150?img=68',
    category: 'other',
    socials: {
      twitter: 'marcusmusic',
      farcaster: 'marcus',
    },
  },
  {
    id: 'creator-8',
    name: 'Priya Singh',
    username: '@priyateaches',
    walletAddress: '0x14dC79964da2C08b23698B3D3cc7Ca32193d9955',
    bio: 'Educator creating free blockchain courses. Teaching the next generation of builders.',
    avatar: 'https://i.pravatar.cc/150?img=45',
    category: 'other',
    socials: {
      twitter: 'priyateaches',
      github: 'priyasingh',
    },
  },
]

// Helper function to get creator by wallet address
export const getCreatorByAddress = (address: string): Creator | undefined => {
  return creators.find(
    (creator) => creator.walletAddress.toLowerCase() === address.toLowerCase()
  )
}

// Helper function to get creators by category
export const getCreatorsByCategory = (category: Creator['category']): Creator[] => {
  return creators.filter((creator) => creator.category === category)
}

