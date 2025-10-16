import { http, createConfig } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { coinbaseWallet, walletConnect } from 'wagmi/connectors';

// WalletConnect Project ID
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || '';

export const config = createConfig({
  chains: [baseSepolia, base],
  connectors: [
    coinbaseWallet({
      appName: 'GratChain',
      appLogoUrl: 'https://gratchain.app/logo.png',
      preference: 'all', // Allow both Smart Wallet and EOA
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
  ],
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
  ssr: false,
});

// Export chain for easy access
export { baseSepolia, base };
