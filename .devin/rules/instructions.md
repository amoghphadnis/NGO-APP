---
trigger: always_on
---
# Developer Guardrails & Build Rules for VidyaPoshak App

## 1. Native Build Environment Constraints
* **CRITICAL:** Do NOT run `npx expo prebuild --clean` or any bare `expo prebuild` commands without immediately re-verifying the native configuration files listed below. Expo's prebuild engine overwrites manual Gradle and Manifest configurations.
* Whenever a native folder regeneration is required, you must immediately re-apply the production signing configurations and manifest overrides.

## 2. Mandatory Android File Rules

### A. Android Manifest Overrides (`android/app/src/main/AndroidManifest.xml`)
* The `<manifest>` tag must always include the tools namespace: `xmlns:tools="http://schemas.android.com/tools"`
* You must explicitly block high-risk overlay permissions to prevent Google Play Protect rejections. Ensure this line is present under the permissions definitions:
  `<uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW" tools:node="remove" />`

### B. Local Gradle Credentials (`android/gradle.properties`)
* Do not allow Expo to completely wipe out production credentials. Ensure these exact keys are always appended to the file if it gets regenerated:
```properties
  RELEASE_STORE_FILE=e:/Personal APP/NGO-APP/android/app/release.keystore
  RELEASE_KEY_ALIAS=vpapp-release
  RELEASE_STORE_PASSWORD=VPApp@Release2026
  RELEASE_KEY_PASSWORD=VPApp@Release2026
  ```

### C. App Build Configuration (`android/app/build.gradle`)
* Ensure namespace and defaultConfig.applicationId are consistently locked to "com.vidyaposhak.app".

* Ensure buildTypes.release.signingConfig points to signingConfigs.release (NOT signingConfigs.debug).

## 3. Compilation Workflow
* Before running assembleRelease, always execute ./gradlew clean from inside the android directory to wipe the stale CMake cache.

* Ensure R8 optimization/minification rules remain active during release compilation.