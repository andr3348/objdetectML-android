# ObjDetectML Android

Real-time object detection on Android using a quantized SSD MobileNet V3 model running on-device via TensorFlow Lite.

## Stack

| Layer | Tech |
|---|---|
| Framework | [Expo](https://expo.dev) SDK 56 |
| Runtime | [React Native](https://reactnative.dev) 0.85 (Hermes) |
| Camera | [react-native-vision-camera](https://github.com/mrousavy/react-native-vision-camera) v5 |
| ML Engine | [react-native-fast-tflite](https://github.com/mrousavy/react-native-fast-tflite) v3 (Nitro modules) |
| Model | SSD MobileNet V3 Small (COCO, 320×320 quantized) |
| Worklets | react-native-worklets 0.8 + react-native-vision-camera-worklets |
| Language | TypeScript |
| Target | Android (ARM64) |

## Prerequisites

- **Node.js** 24 (tested with v24.15.0)
- **Java** — JDK 17 (e.g. `tem` distribution via SDKMAN)
- **Android Studio** with Android SDK 35+, NDK
- **Expo CLI** (`npx expo`)

## Setup

### 1. Java (SDKMAN)

```bash
sdk install java 17.0.14-tem
sdk use java 17.0.14-tem
```

### 2. Android SDK

Set `ANDROID_HOME` in your shell rc file (e.g. `~/.zshrc`):

```bash
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools:$ANDROID_HOME/cmdline-tools/latest/bin
```

### 3. Project

```bash
git clone <repo-url>
cd objdetectML-android
npm install
```

### 4. Run on device

```bash
npx expo run:android
```

This builds the native project (Gradle) and installs the debug APK on a connected device. The app will request camera permission on first launch.

### 5. Model

Place a `.tflite` model at `assets/detect.tflite`. The default expects SSD MobileNet V3 Small (320×320, COCO 80 classes). The model is loaded at runtime — no rebuild needed to swap it.

## Development

```bash
npx expo start
```

Press `a` to launch on Android. Metro will bundle JS and push updates to the running app (fast refresh for most changes).

### Regenerate native project

```bash
npx expo prebuild --clean
```

Required after adding/removing native dependencies or changing `app.json` plugins/permissions.

## Production build

```bash
npx expo run:android --variant release
```

Or generate an AAB for Play Store:

```bash
cd android
./gradlew bundleRelease
```

## Known limitations

- On-device quantized models trade accuracy for speed — the V3 model is a reasonable middle ground for real-time inference
- iOS is not supported (the ML pipeline uses Android-specific TFLite delegates)
