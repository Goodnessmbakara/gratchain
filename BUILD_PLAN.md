# GratChain Build Plan - Phased Execution

**Reference Document:** [PRD.md](./PRD.md)  
**Target:** Base Builder Quest 11 - Functional MVP with Demo  
**Timeline:** 1-2 days (aggressive but achievable)

---

## Phase 0: Research & Project Setup

**Goal:** Establish development environment and gather critical technical context

### Tasks

1. **Research Base Account SDK** ⏱️ 30-45 min
   - [ ] Use Context7 MCP to fetch latest Base SDK docs (`/coinbase/wallet-sdk` or `/base-org/account`)
   - [ ] Review Sub Accounts guide: https://docs.base.org/base-account/improve-ux/sub-accounts
   - [ ] Study Auto Spend Permissions API
   - [ ] Review official demo repos (if any) on Base GitHub
   - [ ] Document SDK version, key APIs (`wallet_sendCalls`, permission schemas)

2. **Initialize Vite + React Project** ⏱️ 10 min
   - [ ] Run: `pnpm create vite@latest . --template react`
   - [ ] Verify Node/pnpm versions (Node ≥18, pnpm ≥8)
   - [ ] Initialize git: `git init && git add . && git commit -m "chore: init vite react project"`
   - [ ] Create `.gitignore` (ensure `node_modules`, `.env`, `dist` excluded)

3. **Install Core Dependencies** ⏱️ 10 min
   - [ ] Onchain: `pnpm add viem wagmi @wagmi/core @wagmi/connectors`
   - [ ] Base SDK: `pnpm add @coinbase/wallet-sdk` (or `@base-org/account` if exists)
   - [ ] UI: `pnpm add tailwindcss postcss autoprefixer`
   - [ ] Utils: `pnpm add react-hot-toast lucide-react`
   - [ ] Dev: `pnpm add -D @types/node`

4. **Configure Tailwind CSS** ⏱️ 10 min
   - [ ] Run: `pnpm dlx tailwindcss init -p`
   - [ ] Update `tailwind.config.js` with content paths
   - [ ] Add Tailwind directives to `src/index.css`
   - [ ] Test with gradient utility classes

5. **Environment Configuration** ⏱️ 5 min
   - [ ] Create `.env.local` with:
     - `VITE_BASE_CHAIN_ID=8453` (mainnet) or `84532` (Sepolia)
     - `VITE_WALLETCONNECT_PROJECT_ID=<your-id>`
     - `VITE_PAYMASTER_URL=<optional>`
   - [ ] Add `.env.example` template to repo

**Deliverables:**
- ✅ Running Vite dev server (`pnpm dev`)
- ✅ Tailwind CSS working
- ✅ SDK documentation notes in `.agent/` folder
- ✅ Git initialized with initial commit

**Success Criteria:**
- Hot reload works
- No console errors on blank app
- Tailwind gradients render correctly

---

## Phase 1: Core Infrastructure & Wallet Integration

**Goal:** Establish wallet connection with Base chain support

### Tasks

1. **Configure wagmi & Base Chain** ⏱️ 30 min
   - [ ] Create `src/config/wagmi.ts`:
     - Define Base Mainnet/Sepolia chain configs
     - Set up WalletConnect, Coinbase Wallet, Injected connectors
     - Export wagmi config with transports
   - [ ] Wrap app in `<WagmiProvider>` and `<QueryClientProvider>` in `main.tsx`

2. **Build Wallet Connect UI** ⏱️ 45 min
   - [ ] Create `src/components/ConnectButton.tsx`:
     - Use `useAccount`, `useConnect`, `useDisconnect` hooks
     - Display address (truncated) when connected
     - Show "Connect Wallet" button when disconnected
     - Add loading states during connection
   - [ ] Style with Tailwind (gradient button, hover effects)

3. **Create App Layout** ⏱️ 30 min
   - [ ] Create `src/components/Layout.tsx`:
     - Header with logo + ConnectButton
     - Main content area
     - Footer with quest disclaimer
   - [ ] Update `src/App.tsx` to use Layout

4. **Network Guard Component** ⏱️ 20 min
   - [ ] Create `src/components/NetworkGuard.tsx`:
     - Check if connected to Base (chain ID 8453 or 84532)
     - Show "Switch to Base" prompt if wrong network
     - Use `useSwitchChain` hook for network switching

**Deliverables:**
- ✅ Functional wallet connection (MetaMask, Coinbase Wallet, WalletConnect)
- ✅ Base chain auto-switching
- ✅ Responsive header with connect button

**Success Criteria:**
- Connect/disconnect works smoothly
- Address displays correctly
- Chain switching prompts appear on wrong network

---

## Phase 2: Sub Account Integration

**Goal:** Implement Sub Account creation and Auto Spend Permissions

### Tasks

1. **Research Sub Account SDK APIs** ⏱️ 30 min
   - [ ] Use Context7 to get latest Sub Account implementation examples
   - [ ] Identify exact methods for:
     - Creating Sub Account from parent account
     - Requesting Auto Spend permissions
     - Checking Sub Account balance
     - Funding Sub Account from parent
   - [ ] Document function signatures and return types

2. **Create Sub Account Service** ⏱️ 60 min
   - [ ] Create `src/services/subAccount.ts`:
     - `createSubAccount(parentAddress)` → returns Sub Account address
     - `requestAutoSpendPermission(amount, duration)` → grants permissions
     - `getSubAccountBalance(subAccountAddress)` → returns balance
     - `fundSubAccount(subAccountAddress, amount)` → transfers from parent
   - [ ] Add proper error handling and logging
   - [ ] Use `wallet_sendCalls` for batch operations

3. **Sub Account Hook** ⏱️ 45 min
   - [ ] Create `src/hooks/useSubAccount.ts`:
     - State: `subAccountAddress`, `hasPermission`, `isLoading`, `error`
     - Effects: Auto-create Sub Account on wallet connect
     - Methods: `requestPermissions()`, `fundAccount()`, `refreshBalance()`
   - [ ] Integrate with wagmi hooks (`useAccount`, `useWalletClient`)

4. **Permission Setup Modal** ⏱️ 60 min
   - [ ] Create `src/components/PermissionModal.tsx`:
     - Show on first connect (if no permissions)
     - Explain Auto Spend benefits (no pop-ups)
     - Input: Permission amount (default 0.1 ETH), duration (default 30 days)
     - Buttons: "Grant Permissions", "Skip" (show warning)
     - Success state with checkmark animation
   - [ ] Trigger modal from `useSubAccount` hook

5. **Sub Account Status Display** ⏱️ 30 min
   - [ ] Create `src/components/SubAccountStatus.tsx`:
     - Display Sub Account address (truncated, with copy button)
     - Show balance with "Fund" button if low
     - Permission expiry countdown
     - Visual indicators (green = ready, yellow = low balance, red = no permission)

**Deliverables:**
- ✅ Auto-created Sub Account on wallet connect
- ✅ Working permission grant flow
- ✅ Sub Account balance tracking
- ✅ Funding mechanism from parent account

**Success Criteria:**
- Sub Account created without errors
- Permissions granted in single transaction
- Balance updates correctly
- No wallet pop-ups for subsequent operations

---

## Phase 3: Creator System

**Goal:** Build creator data structure and UI components

### Tasks

1. **Define Creator Data Model** ⏱️ 15 min
   - [ ] Create `src/types/index.ts`:
     ```typescript
     export interface Creator {
       id: string;
       name: string;
       username: string;
       walletAddress: `0x${string}`;
       bio: string;
       avatar: string;
       category: 'artist' | 'developer' | 'writer' | 'other';
       socials?: {
         twitter?: string;
         farcaster?: string;
         github?: string;
       };
     }
     ```

2. **Create Mock Creator Data** ⏱️ 20 min
   - [ ] Create `src/data/creators.ts`:
     - 8-10 diverse creators with realistic data
     - Mix of categories (artists, devs, writers)
     - Valid Base addresses (can be test wallets)
     - High-quality avatars (use placeholders or Lorem Picsum)

3. **Creator Card Component** ⏱️ 60 min
   - [ ] Create `src/components/CreatorCard.tsx`:
     - Props: `creator`, `onTip`, `isLoading`
     - Layout: Avatar, Name, @username, Bio (truncated), Tip button
     - Tip button: Gradient, pulse animation, loading spinner
     - Hover effect: Scale + shadow
     - Mobile responsive (stack on small screens)
   - [ ] Style with Tailwind + custom CSS for animations

4. **Creator Grid Component** ⏱️ 30 min
   - [ ] Create `src/components/CreatorGrid.tsx`:
     - Props: `creators`, `onTipCreator`
     - Responsive grid (1 col mobile, 2 col tablet, 3-4 col desktop)
     - Filter/search bar (optional for MVP)
     - Empty state if no creators

5. **Creator Profile Modal** ⏱️ 45 min
   - [ ] Create `src/components/CreatorProfile.tsx`:
     - Expanded view with full bio, social links
     - Tip history for this creator (if available)
     - Shareable link copy button
     - Close button + backdrop click to dismiss

**Deliverables:**
- ✅ 8-10 creator profiles with mock data
- ✅ Beautiful, responsive creator cards
- ✅ Grid layout with hover effects
- ✅ Profile modal for detailed view

**Success Criteria:**
- Cards look polished and professional
- Grid is responsive across all breakpoints
- Animations are smooth (60fps)
- Data structure is easily extensible

---

## Phase 4: Tipping Functionality

**Goal:** Implement single and batch tipping with Sub Account

### Tasks

1. **Tipping Service** ⏱️ 60 min
   - [ ] Create `src/services/tipping.ts`:
     - `sendTip(subAccount, recipientAddress, amount)` → sends ETH via Sub Account
     - `sendBatchTips(subAccount, recipients[], amounts[])` → uses `wallet_sendCalls`
     - `estimateGas(recipients[])` → calculates total gas
     - `checkBalance(subAccount, totalAmount)` → validates sufficient funds
   - [ ] Integrate with viem for transaction building
   - [ ] Add detailed console logging for debugging

2. **Tip Amount Selector** ⏱️ 30 min
   - [ ] Create `src/components/TipAmountSelector.tsx`:
     - Preset amounts: 0.001, 0.005, 0.01, 0.05 ETH (buttons)
     - Custom amount input (with validation)
     - Display USD equivalent (use ETH price feed or mock)
     - Selected state styling

3. **Single Tip Flow** ⏱️ 60 min
   - [ ] Update `CreatorCard.tsx` tip button:
     - On click → Show `TipAmountSelector` popover
     - On amount select → Call `sendTip()`
     - Show inline loading state (spinner replaces button text)
     - Success: Toast notification + confetti animation (optional)
     - Error: Toast with clear message + retry button
   - [ ] Handle edge cases:
     - Insufficient Sub Account balance → Auto-fund prompt
     - No permissions → Redirect to permission modal
     - Network errors → Retry mechanism

4. **Batch Tipping UI** ⏱️ 60 min
   - [ ] Create `src/components/BatchTipControls.tsx`:
     - Checkbox on each creator card for batch selection
     - "Select All" / "Deselect All" buttons
     - Bottom sticky bar showing: Selected count, Total amount, "Tip All" button
     - Confirm modal before batch send (list selected creators)
   - [ ] Integrate with `sendBatchTips()` service

5. **Transaction Confirmation** ⏱️ 45 min
   - [ ] Create `src/components/TxConfirmation.tsx`:
     - Display tx hash (link to Base block explorer)
     - Show status: Pending → Confirmed → Finalized
     - List of recipients and amounts
     - "View on BaseScan" button
     - Auto-close after confirmation (with option to keep open)

6. **Auto-Fund Logic** ⏱️ 30 min
   - [ ] Enhance `useSubAccount` hook:
     - Before each tip, check Sub Account balance
     - If balance < tip amount + gas, trigger `fundSubAccount()`
     - Show "Funding Sub Account..." toast during fund tx
     - Retry tip automatically after funding succeeds

**Deliverables:**
- ✅ Single-click tipping (no pop-ups after permissions)
- ✅ Batch tipping for multiple creators
- ✅ Auto-funding from parent account
- ✅ Real-time transaction status

**Success Criteria:**
- Tips process in <5 seconds on Sepolia
- Batch tips combine into single transaction
- Auto-funding works seamlessly
- Error states are user-friendly

---

## Phase 5: UI/UX Polish & Design System

**Goal:** Create vibey, modern design that matches Base aesthetic

### Tasks

1. **Design System Setup** ⏱️ 45 min
   - [ ] Create `src/styles/theme.ts`:
     - Color palette: Base blue (#0052FF), gradients (blue → purple)
     - Typography scale (heading, body, caption sizes)
     - Spacing scale (4, 8, 12, 16, 24, 32, 48px)
     - Border radius values
     - Shadow presets (subtle, medium, large)
   - [ ] Extend Tailwind config with custom colors/utilities

2. **Hero Section** ⏱️ 60 min
   - [ ] Create `src/components/Hero.tsx`:
     - Headline: "Tip Seamlessly Onchain" (large, bold)
     - Subheading: "Support creators with zero-popup tipping powered by Base" (medium)
     - CTA: "Connect & Start Tipping" button (large, gradient, animated)
     - Background: Animated gradient or subtle pattern
     - Stats bar: Total tips sent, Creators supported (mock or real)
   - [ ] Add subtle parallax or fade-in animation on scroll

3. **Loading States** ⏱️ 30 min
   - [ ] Create `src/components/LoadingState.tsx`:
     - Skeleton loaders for creator cards (pulsing rectangles)
     - Spinner component (Base blue, smooth rotation)
     - Progress bar for batch operations
   - [ ] Apply to all async operations

4. **Toast Notifications** ⏱️ 30 min
   - [ ] Configure `react-hot-toast` in `main.tsx`:
     - Custom styling (Base colors, rounded corners)
     - Success: Green with checkmark icon
     - Error: Red with X icon
     - Info: Blue with i icon
     - Position: Bottom-center (mobile-friendly)
   - [ ] Create helper: `src/utils/toast.ts` with preset messages

5. **Animations & Micro-interactions** ⏱️ 60 min
   - [ ] Tip button: Pulse effect (scale 1.05 on hover, subtle glow)
   - [ ] Success animation: Confetti burst on tip success (use `canvas-confetti` lib)
   - [ ] Card hover: Lift effect (translateY + shadow increase)
   - [ ] Modal transitions: Fade + slide from bottom
   - [ ] Number counters: Animate balance/tip count changes

6. **Responsive Design Audit** ⏱️ 30 min
   - [ ] Test on:
     - Mobile (375px, 414px)
     - Tablet (768px, 1024px)
     - Desktop (1280px, 1920px)
   - [ ] Fix layout issues:
     - Stack creator cards on mobile
     - Adjust font sizes for small screens
     - Ensure buttons are touch-friendly (min 44px height)

7. **Dark Mode (Optional)** ⏱️ 45 min
   - [ ] Add dark mode toggle in header
   - [ ] Use Tailwind's `dark:` variants
   - [ ] Persist preference in localStorage

**Deliverables:**
- ✅ Beautiful, cohesive design system
- ✅ Engaging hero section
- ✅ Smooth animations throughout
- ✅ Fully responsive layout
- ✅ Delightful micro-interactions

**Success Criteria:**
- Design feels professional and modern
- Animations run at 60fps on mobile
- No layout shifts or broken elements
- Accessible (keyboard nav, ARIA labels)

---

## Phase 6: History & Analytics

**Goal:** Display tipping history and onchain receipts

### Tasks

1. **Transaction History Service** ⏱️ 60 min
   - [ ] Create `src/services/history.ts`:
     - `getTipsSent(subAccountAddress)` → fetch outgoing transfers from Base API
     - `getTipsReceived(walletAddress)` → fetch incoming transfers
     - Use Base block explorer API or viem's `getLogs` for Transfer events
     - Parse logs into structured `Tip` objects with timestamp, amount, recipient
   - [ ] Add caching to avoid repeated API calls

2. **History Hook** ⏱️ 30 min
   - [ ] Create `src/hooks/useHistory.ts`:
     - State: `tipsSent`, `tipsReceived`, `isLoading`, `error`
     - Auto-fetch on component mount
     - Refresh method for manual updates
     - Filter/sort utilities (by date, amount, recipient)

3. **History Table Component** ⏱️ 60 min
   - [ ] Create `src/components/HistoryTable.tsx`:
     - Columns: Date, Recipient (name + address), Amount (ETH + USD), Tx Hash (link)
     - Responsive: Stack columns on mobile
     - Pagination: Show 10 per page (if >10 tips)
     - Empty state: "No tips yet—start tipping!"
     - Export button (optional): Download CSV

4. **Stats Dashboard** ⏱️ 45 min
   - [ ] Create `src/components/StatsCard.tsx`:
     - Total tips sent (count + ETH amount)
     - Unique creators tipped
     - Average tip size
     - Most recent tip timestamp
   - [ ] Display as grid of stat cards with icons

5. **Integrate History into App** ⏱️ 20 min
   - [ ] Add "History" tab/section to main layout
   - [ ] Show history below creator grid or in separate page
   - [ ] Auto-refresh history after successful tip

**Deliverables:**
- ✅ Transaction history view (sent tips)
- ✅ Stats dashboard with key metrics
- ✅ Links to BaseScan for tx details
- ✅ Responsive table/list

**Success Criteria:**
- History loads in <2 seconds
- All transactions are accurate (match onchain data)
- UI is clear and easy to navigate

---

## Phase 7: Testing & Debugging

**Goal:** Ensure app works reliably on Base Sepolia testnet

### Tasks

1. **Setup Testnet Environment** ⏱️ 20 min
   - [ ] Update `.env.local` to use Sepolia (chain ID 84532)
   - [ ] Get Sepolia ETH from Base faucet: https://portal.cdp.coinbase.com/products/faucet
   - [ ] Create 2-3 test wallets for different roles (tipper, creator)

2. **End-to-End Testing Checklist** ⏱️ 90 min
   - [ ] **Connect Flow:**
     - Connect with MetaMask, Coinbase Wallet, WalletConnect
     - Verify Sub Account created correctly
     - Check network switching prompt on wrong chain
   - [ ] **Permission Flow:**
     - Grant Auto Spend permissions (first-time connect)
     - Verify no wallet pop-ups on subsequent tips
     - Test permission expiry handling
   - [ ] **Tipping Flow:**
     - Send single tip (0.001 ETH) to creator
     - Verify Sub Account auto-funds if balance low
     - Check toast notifications appear
     - Confirm tip on BaseScan Sepolia
   - [ ] **Batch Tipping:**
     - Select 3+ creators
     - Send batch tip (0.003 ETH total)
     - Verify single transaction with multiple calls
     - Check all recipients received funds
   - [ ] **History:**
     - Verify sent tips appear in history
     - Click tx hash link (opens BaseScan)
     - Refresh to update stats
   - [ ] **Error Handling:**
     - Test insufficient parent account balance
     - Test network disconnection during tip
     - Test permission denial
     - Test invalid recipient address

3. **Edge Case Testing** ⏱️ 60 min
   - [ ] Zero-amount tip (should be blocked)
   - [ ] Tip to self (should show warning)
   - [ ] Rapid successive tips (rate limiting?)
   - [ ] Sub Account with exact balance (no buffer for gas)
   - [ ] Wallet disconnect during tip transaction
   - [ ] Browser refresh mid-flow (state persistence)

4. **Performance Testing** ⏱️ 30 min
   - [ ] Measure initial load time (<2s target)
   - [ ] Check bundle size (`pnpm build` → inspect `dist/`)
   - [ ] Test on throttled network (slow 3G)
   - [ ] Monitor memory usage (no leaks)
   - [ ] Lighthouse audit (aim for >90 performance score)

5. **Accessibility Testing** ⏱️ 30 min
   - [ ] Keyboard navigation (Tab through all interactive elements)
   - [ ] Screen reader test (VoiceOver on macOS, NVDA on Windows)
   - [ ] Color contrast check (WCAG AA compliance)
   - [ ] Focus indicators visible on all buttons/inputs

6. **Bug Fixes & Refinements** ⏱️ 60-120 min
   - [ ] Fix any issues found during testing
   - [ ] Add missing error messages
   - [ ] Improve loading state consistency
   - [ ] Polish animations that feel janky

**Deliverables:**
- ✅ Fully tested app on Base Sepolia
- ✅ All critical flows working smoothly
- ✅ Documented known issues (if any)
- ✅ Performance optimizations applied

**Success Criteria:**
- Zero critical bugs
- All user stories from PRD functional
- App feels fast and responsive
- No console errors

---

## Phase 8: Deployment & Submission

**Goal:** Deploy to production and create demo for quest submission

### Tasks

1. **Pre-Deployment Checklist** ⏱️ 30 min
   - [ ] Switch to Base Mainnet in `.env.local` (chain ID 8453)
   - [ ] Run production build: `pnpm build`
   - [ ] Test production build locally: `pnpm preview`
   - [ ] Verify no hardcoded Sepolia addresses/links
   - [ ] Update creator wallet addresses to real addresses (or keep test wallets for demo)

2. **Vercel Deployment** ⏱️ 30 min
   - [ ] Create Vercel account (if needed): https://vercel.com
   - [ ] Install Vercel CLI: `pnpm add -g vercel`
   - [ ] Run: `vercel` (follow prompts)
   - [ ] Add environment variables in Vercel dashboard:
     - `VITE_BASE_CHAIN_ID=8453`
     - `VITE_WALLETCONNECT_PROJECT_ID=<your-id>`
   - [ ] Deploy: `vercel --prod`
   - [ ] Verify live URL works (test on mobile + desktop)

3. **Alternative: Netlify Deployment** ⏱️ 30 min
   - [ ] Create Netlify account: https://netlify.com
   - [ ] Drag-and-drop `dist/` folder to Netlify
   - [ ] Configure build settings (if using git deploy):
     - Build command: `pnpm build`
     - Publish directory: `dist`
   - [ ] Add environment variables in Netlify UI

4. **Custom Domain (Optional)** ⏱️ 15 min
   - [ ] Purchase domain (e.g., gratchain.xyz via Namecheap)
   - [ ] Configure DNS in Vercel/Netlify
   - [ ] Enable HTTPS (auto via Vercel/Netlify)

5. **Demo Video Recording** ⏱️ 60-90 min
   - [ ] Script outline:
     1. Intro: "Hi, I'm [name], introducing GratChain—onchain tipping with zero pop-ups"
     2. Show hero page (before connect)
     3. Connect wallet → Sub Account creation
     4. Grant Auto Spend permissions (one-time)
     5. Tip 1 creator (no pop-up!)
     6. Tip 2nd creator (no pop-up!)
     7. Batch tip 3 creators (single transaction)
     8. Show history with tx hashes
     9. Open BaseScan to verify onchain
     10. Outro: "Built with Base Account SDK—submit for Quest 11"
   - [ ] Tools: Loom (easy, free) or OBS (professional)
   - [ ] Record in 1080p, 1-2 minutes max
   - [ ] Edit: Add captions, trim dead air, add background music (optional)
   - [ ] Export and upload to YouTube/Loom (unlisted or public)

6. **Screenshots for Submission** ⏱️ 20 min
   - [ ] Capture 4-6 high-quality screenshots:
     - Hero page (before connect)
     - Connected state with creator grid
     - Permission modal
     - Tipping in action (loading state)
     - Success notification
     - History/stats view
   - [ ] Use browser dev tools to capture exact viewport (1280×720)
   - [ ] Annotate with arrows/text if needed

7. **README & Documentation** ⏱️ 30 min
   - [ ] Create `README.md`:
     - Project title + one-liner
     - Features list (Sub Accounts, Auto Spend, batch tips)
     - Tech stack
     - Setup instructions (`pnpm install`, `pnpm dev`)
     - Environment variables needed
     - Deployment link
     - Demo video link
     - Quest submission note
   - [ ] Add license (MIT or Apache 2.0)
   - [ ] Create `CONTRIBUTING.md` (optional, for post-quest)

8. **Quest Submission** ⏱️ 20 min
   - [ ] Navigate to Base Builder Quest 11 submission form/thread
   - [ ] Fill required fields:
     - Project name: GratChain
     - Live URL: https://gratchain.vercel.app
     - GitHub repo: https://github.com/[username]/gratchain
     - Demo video URL: https://youtu.be/[video-id]
     - Description: "Frictionless onchain tipping with Sub Accounts and Auto Spend Permissions. Tip creators multiple times without wallet pop-ups—built for Base."
   - [ ] Attach screenshots
   - [ ] Submit and tweet/share (optional)

9. **Post-Deployment Monitoring** ⏱️ Ongoing
   - [ ] Monitor Vercel Analytics (if enabled)
   - [ ] Check for console errors in production (use LogRocket or Sentry)
   - [ ] Respond to feedback from quest reviewers

**Deliverables:**
- ✅ Live production app on Vercel/Netlify
- ✅ 1-2 min demo video showing seamless tipping
- ✅ Professional README
- ✅ Quest submission completed
- ✅ GitHub repo public and polished

**Success Criteria:**
- App loads on production without errors
- Demo clearly shows zero-popup UX
- Submission includes all required materials
- Quest reviewers can test app successfully

---

## Summary Timeline

| Phase | Estimated Time | Cumulative |
|-------|---------------|------------|
| Phase 0: Research & Setup | 1-1.5 hours | 1.5 hours |
| Phase 1: Core Infrastructure | 2-2.5 hours | 4 hours |
| Phase 2: Sub Account Integration | 3.5-4 hours | 8 hours |
| Phase 3: Creator System | 3-3.5 hours | 11 hours |
| Phase 4: Tipping Functionality | 4.5-5 hours | 16 hours |
| Phase 5: UI/UX Polish | 4-5 hours | 21 hours |
| Phase 6: History & Analytics | 3.5-4 hours | 25 hours |
| Phase 7: Testing & Debugging | 5-6 hours | 31 hours |
| Phase 8: Deployment & Submission | 3.5-4.5 hours | 35 hours |

**Total Estimated Time:** 30-35 hours (3-4 full days or 1 week part-time)

---

## Critical Path

These tasks MUST be completed in order and cannot be parallelized:

1. Phase 0 → Phase 1 (need setup before wallet integration)
2. Phase 1 → Phase 2 (need wallet before Sub Account)
3. Phase 2 → Phase 4 (need Sub Account before tipping)
4. Phase 4 → Phase 7 (need tipping before testing)
5. Phase 7 → Phase 8 (need testing before deployment)

**Parallelizable work:**
- Phase 3 (Creator System) can start alongside Phase 2
- Phase 5 (UI/UX) can happen alongside Phase 6 (History)

---

## Risk Mitigation

| Risk | Mitigation Strategy |
|------|---------------------|
| Base SDK documentation unclear | Use Context7 MCP + GitHub code search for examples |
| Sub Account creation fails | Test on Sepolia first; have fallback to standard wallet |
| Quest deadline pressure | Focus on core features first (Phases 0-4, 7-8); skip Phase 6 if time-constrained |
| Deployment issues | Test production build locally before deploying |
| Demo video quality | Practice run before recording; use script |

---

## Next Steps

1. ✅ Review this plan with stakeholder (you!)
2. ✅ Begin Phase 0 immediately
3. ✅ Track progress by checking off tasks
4. ✅ Update this plan if scope changes

**Ready to start building? Let's begin with Phase 0!** 🚀

