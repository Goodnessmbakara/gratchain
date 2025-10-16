import { http, createConfig } from 'wagmi'
import { base, baseSepolia } from 'wagmi/chains'
import { coinbaseWallet, walletConnect, injected } from 'wagmi/connectors'

// Get chain ID from environment (default to Sepolia for development)
const chainId = import.meta.env.VITE_BASE_CHAIN_ID 
  ? parseInt(import.meta.env.VITE_BASE_CHAIN_ID) 
  : 84532

// Select appropriate chain based on environment
const targetChain = chainId === 8453 ? base : baseSepolia

// WalletConnect Project ID
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || ''

export const config = createConfig({
  chains: [targetChain],
  connectors: [
    coinbaseWallet({
      appName: 'GratChain',
      appLogoUrl: 'https://gratchain.app/logo.png',
      preference: 'smartWalletOnly', // Use smart wallets for spend permissions
    }),
    walletConnect({ 
      projectId,
      metadata: {
        name: 'GratChain',
        description: 'Seamless Onchain Tipping on Base',
        url: 'https://gratchain.app',
        icons: ['https://gratchain.app/logo.png'],
      },
    }),
    injected(),
  ],
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
  ssr: false,
})

// Export chain for easy access
export { targetChain }

