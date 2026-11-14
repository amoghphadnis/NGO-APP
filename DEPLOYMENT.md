# VPApp Android Deployment Guide

Everything needed to build and upload the next release `.aab` without rediscovering this the hard way.

## App Identity

| Field | Value |
|---|---|
| Package / applicationId | `com.vidyaposhak.app` |
| EAS project | `VidyaPoshak` (`amoghphadnis20` account) |
| EAS projectId | `44fcbca0-20f3-4ba7-99f0-296d27988786` |
| Version source | remote (`appVersionSource: "remote"` in eas.json) — `android.versionCode` in app.json is ignored |

## Signing — CRITICAL

**The upload key is EAS-managed, NOT a local file.**

- Active upload keystore: **"Build Credentials ZlOx2I-HfB"** (default), stored on Expo's servers, created 2026-09-08, type JKS.
- Expected cert fingerprints (Play Console enforces these):
  - SHA1: `C7:F8:92:C5:FB:3A:AE:53:E2:1A:1F:AF:E0:38:36:61:1E:C2:2D:A7`
  - SHA256: `FA:C9:79:57:68:9D:13:1A:AA:B4:18:A2:81:B2:B8:6B:96:DD:38:8B:91:76:59:29:38:C0:E5:FA:1A:C9:71:76`

**Do NOT sign with `F:/NGO APP/release.keystore`** (alias `vpapp-release`, SHA1 `38:3B:BD:D0:...`). It has never signed a Play upload — an AAB signed with it was already rejected by Play Console (2026-10 build, versionCode 9). It remains wired into `android/app/build.gradle` + `android/gradle.properties` only for local `assembleRelease` experiments; those files contain the password in plaintext, so keep `gradle.properties` out of public sharing.

**Do NOT create a `credentials.json`** or set `"credentialsSource": "local"` in eas.json. Leave credentials remote so EAS signs automatically. If a `credentials.json` is ever created, it must be gitignored.

## Build Command

```bash
npx eas build -p android --profile production --non-interactive
```

Production profile (eas.json): `autoIncrement: true`, `android.buildType: "app-bundle"`.
Expected log lines confirming correct setup:

```
- Incrementing versionCode from N to N+1.
✔ Using remote Android credentials (Expo server)
✔ Using Keystore from configuration: Build Credentials ZlOx2I-HfB (default)
```

If it says `Using local Android credentials (credentials.json)` — stop, the config drifted.

## Verify Before Uploading

Download the artifact and confirm the cert — this catches signing mistakes before Play does:

```bash
curl -sL <artifact-url> -o app.aab
keytool -printcert -jarfile app.aab | grep SHA1
# must print: C7:F8:92:C5:FB:3A:AE:53:E2:1A:1F:AF:E0:38:36:61:1E:C2:2D:A7
```

## Play Console Upload

- Release name convention: `<versionName> (<versionCode>)`, e.g. `1.0.0 (10)`.
- versionCode must exceed the last uploaded one — `autoIncrement` handles this automatically (v9 was burned by the rejected build, v10 was the first accepted).
- Paste release notes into `<en-US>`.

## First Working Release

- **versionCode 10**, 2026-10-31
- Artifact: `https://expo.dev/artifacts/eas/weToIObTYWSAqO7B5I_nkatrWq23AJHrexLHVrqLDf0.aab` (link may expire; rebuilds are always possible)
- Build: `https://expo.dev/accounts/amoghphadnis20/projects/VidyaPoshak/builds/fad8a543-8522-4875-b02b-a0022dcfd78a`

## Keystore Backup (recommended, once)

The upload key lives only on Expo's servers. Back it up locally so the app survives account loss:

```bash
npx eas credentials -p android   # → Android → Keystore: Download a keystore
```

Store the downloaded `.jks` + its password somewhere safe and offline. If credentials are ever rotated or lost, Play releases become impossible without a key-reset appeal to Google.

## Native Guardrails (see .devin/rules/instructions.md)

If `android/` is ever regenerated (`expo prebuild`), re-verify immediately:

- `AndroidManifest.xml`: `xmlns:tools` namespace + `<uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW" tools:node="remove" />`
- `build.gradle`: namespace/applicationId `com.vidyaposhak.app`, `release.signingConfig = signingConfigs.release`
- `gradle.properties`: release signing keys re-appended (note: path points at the *local-only* keystore above)
- R8/minification enabled for release; `./gradlew clean` before `assembleRelease`

## Known Debt / Watch Items

- npm audit reported 24 vulnerabilities after the SDK 58 upgrade (10 low, 13 high, 1 critical) — not yet triaged; avoid blind `npm audit fix --force`.
- `android/gradle.properties` holds the local keystore password in plaintext — acceptable for a local-only keystore, but do not commit or share the file.
- EAS warns the project is Expo-Go-based for development; fine for now, but a dev-client workflow is recommended long-term.
