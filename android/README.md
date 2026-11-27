# Sonic Vault Android 4.0.1
Native Android WebView wrapper around the current repository. Local HTTPS asset loading supports ES modules without insecure file access. The catalog and UI work offline; streaming links launch external apps or browsers. No Android internet permission, login, or backend is required.

Build using JDK 17, Gradle 8.9, Android SDK 35:
```sh
gradle -p android :app:assembleDebug
```
GitHub Actions: Build Sonic Vault Android APK. Download and extract the Sonic-Vault-4.0.1-Android artifact. Install Sonic-Vault-4.0.1.apk on Android 8.0+. This is a debug-signed test APK, not a Play Store release. The generated signing key on a fresh CI runner may change; use a persistent signing key before distributing upgrades.

Physical-device testing remains necessary. The web site's CSS 3D interface and unverified inherited artist catalog are retained.
