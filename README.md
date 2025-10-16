# GratChain

**Seamless Onchain Tipping on Base**

GratChain is an onchain tipping app built for Base Builder Quest 11. It leverages Spend Permissions (via CDP SDK) to enable frictionless, zero-popup tipping for creators.

## Features

- 🚀 **Zero-Popup Tipping**: Tip multiple creators without repeated wallet confirmations
- 💰 **Spend Permissions**: One-time setup for seamless recurring tips
- 📦 **Batch Tipping**: Tip multiple creators in a single transaction
- 🎨 **Beautiful UI**: Vibey, modern design with smooth animations
- ⚡ **Built on Base**: Fast and low-cost transactions

## Tech Stack

- **Frontend**: React + Vite + TypeScript
- **Styling**: Tailwind CSS
- **Onchain**: Wagmi + Viem
- **Wallet Integration**: Coinbase Wallet SDK
- **Network**: Base (Sepolia testnet / Mainnet)

## Getting Started

### Prerequisites

- Node.js >= 18
- pnpm >= 8
- A WalletConnect Project ID ([get one here](https://cloud.walletconnect.com))

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/gratchain.git
cd gratchain

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local and add your VITE_WALLETCONNECT_PROJECT_ID
```

### Development

```bash
# Start the development server
pnpm dev

# Open http://localhost:5173
```

### Build

```bash
# Build for production
pnpm build

# Preview production build
pnpm preview
```

## Environment Variables

Create a `.env.local` file with:

```env
VITE_BASE_CHAIN_ID=84532          # 8453 for mainnet, 84532 for Sepolia
VITE_WALLETCONNECT_PROJECT_ID=    # Your WalletConnect project ID
```

## Deployment

This project is optimized for deployment on Vercel or Netlify.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start)

## Base Builder Quest 11

This project was built for Base Builder Quest 11, showcasing:

- ✅ Sub Accounts (Spend Permissions)
- ✅ Auto Spend Permissions for frictionless UX
- ✅ Real-world utility (tipping creators)
- ✅ Beautiful, production-ready UI

## Documentation

- [PRD](./PRD.md) - Product Requirements Document
- [Build Plan](./BUILD_PLAN.md) - Phased implementation plan

## License

MIT

## Contributing

Contributions welcome! Please open an issue or PR.

---

Built with ❤️ for the Base ecosystem

