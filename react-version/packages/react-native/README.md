# @intastellar/signin-sdk-react-native

Official Intastellar authentication SDK for React Native applications with support for both Expo and bare React Native projects.

## Installation

```bash
npm install @intastellar/signin-sdk-react-native
```

### Dependencies for Bare React Native

If you're using a **bare React Native** project, install these dependencies:

```bash
npm install @react-native-async-storage/async-storage react-native-inappbrowser-reborn
```

### Dependencies for Expo

If you're using **Expo** (managed workflow), install these dependencies:

```bash
npx expo install @react-native-async-storage/async-storage expo-web-browser expo-constants
```

### iOS Setup (Bare React Native only)

For bare React Native projects, run:

```bash
cd ios && pod install
```

### Android Setup

No additional setup needed for Android in either Expo or bare React Native projects.

## Features

- **Automatic Platform Detection**: Detects Expo vs bare React Native environments automatically
- **Cross-Platform Browser Support**: Uses appropriate in-app browser for each platform
- **Automatic Browser Closing**: Closes in-app browser automatically when authentication completes
- **Fallback Support**: Falls back to system browser if in-app browsing is unavailable
- **TypeScript Support**: Full TypeScript definitions included
- **Deep Link Handling**: Automatic handling of authentication redirects

## Platform Support

This SDK automatically detects whether you're using Expo or bare React Native and uses the appropriate browser implementation:

- **Expo projects**: Uses `expo-web-browser` for in-app authentication
- **Bare React Native**: Uses `react-native-inappbrowser-reborn` for in-app authentication
- **Fallback**: Falls back to the device's default browser if in-app browsing is unavailable

## Usage

### Basic Usage

```jsx
import { IntastellarButton } from "@intastellar/signin-sdk-react-native";

function App() {
  const handleLogin = (account) => {
    console.log("User logged in:", account);
  };

  return (
    <IntastellarButton
      clientId="your-client-id"
      loginUri="myapp://auth"
      loginCallback={handleLogin}
    />
  );
}
```

### Using the Hook

```jsx
import { useIntastellarRN } from "@intastellar/signin-sdk-react-native";

function MyComponent() {
  const { users, token, isLoading, signin, logout, isSignedIn } = useIntastellarRN({
    clientId: "your-client-id",
    loginUri: "myapp://auth",
  });

  return (
    <View>
      {isSignedIn ? (
        <TouchableOpacity onPress={logout}>
          <Text>Sign Out</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={() => signin()}>
          <Text>Sign In</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
```

## How sign-in works

1. `signin()` opens Intastellar Accounts in an **auth session**:
   `WebBrowser.openAuthSessionAsync` on Expo, `InAppBrowser.openAuth` on bare
   React Native (iOS: ASWebAuthenticationSession, Android: Custom Tabs).
2. After sign-in, Accounts redirects to your `loginUri` with `?token=…`
   (`Entry=reactauth` — Accounts keeps your scheme, e.g. `myapp://auth`).
3. The auth session closes itself on that redirect and hands the URL back;
   the SDK verifies the token, stores it and calls `loginCallback`.

A redirect that **launches** the app (the app was closed meanwhile) is picked
up from `Linking.getInitialURL()`, and the deep-link listener covers the
external-browser fallback. Each token is handled once.

### `loginUri` in Expo Go

Expo Go can't open your own scheme. Build `loginUri` with `expo-linking` so it
matches where the app runs:

```jsx
import * as Linking from "expo-linking";

const loginUri = Linking.createURL("auth");
// Expo Go:                    exp://192.168.0.10:8081/--/auth
// development / store build:  myapp://auth   (app.json → expo.scheme)
```

With Expo Router, add a route for that path (e.g. `app/auth.js`) so the
redirect doesn't land on "Unmatched route".

### Redirect URIs

Intastellar Accounts only redirects to addresses registered for your
`clientId` — register your app's `loginUri` (and, for development,
`exp://…/--/auth`).

## Configuration

| Property        | Type     | Required | Description                               |
| --------------- | -------- | -------- | ----------------------------------------- |
| `clientId`      | string   | Yes      | Your Intastellar application client ID    |
| `loginUri`      | string   | Yes      | Deep link URI for authentication redirect |
| `scopes`        | string   | No       | OAuth scopes (default: "profile,email")   |
| `theme`         | object   | No       | Theme configuration                       |
| `loginCallback` | function | No       | Callback when login succeeds              |
| `errorCallback` | function | No       | Callback when login fails                 |

## Deep Link Setup

### iOS (Info.plist)

```xml
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleURLName</key>
    <string>myapp</string>
    <key>CFBundleURLSchemes</key>
    <array>
      <string>myapp</string>
    </array>
  </dict>
</array>
```

### Android (AndroidManifest.xml)

```xml
<activity
  android:name=".MainActivity"
  android:exported="true"
  android:launchMode="singleTop">
  <intent-filter>
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data android:scheme="myapp" />
  </intent-filter>
</activity>
```

## License

MIT © Intastellar Solutions International

## Changelog

### 1.2.0

- Sign-in uses an auth session (`openAuthSessionAsync` / `InAppBrowser.openAuth`):
  the browser closes itself on the redirect, no "Open in app?" prompt.
- Sends `Entry=reactauth` — Accounts redirects to `loginUri` with its own scheme.
- Handles a redirect that launched the app (`Linking.getInitialURL()`).
- Each redirect token is handled once.
- The hook returns `token` (also after an app restart).
