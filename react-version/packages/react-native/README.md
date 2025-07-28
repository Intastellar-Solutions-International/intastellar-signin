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
  const { users, isLoading, signin, logout, isSignedIn } = useIntastellarRN({
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
