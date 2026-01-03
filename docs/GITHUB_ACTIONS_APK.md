# Building Android APK with GitHub Actions

This guide explains how to automatically build Android APK files using GitHub Actions.

## Overview

The GitHub Actions workflow automatically:
- Builds Android APK when mobile code changes
- Uploads APK as artifact
- Creates GitHub release with APK (on main branch push)

## Setup

### 1. Enable GitHub Actions

GitHub Actions is enabled by default. Ensure your repository has:
- `.github/workflows/android-build.yml` (already created)
- Code pushed to repository

### 2. Configure Secrets (Optional)

For Expo/EAS builds, add secrets in GitHub:

1. Go to Repository → Settings → Secrets and variables → Actions
2. Add the following secrets:

#### Required (for Expo EAS):
- `EXPO_TOKEN`: Expo access token
  - Get from: https://expo.dev/accounts/[username]/settings/access-tokens
  - Create new token with build permissions

#### Optional:
- `EXPO_USERNAME`: Your Expo username
- `EXPO_PASSWORD`: Your Expo password (if not using token)
- `API_URL`: Backend API URL (defaults to Render URL)
- `MAPBOX_TOKEN`: Mapbox access token
- `WS_URL`: WebSocket URL

### 3. Create Expo Account (if using EAS)

1. Sign up at https://expo.dev
2. Install Expo CLI: `npm install -g expo-cli eas-cli`
3. Login: `expo login`
4. Create access token (see above)

## Workflow Behavior

### Triggered On:
- Push to `main` or `master` branch (mobile code changes)
- Pull requests to main/master
- Manual trigger via GitHub Actions tab

### Build Process:

1. **Setup Environment**
   - Node.js 18
   - Java 17
   - Android SDK
   - Expo CLI

2. **Install Dependencies**
   - Installs mobile app dependencies
   - Creates `.env` file from secrets

3. **Build APK**
   - Attempts EAS Build (if EXPO_TOKEN set)
   - Falls back to local Gradle build
   - Creates release APK

4. **Artifact Upload**
   - Uploads APK to GitHub Actions artifacts
   - Available for 30 days
   - Download from Actions tab

5. **GitHub Release** (main branch only)
   - Creates new release
   - Attaches APK file
   - Tagged with version number

## Downloading APK

### From Artifacts

1. Go to Actions tab in GitHub
2. Click on latest workflow run
3. Scroll to "Artifacts" section
4. Download `android-apk`

### From Releases

1. Go to Releases page in repository
2. Download latest release
3. APK attached to release

## Local APK Build (Alternative)

If you prefer building locally:

```bash
cd mobile

# Install dependencies
npm install

# Setup Expo
npx expo install

# Build APK with EAS
eas build --platform android --profile production

# OR build locally with Gradle
npx expo prebuild --platform android
cd android
./gradlew assembleRelease
```

APK location: `android/app/build/outputs/apk/release/app-release.apk`

## Troubleshooting

### Build Fails: "EXPO_TOKEN not set"

**Solution:**
- Add `EXPO_TOKEN` secret in GitHub
- Or workflow will use local Gradle build instead

### Build Fails: Android SDK Not Found

**Solution:**
- Workflow should auto-setup SDK
- If issue persists, check workflow logs
- Verify Android setup action version

### APK Not in Release

**Solution:**
- Only creates release on push to main/master
- Check if branch is main/master
- Verify workflow completed successfully
- Check "Release APK" step in logs

### Gradle Build Errors

**Solution:**
- Check Android SDK setup in workflow
- Verify Java version (should be 17)
- Review build logs for specific errors
- May need to update `build.gradle` files

## Customizing Build

### Change Build Type

Edit `.github/workflows/android-build.yml`:

```yaml
- name: Build APK with EAS
  run: eas build --platform android --profile preview
```

### Add Signing

1. Add keystore to secrets
2. Update workflow to use keystore
3. Configure `app.json` or `eas.json` with signing

### Build for Different Branches

Edit workflow triggers:

```yaml
on:
  push:
    branches:
      - main
      - develop
      - 'release/*'
```

## Mobile App Configuration

### Update API URLs

Edit `mobile/app.config.js`:

```javascript
extra: {
  apiUrl: process.env.API_URL || "https://your-backend-url.com",
  mapboxToken: process.env.MAPBOX_TOKEN || "",
  wsUrl: process.env.WS_URL || "wss://your-backend-url.com"
}
```

### Version Management

Update version in:
- `mobile/app.json` → `version`
- `mobile/package.json` → `version`

GitHub release will use these versions.

## Best Practices

1. **Version Control**
   - Increment version before building
   - Use semantic versioning (1.0.0, 1.0.1, etc.)
   - Tag releases appropriately

2. **Testing**
   - Test APK on different devices
   - Verify API connections work
   - Check all features function correctly

3. **Security**
   - Never commit secrets to repository
   - Use GitHub Secrets for sensitive data
   - Sign APKs for production

4. **Release Notes**
   - Add release notes when creating releases
   - Document changes and fixes
   - Include known issues if any

## Alternative: Manual APK Build

If GitHub Actions doesn't work:

1. **Using Expo:**
   ```bash
   cd mobile
   eas build --platform android --profile production
   ```

2. **Using Android Studio:**
   - Open `mobile/android` in Android Studio
   - Build → Build Bundle(s) / APK(s) → Build APK(s)
   - APK in `app/build/outputs/apk/release/`

3. **Using Command Line:**
   ```bash
   cd mobile
   npx expo prebuild
   cd android
   ./gradlew assembleRelease
   ```

## Next Steps

1. Set up Expo account and get token
2. Add secrets to GitHub
3. Push code to trigger build
4. Download and test APK
5. Distribute to testers or app stores

