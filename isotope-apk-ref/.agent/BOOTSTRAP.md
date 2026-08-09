# IsotopeAI Android — Bootstrap Guide

Copy-paste every command exactly as shown. Do not skip steps.

---

## Required Versions

| Tool | Required | Check |
|------|----------|-------|
| Node.js | 20.x or 22.x | `node --version` |
| npm | 10.x+ | `npm --version` |
| Java JDK | 17 (Temurin) | `java -version` |
| Android SDK | API 35 + build-tools 35.0.0 | `sdkmanager --list` |
| Gradle | 8.x (via wrapper) | `./android/gradlew --version` |

---

## Required Replit Secrets

Configure these in Replit Secrets (never commit values):

| Secret Name | Purpose | Required For |
|-------------|---------|-------------|
| `GITHUB_PAT` | Push to GitHub | Handoff scripts |
| `SUPABASE_URL` | Supabase project URL | Reference only (hardcoded in bridge) |
| `SUPABASE_PUBLISHABLE_KEY` | Supabase anon key | Reference only (hardcoded in bridge) |
| `SUPABASE_PROJECT_REF` | Project reference ID | Reference only |
| `SUPABASE_ACCESS_TOKEN` | Management API | Only when running schema migrations |
| `ANDROID_KEYSTORE_BASE64` | Signing keystore | Release builds only |
| `ANDROID_KEYSTORE_PASSWORD` | Keystore password | Release builds only |
| `ANDROID_KEY_ALIAS` | Key alias | Release builds only |
| `ANDROID_KEY_PASSWORD` | Key password | Release builds only |

---

## 1. Clone Repos

```bash
# Clone the Capacitor wrapper (this repo)
git clone https://github.com/Suydev/isotope-apk isotope-apk
cd isotope-apk

# Clone source assets (pre-compiled UI)
git clone https://github.com/Suydev/isotope-code isotope-code
```

---

## 2. Set Up Git Authentication

```bash
# Configure git to use the PAT for pushes
git remote set-url origin https://YOUR_GITHUB_PAT@github.com/Suydev/isotope-apk.git
# Never commit the PAT to any file
```

---

## 3. Install Node Dependencies

```bash
cd isotope-apk
npm install
```

---

## 4. Set Up Android SDK (CI / Fresh Machine)

```bash
# Install Android SDK via command line tools
sdkmanager "platforms;android-35" "build-tools;35.0.0" "platform-tools"

# Accept licenses
yes | sdkmanager --licenses
```

---

## 5. Prepare www/ Assets

```bash
# Copy public/ assets from isotope-code into www/ and inject Android bridge
SOURCE_DIR=../isotope-code/public \
WWW_DIR=./www \
BRIDGE_FILE=./android-bridge.js \
node scripts/prepare-www.js
```

---

## 6. Initialize Capacitor Android Platform

```bash
# Only needed once (or after deleting android/)
npx cap add android
```

---

## 7. Apply Android Patches

```bash
# Patch JS bundles and AndroidManifest.xml
node scripts/apply-android-patches.js
```

---

## 8. Sync Capacitor

```bash
npx cap sync android
```

---

## 9. Build Debug APK

```bash
cd android
chmod +x gradlew
./gradlew assembleDebug --no-daemon
cd ..
```

**APK location:** `android/app/build/outputs/apk/debug/app-debug.apk`

---

## 10. Build Release AAB (for Play Store)

```bash
cd android
./gradlew bundleRelease --no-daemon
cd ..
```

**AAB location:** `android/app/build/outputs/bundle/release/app-release.aab`

---

## 11. Check Agent Status

```bash
node scripts/agent-status.mjs
```

---

## 12. Resume Previous Session

```bash
npm run agent:resume
```

---

## 13. End Session Handoff

```bash
npm run agent:handoff
```

---

## Common Build Failures

### `SDK location not found`
```bash
# Create local.properties with your SDK path
echo "sdk.dir=$ANDROID_HOME" > android/local.properties
```

### `minSdkVersion too low`
Check `android/app/build.gradle` — must be `minSdkVersion 24` or higher.

### `Duplicate class kotlin.collections`
```bash
# In android/build.gradle, add:
# configurations.all { resolutionStrategy { force 'org.jetbrains.kotlin:kotlin-stdlib:1.9.0' } }
```

### `www/index.html not found after prepare-www`
Ensure `SOURCE_DIR` points to the correct `public/` directory with `index.html`.

### `Capacitor sync fails with module not found`
```bash
npm install  # Re-install all dependencies
npx cap sync android
```

### `APK crashes on launch — white screen`
Check Logcat for JS errors. Most common: `window.__ISO_SUPA_URL__` not set.
Verify `android-bridge.js` is loaded FIRST in `<head>` of index.html.

### `Session not found after login`
Check that localStorage key `isotope-auth-token` is being written.
The android-bridge.js `handleLogin` function must write all 5 token keys.

---

## Environment Variables (Build Time Only)

```bash
export SOURCE_DIR=/path/to/isotope-code/public
export WWW_DIR=/path/to/isotope-apk/www
export BRIDGE_FILE=/path/to/isotope-apk/android-bridge.js
export ANDROID_DIR=/path/to/isotope-apk/android
```

---

## Key File Locations

| What | Where |
|------|-------|
| Android bridge (fetch interceptor) | `android-bridge.js` |
| www/ preparation script | `scripts/prepare-www.js` |
| Android patch script | `scripts/apply-android-patches.js` |
| Capacitor config | `capacitor.config.json` |
| GitHub Actions CI | `.github/workflows/android.yml` |
| Debug APK output | `android/app/build/outputs/apk/debug/app-debug.apk` |
| Release AAB output | `android/app/build/outputs/bundle/release/app-release.aab` |
| Handoff state | `.agent/state.json` |
