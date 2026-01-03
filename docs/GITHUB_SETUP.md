# GitHub Setup and Push Guide

This guide will help you push your ADLC Emergency Services code to GitHub.

## Prerequisites

1. GitHub account (create at https://github.com if needed)
2. Git installed on your computer
3. GitHub CLI or Git configured with your credentials

## Step 1: Initialize Git Repository (if not already done)

If you haven't initialized git yet:

```bash
# Navigate to project root
cd C:\Users\hunte\Desktop\ADLC-Emergency

# Initialize git repository
git init

# Configure git (if not already configured globally)
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

## Step 2: Create GitHub Repository

### Option A: Using GitHub Website

1. Go to https://github.com/new
2. Repository name: `ADLC-Emergency` (or your preferred name)
3. Description: "Anaconda-Deer Lodge County Emergency Services Platform"
4. Visibility: Choose Public or Private
5. **Do NOT** initialize with README, .gitignore, or license (we already have these)
6. Click "Create repository"

### Option B: Using GitHub CLI

```bash
# Login to GitHub CLI (if not already logged in)
gh auth login

# Create repository
gh repo create ADLC-Emergency --public --description "Anaconda-Deer Lodge County Emergency Services Platform"
```

## Step 3: Add Remote and Push

```bash
# Make sure you're in the project root
cd C:\Users\hunte\Desktop\ADLC-Emergency

# Add all files to git
git add .

# Commit files
git commit -m "Initial commit: ADLC Emergency Services Platform

- Backend API with NestJS
- Frontend React application
- React Native mobile app
- Render deployment configuration
- GitHub Actions for APK builds
- Complete documentation"

# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/ADLC-Emergency.git

# Or if using SSH:
# git remote add origin git@github.com:YOUR_USERNAME/ADLC-Emergency.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 4: Verify Push

1. Go to your GitHub repository: `https://github.com/YOUR_USERNAME/ADLC-Emergency`
2. Verify all files are present
3. Check that workflows are visible in `.github/workflows/` directory

## Alternative: Using GitHub Desktop

1. Open GitHub Desktop
2. File → Add Local Repository
3. Choose your project folder
4. Repository → Publish Repository
5. Choose name and visibility
6. Click "Publish Repository"

## Setting Up Secrets for GitHub Actions

After pushing, configure secrets for automated builds:

### For APK Builds:

1. Go to Repository → Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Add these secrets:

#### Required:
- **EXPO_TOKEN**: Your Expo access token
  - Get from: https://expo.dev/accounts/[username]/settings/access-tokens

#### Optional:
- **MAPBOX_TOKEN**: Your Mapbox access token
- **API_URL**: Your backend API URL (defaults to Render URL)
- **WS_URL**: Your WebSocket URL

### For Render Auto-Deploy:

1. Get Render API Key: Render Dashboard → Account Settings → API Keys
2. Get Service IDs from your Render services
3. Add to GitHub Secrets:
   - **RENDER_API_KEY**: Your Render API key
   - **RENDER_SERVICE_ID**: Your backend service ID (optional)

## Common Issues and Solutions

### Issue: "Repository not found"

**Solution:**
- Verify repository name is correct
- Check you have access to the repository
- Ensure remote URL is correct: `git remote -v`

### Issue: "Permission denied"

**Solution:**
- Use personal access token instead of password
- Or set up SSH keys: https://docs.github.com/en/authentication/connecting-to-github-with-ssh
- Or use GitHub CLI: `gh auth login`

### Issue: Large file warnings

**Solution:**
- The `.gitignore` should exclude large files
- If needed, use Git LFS for binary files
- Remove files from history: `git rm --cached large-file`

### Issue: "Nothing to commit"

**Solution:**
- Check if files are already committed: `git status`
- Check `.gitignore` isn't excluding too much
- Verify you're in the correct directory

## Next Steps After Pushing

1. **Connect to Render:**
   - Go to Render Dashboard
   - New → Blueprint
   - Connect your GitHub repository
   - Deploy

2. **Test GitHub Actions:**
   - Make a small change to mobile code
   - Push to main branch
   - Check Actions tab for build status

3. **Set Up Branch Protection (Optional):**
   - Repository → Settings → Branches
   - Add rule for main branch
   - Require pull request reviews

4. **Add Collaborators:**
   - Repository → Settings → Collaborators
   - Add team members

## Useful Git Commands

```bash
# Check status
git status

# View commits
git log --oneline

# View remote
git remote -v

# Update remote URL
git remote set-url origin NEW_URL

# Pull latest changes
git pull origin main

# Create and switch to new branch
git checkout -b feature-branch

# Push specific branch
git push origin branch-name

# View ignored files
git status --ignored
```

## Continuous Integration

After pushing, these will run automatically:

1. **Android APK Build**: On push to main (mobile code changes)
2. **Render Deploy**: On push to main (if configured)

Monitor these in the Actions tab of your GitHub repository.

