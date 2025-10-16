# GratChain Deployment Guide

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **WalletConnect Project ID**: Get from [cloud.walletconnect.com](https://cloud.walletconnect.com/)
3. **GitHub Repository**: Connected and up-to-date

## Deployment Steps

### 1. Environment Variables

Before deploying, set up these environment variables in Vercel:

```bash
VITE_WALLETCONNECT_PROJECT_ID=your_project_id_here
VITE_APP_NAME=GratChain
VITE_APP_DESCRIPTION=Seamless onchain tipping for content creators
VITE_BASE_CHAIN_ID=8453
```

### 2. Deploy with Vercel CLI

```bash
# Login to Vercel (if not already logged in)
npx vercel login

# Deploy to preview
npx vercel

# Deploy to production
npx vercel --prod
```

### 3. Deploy via GitHub Integration (Recommended)

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Configure project:
   - **Framework Preset**: Vite
   - **Build Command**: `pnpm build`
   - **Output Directory**: `dist`
   - **Install Command**: `pnpm install`
4. Add environment variables in Vercel dashboard
5. Click "Deploy"

### 4. Post-Deployment Configuration

#### Update WalletConnect Origins
1. Go to [cloud.walletconnect.com](https://cloud.walletconnect.com/)
2. Navigate to your project
3. Add your Vercel domain to allowed origins:
   - `https://your-app.vercel.app`
   - `https://www.your-custom-domain.com` (if using custom domain)

#### Configure Custom Domain (Optional)
1. In Vercel dashboard, go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

## Vercel Configuration

The `vercel.json` file includes:
- Build and output directory configuration
- SPA routing with rewrites
- Asset caching headers for optimal performance

## Environment-Specific Settings

### Production
- Use Base Mainnet (Chain ID: 8453)
- RPC URL: `https://mainnet.base.org`
- Ensure all contracts are deployed to mainnet

### Preview/Development
- Can use Base Sepolia testnet for testing
- Update chain configuration in `src/config/wagmi.ts`

## Monitoring and Analytics

### Vercel Analytics
Enable in Project Settings → Analytics to track:
- Page views
- User interactions
- Performance metrics

### Web3 Monitoring
Consider integrating:
- **Tenderly**: For transaction monitoring
- **Sentry**: For error tracking
- **Mixpanel/Amplitude**: For user analytics

## Continuous Deployment

Vercel automatically:
- Deploys on every push to `main` (production)
- Creates preview deployments for pull requests
- Runs build checks before deployment

## Troubleshooting

### Build Failures
- Check environment variables are set correctly
- Verify all dependencies are in `package.json`
- Review build logs in Vercel dashboard

### Connection Issues
- Verify WalletConnect Project ID is correct
- Check domain is added to WalletConnect allowed origins
- Ensure Base network RPC is accessible

### Spend Permissions Not Working
- Confirm Base Account SDK is properly initialized
- Check wallet compatibility
- Verify smart account deployment on Base network

## Performance Optimization

The app includes:
- Code splitting for optimal bundle size
- Static asset caching (1 year)
- Gzip compression
- Image optimization

## Security Checklist

- ✅ Environment variables never committed to Git
- ✅ API keys stored in Vercel environment
- ✅ CORS configured properly for WalletConnect
- ✅ HTTPS enforced on production
- ✅ Content Security Policy headers configured

## Next Steps

After deployment:
1. Test all wallet connections
2. Verify tipping functionality on Base mainnet
3. Test batch tipping with multiple creators
4. Monitor initial user transactions
5. Set up error tracking and analytics
6. Submit to Base Builder Quest 11

## Support

For deployment issues:
- Vercel: [vercel.com/support](https://vercel.com/support)
- Base: [docs.base.org](https://docs.base.org)
- WalletConnect: [docs.walletconnect.com](https://docs.walletconnect.com)

---

**Production URL**: https://gratchain.vercel.app
**GitHub**: https://github.com/Goodnessmbakara/gratchain
**Base Builder Quest**: https://base.org/builder-quests

