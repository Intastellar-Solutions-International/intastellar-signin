# @intastellar/signin-sdk-react-native

Official Intastellar authentication SDK for React Native applications.

## Installation

```bash
npm install @intastellar/signin-sdk-react-native
```

### Required Dependencies

You also need to install the peer dependencies:

```bash
npm install @react-native-async-storage/async-storage react-native-inappbrowser-reborn
```

### iOS Setup (for react-native-inappbrowser-reborn)

Run the following command:

```bash
cd ios && pod install
```

### Android Setup (for react-native-inappbrowser-reborn)

No additional setup needed for Android.

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
import { useIntastellarRN } from "@intastellar-solutions-international/signin-sdk-react-native";

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
| `baseUrl`       | string   | Yes      | Intastellar API base URL                  |
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
