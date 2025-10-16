# Product Requirements Document (PRD) for GratChain

**Onchain Tipping Jar App**

---

## 1. Product Overview

### Product Name
**GratChain**

### Live URL
**https://gratchain.vercel.app**

### Description
GratChain is a seamless onchain tipping app built on the Base network, designed to allow users to send micro-tips to content creators, artists, developers, or anyone with a wallet address. It leverages **Sub Accounts** and **Auto Spend Permissions** from the Base Account SDK to eliminate repeated wallet pop-ups, creating a "save my card" experience for frictionless, recurring tips. Users connect once, grant permissions, and tip multiple times without interruptions. The app focuses on high-frequency, low-value transactions (e.g., 0.001 ETH tips) to demonstrate improved UX for onchain interactions.

### Target Platform
Web app (deployable to Vercel/Netlify)

### Tech Stack
- **Frontend:** React with Vite (no Next.js)
- **Onchain:** Base Account SDK integration

### Purpose
Built specifically for **Base Builder Quest 11** submission, showcasing Sub Accounts with Auto Spend Permissions. Must be functional, deployed, and include a demo video/screenshots highlighting zero-pop-up tipping.

### Unique Value Proposition
Vibey, effortless tipping that feels like social media likes but with real onchain value—empowering creators while making crypto accessible and fun.

### Scope
MVP focused on core tipping flow; no advanced features like user authentication beyond wallet connect or complex backend.

### Timeline
Quick build (hours to a day) for quest deadline (assuming Oct 17, 2024, 11am EST, but adaptable to 2025 context).

### Success Metrics
- Successful deployment
- Seamless tipping demo
- Quest submission acceptance
- Post-quest: user adoption via tips sent/received

---

## 2. Objectives and Goals

### Primary Objective
Win **Base Builder Quest 11** by delivering a functional app that integrates Sub Accounts and Auto Spend Permissions, reducing UX friction for onchain transactions.

### Secondary Objectives
1. **Demonstrate real-world utility:** Enable tipping for creators (e.g., bloggers, X posters, open-source devs)
2. **Provide inspiration for broader onchain apps** by showing batch tipping or gas sponsorship
3. **Ensure ease of build:** Use React/Vite for frontend, Base SDK for onchain logic
4. **Cover all actors:** Tippers (senders), Receivers (creators/tip recipients), and Viewers (non-tipping browsers of creator lists)

### Business/Quest Goals
High-impact demo with polished UI; include video walkthrough for submission. Avoid over-engineering—fork/adapt official demo if needed.

---

## 3. Actors (Users) and Personas

The PRD covers all key actors involved in the system. Each has specific needs, pain points, and interactions.

### Tipper (Sender)

**Persona:** Casual crypto user (e.g., 25-35yo tech enthusiast, holds ETH on Base, follows creators on X/Farcaster). Wants quick, low-effort ways to support favorites without constant wallet approvals.

**Needs:**
- Easy wallet connect
- One-time permission grant
- Seamless tipping (single-click after setup)
- View tipping history
- Batch tip multiple creators

**Pain Points:**
- Annoying pop-ups for every tx
- Gas fees
- Forgetting wallet balances

**Interactions:**
Connect wallet → Grant permissions → Browse creators → Tip (auto-fund Sub Account if needed) → See confirmation

**Edge Cases:**
- Insufficient funds (auto-pull from parent account)
- Permission revocation
- Testnet vs. mainnet switching

### Receiver (Creator/Tip Recipient)

**Persona:** Content creator (e.g., artist, dev, influencer with public wallet). Seeks passive income from fans without managing complex setups.

**Needs:**
- Easy profile addition (e.g., submit wallet/username via form or static list)
- View received tips
- Promote their tipping jar (shareable link)

**Pain Points:**
- Low visibility for tipping
- Tracking onchain receipts
- Spam tips

**Interactions:**
View dashboard of tips received (read-only onchain data), share profile link, no active login required (wallet-based if viewing)

**Edge Cases:**
- Multiple tips in batch
- Zero-value tips (prevent)
- Tax/export reporting (future scope)

### Viewer (Non-Participant)

**Persona:** Curious browser (e.g., non-crypto user exploring the app). Not ready to connect wallet but wants to see how it works.

**Needs:**
- Public view of creator list
- Demo mode (e.g., simulated tipping without connect)
- Educational tooltips on onchain benefits

**Pain Points:**
- Intimidation by crypto jargon
- Lack of trust in security

**Interactions:**
Browse creator list without connect, read FAQs, watch embedded demo video

**Edge Cases:**
- Mobile responsiveness
- Accessibility (e.g., screen reader support)

### Admin/Developer (Builder)

**Persona:** Solo dev building for quest

**Needs:**
- Easy config for creator list (hardcoded array or simple JSON)
- Debugging tools
- Deployment scripts

**Interactions:**
Local dev server, deploy to hosting, monitor onchain events

**Edge Cases:**
- SDK errors
- Chain ID mismatches

---

## 4. User Stories

Prioritized for MVP; written as "As a [actor], I want [feature] so that [benefit]."

### Tipper Stories
1. As a **Tipper**, I want to connect my wallet once so that I can grant Auto Spend Permissions and tip without pop-ups
2. As a **Tipper**, I want to browse a list of creators with usernames/wallets so that I can select who to tip
3. As a **Tipper**, I want to send a tip (e.g., 0.001 ETH) via Sub Account so that funds auto-pull if needed
4. As a **Tipper**, I want a "Tip All" button for batch tipping so that I can support multiple creators at once
5. As a **Tipper**, I want to see my tipping history so that I can track spending

### Receiver Stories
1. As a **Receiver**, I want my wallet listed publicly (with opt-in) so that Tippers can find and tip me
2. As a **Receiver**, I want to view incoming tips onchain so that I can confirm receipts without app login
3. As a **Receiver**, I want a shareable profile link so that I can promote on social media

### Viewer Stories
1. As a **Viewer**, I want to explore the app without connecting so that I can learn about onchain tipping
2. As a **Viewer**, I want tooltips/FAQs explaining Sub Accounts so that I understand the tech

### Admin Stories
1. As an **Admin**, I want to configure creators via code so that I can update the list easily
2. As an **Admin**, I want console logs for tx status so that I can debug during build

---

## 5. Features and Requirements

### Core Features

#### Wallet Connect
Integrate wagmi/viem for Base chain (ID 8453); auto-create Sub Account on connect

#### Permission Grant
Request Auto Spend (e.g., up to 0.1 ETH/day) for seamless funding

#### Creator List
Display 5-10 hardcoded creators (username, wallet, bio/image); fetch from array or simple API if ambitious

#### Tipping Button
Per creator; sends ETH/ERC-20 via `wallet_sendCalls` (batch-capable)

#### Batch Tipping
"Tip All" for multiple calls in one tx

#### History View
Read onchain events for tips sent/received

#### Gas Sponsorship
Optional paymaster integration (e.g., Base's free tier) for gasless tips

### Non-Functional Requirements

**Performance:** Load <2s; handle 10+ tips without reload

**Security:** No private keys stored; use SDK best practices; test for reentrancy

**Accessibility:** ARIA labels, keyboard nav

**Responsiveness:** Mobile-first (Vite handles well)

**Error Handling:** User-friendly messages (e.g., "Insufficient permissions—regrant?")

### Out-of-Scope (for MVP)
- User accounts/DB
- Advanced analytics
- Token gating

---

## 6. Technical Specifications

### Frontend
React (v18+) with Vite for bundling/dev server. Use hooks for state (e.g., `useState` for creators, `useEffect` for SDK init)

### Libraries
- `@base-org/account` for SDK
- `viem` and `wagmi` for wallet/onchain interactions
- `ethers` optional for utils

### Styling
Tailwind CSS or CSS modules for vibey UI (gradients, animations)

### Onchain Integration

**Chain:** Base Mainnet/Sepolia

**SDK Config:** Auto-create Sub Account, enable Auto Spend

**Transactions:** Use `wallet_sendCalls` for permissions/funding/tips

### Data Flow
```
Connect → Get/Create Sub Account → Request Permissions → Send Tip (auto-fund if low balance)
```

### Build/Deploy

**Init:** `pnpm create vite@latest grat-chain --template react`

**Dev:** `pnpm run dev`

**Build:** `pnpm run build`

**Deploy:** Vercel/Netlify (free); env vars for chain ID/paymaster URL

**Testing:** Local on Sepolia (faucet for ETH); unit tests for components (optional for quest)

---

## 7. UI/UX Design Guidelines

### Overall Style
Vibey and modern—use gradients (e.g., blue-purple for Base theme), smooth animations (e.g., tip button pulse), clean typography (Sans-serif)

### Key Screens

#### Home
Hero with "Tip Seamlessly Onchain" + Connect button + Creator grid (cards with image, name, tip button)

#### After Connect
Permission modal → Tipping dashboard with history

#### Receiver View
Simple list or profile page

### User Flow Diagram (Text-Based)
```
Land on home → View creators
  ↓
Click Connect → Wallet popup → Sub Account created
  ↓
Grant Permissions (one-time)
  ↓
Click Tip → Tx sent via Sub (no popup) → Success toast
```

### Accessibility/UX Best Practices
- Dark mode toggle
- Mobile optimization
- Clear loading states

---

## 8. Similar Projects for Inspiration

I researched similar onchain tipping/donation dapps on Ethereum/Base. Here are very similar ones with links to their landing page UIs for design inspiration (e.g., hero sections, grids, CTAs). Focus on their clean layouts, crypto integrations, and social features.

### 1. Giveth (Zero-Fee Crypto Donation Platform)
**URL:** https://giveth.io/

Hero banner with value prop, feature cards (verification/rewards), campaign grids with images/buttons, stats blocks, partner logos, and newsletter signup. Great for trust-building elements in your creator list.

### 2. Degen.tips (Farcaster Tipping on Base)
**URL:** https://www.degen.tips/

Minimalist design with focus on tipping mechanics, channel-based discussions, and token distribution. Inspire your batch tipping UI with simple buttons and real-time feeds.

### 3. Tipn (Composable Micropayments on Farcaster/Base)
**URL:** https://tipnearn.com/

Simple "how it works" section, auto-tip via likes, deposit/setup flow. Use for your permission grant UX—straightforward, with USDC focus.

### 4. Stand With Crypto (Crypto Donation Platform on Base)
**URL:** https://www.standwithcrypto.org/

Advocacy-focused with donate buttons, project lists, and crypto owner mobilization. Good for public creator profiles and shareable links.

### 5. Omnisea Onchain Fundraisers (Tokenized Donations on Base)
**URL:** https://omnisea.org/

Campaign tokens, low-fee payouts, fundraiser coins. Inspire tokenized tips or batch sends with their store/marketplace vibe.

---

## 9. Risks and Dependencies

### Risks
- SDK bugs (mitigate with docs/video guide)
- Quest deadline (build core first)

### Dependencies
- Base SDK docs: https://docs.base.org/base-account/improve-ux/sub-accounts
- Testnet faucet
- Hosting account

### Legal
Include quest disclaimer in submission; ensure no real funds in demo

---

## 10. Next Steps for Building

1. ✅ Set up Vite/React project
2. ✅ Install SDK/libs
3. ✅ Implement connect/sub account logic
4. ✅ Build UI components (creator cards, tip buttons)
5. ✅ Test tipping flow on Sepolia
6. ✅ Deploy and record 1-2 min video (e.g., via Loom: connect → grant → tip multiple times seamlessly)
7. ✅ Submit to quest thread/form

---

## Reference Notes

This PRD provides an end-to-end blueprint—use it to code step-by-step. If needed, iterate based on build feedback.

**Last Updated:** October 16, 2025

**Quest Target:** Base Builder Quest 11 - Sub Accounts with Auto Spend Permissions

