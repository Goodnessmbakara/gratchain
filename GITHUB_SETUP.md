# GitHub Repository Setup Instructions

## Step 1: Create GitHub Repository

1. Go to **https://github.com/new**
2. Fill in the repository details:
   - **Repository name:** `gratchain` (or `GratChain`)
   - **Description:** `Seamless onchain tipping on Base with Spend Permissions - Built for Base Builder Quest 11`
   - **Visibility:** Public ✅ (required for quest submission)
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
3. Click **"Create repository"**

## Step 2: Connect Local Repository to GitHub

After creating the repository, GitHub will show you instructions. Use these commands:

```bash
# Add the remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/gratchain.git

# Rename branch to main (if needed)
git branch -M main

# Push the code
git push -u origin main
```

### OR, if you prefer SSH:

```bash
git remote add origin git@github.com:YOUR_USERNAME/gratchain.git
git branch -M main
git push -u origin main
```

## Step 3: Verify

After pushing, visit your repository at:
```
https://github.com/YOUR_USERNAME/gratchain
```

You should see:
- ✅ All project files
- ✅ README.md displayed on the homepage
- ✅ Commit history showing initial commit

## Quick Command Reference

```bash
# Check current remote
git remote -v

# View commit history
git log --oneline

# Check branch
git branch

# Push future changes
git add .
git commit -m "your message"
git push
```

## Repository Settings (Optional)

Once created, you can:

1. **Add topics:** `base`, `blockchain`, `tipping`, `web3`, `ethereum`, `vite`, `react`
2. **Update description** with emoji: "⚡ Seamless onchain tipping on Base"
3. **Set website:** Your deployed Vercel URL (after deployment)
4. **Enable Discussions** for community feedback

## For Quest Submission

Your repository URL will be:
```
https://github.com/YOUR_USERNAME/gratchain
```

Use this link when submitting to Base Builder Quest 11! 🚀

---

**Current Status:** Local repository initialized with initial commit ✅  
**Next Step:** Create GitHub repo and connect it using commands above

