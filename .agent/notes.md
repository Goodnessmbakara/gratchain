# GratChain Development Notes

## Phase 0 Complete ✅
- Vite + React + TypeScript initialized
- Dependencies installed: wagmi, viem, @coinbase/wallet-sdk, Tailwind CSS, react-hot-toast, lucide-react
- Tailwind CSS configured with Base brand colors
- Environment configuration prepared

## Phase 1 Complete ✅
- Wagmi configured with Base (Mainnet) and Base Sepolia chains
- Smart wallet preference set for Coinbase Wallet (required for spend permissions)
- ConnectButton component with wallet connection/disconnection
- Layout component with header, footer, and sticky navigation
- NetworkGuard component for chain switching prompts
- App shows hero section with features
- No lint errors

## Key Technical Decisions

### Spend Permissions (not Sub Accounts)
After researching the Base CDP SDK documentation, the correct terminology is **Spend Permissions**, not "Sub Accounts". The PRD mentioned Sub Accounts, but the actual Base/Coinbase SDK uses "Spend Permissions" for the auto-spend functionality.

**How Spend Permissions Work:**
- Smart accounts can delegate spending authority to other accounts
- Permission includes: account, spender, token, allowance, period, start, end
- Uses CDP SDK: `@coinbase/cdp-sdk` or server wallet API
- Requires smart wallet (Coinbase Wallet with `preference: 'smartWalletOnly'`)

**Implementation Approach:**
1. User connects with Coinbase Wallet (smart wallet)
2. Create spend permission via CDP SDK
3. App (as spender) can execute transactions within permission constraints
4. No wallet pop-ups for subsequent tips

### Wallet Configuration
- **Coinbase Wallet**: Set to `smartWalletOnly` preference (required for spend permissions)
- **WalletConnect**: Included for broader compatibility
- **Injected**: For MetaMask and other browser wallets

### Chain Configuration
- Development: Base Sepolia (84532)
- Production: Base Mainnet (8453)
- Controlled via `VITE_BASE_CHAIN_ID` environment variable

## Next Steps

### Phase 2: Spend Permission Integration
Need to implement:
1. CDP SDK client initialization
2. Smart account detection/creation
3. Spend permission creation flow
4. Permission status checking
5. Auto-funding logic
6. Permission modal UI

**Blocker:** Need to determine if we use:
- CDP SDK directly (`@coinbase/cdp-sdk`) - requires server setup
- Client-side SDK with smart wallet capabilities
- Coinbase Wallet SDK built-in spend permission APIs

**Action:** Research @coinbase/wallet-sdk capabilities for spend permissions in browser context.

### Phase 3: Creator System
- Define 8-10 mock creators with wallets
- CreatorCard component
- CreatorGrid layout
- Profile modal

### Phase 4: Tipping Functionality
- Send single tip via spend permission
- Batch tipping
- Transaction status tracking
- Success/error handling

## Important Notes
- PRD timeline estimates 30-35 hours total
- Currently at: ~4 hours (Phases 0 & 1)
- Remaining: ~26-31 hours for Phases 2-8

