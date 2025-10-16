// Creator data types
export interface Creator {
  id: string
  name: string
  username: string
  walletAddress: `0x${string}`
  bio: string
  avatar: string
  category: 'artist' | 'developer' | 'writer' | 'other'
  socials?: {
    twitter?: string
    farcaster?: string
    github?: string
  }
}

// Tip transaction types
export interface Tip {
  id: string
  from: `0x${string}`
  to: `0x${string}`
  amount: string
  txHash: string
  timestamp: number
  creatorName?: string
}

// Spend permission types (from CDP SDK)
export interface SpendPermission {
  account: `0x${string}`
  spender: `0x${string}`
  token: `0x${string}` | 'eth' | 'usdc'
  allowance: bigint
  period: number
  start: number
  end: number
  salt: bigint
  extraData?: string
}

// UI state types
export interface TipState {
  isLoading: boolean
  error: string | null
  success: boolean
  txHash?: string
}

