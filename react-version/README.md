# Intastellar Sign-In SDK

Official authentication SDK for Intastellar accounts, supporting both React and React Native applications.

## Installation

```bash
npm install @intastellar/signin-sdk
```

For React Native projects, you'll also need:

```bash
npm install @react-native-async-storage/async-storage
```

## Quick Start

### React Usage

```jsx
import React from "react";
import { IntastellarButton } from "@intastellar/signin-sdk";

function App() {
  const handleLogin = (account) => {
    console.log("User logged in:", account);
    // Handle successful authentication
  };

  return (
    <div>
      <h1>My App</h1>
      <IntastellarButton
        appName="My App"
        clientId="your-client-id"
        loginCallback={handleLogin}
        scopes="profile,email"
        theme={{ theme: "light", picker: "button" }}
      />
    </div>
  );
}

export default App;
```

### React Native Usage

```jsx
import React from "react";
import { View, StyleSheet } from "react-native";
import { IntastellarButtonRN } from "@intastellar/signin-sdk";

export default function App() {
  const handleLogin = (account) => {
    console.log("User logged in:", account);
    // Handle successful authentication
  };

  return (
    <View style={styles.container}>
      <IntastellarButtonRN
        appName="My App"
        clientId="your-client-id"
        loginCallback={handleLogin}
        scopes="profile,email"
        theme={{ theme: "light", picker: "button" }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
});
```

## Advanced Usage

### Using the Hook Directly

#### React

```jsx
import React from "react";
import { useIntastellar } from "@intastellar/signin-sdk";

function MyComponent() {
  const { users, isLoading, signin, logout, isSignedIn, error } =
    useIntastellar({
      appName: "My App",
      clientId: "your-client-id",
      scopes: "profile,email",
      loginCallback: (account) => {
        console.log("Login successful:", account);
      },
    });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {isSignedIn ? (
        <div>
          <p>Welcome, {users[0]?.name.first}!</p>
          <button onClick={logout}>Sign Out</button>
        </div>
      ) : (
        <button onClick={() => signin()}>Sign In</button>
      )}
    </div>
  );
}
```

#### React Native

```jsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useIntastellarRN } from "@intastellar/signin-sdk";

function MyComponent() {
  const { users, isLoading, signin, logout, isSignedIn, error } =
    useIntastellarRN({
      appName: "My App",
      clientId: "your-client-id",
      scopes: "profile,email",
      loginUri: "myapp://auth", // Your app's deep link scheme
      loginCallback: (account) => {
        console.log("Login successful:", account);
      },
    });

  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error}</Text>;

  return (
    <View>
      {isSignedIn ? (
        <View>
          <Text>Welcome, {users[0]?.name.first}!</Text>
          <TouchableOpacity onPress={logout}>
            <Text>Sign Out</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity onPress={() => signin()}>
          <Text>Sign In</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
```

## Configuration Options

### IntastellarConfig

| Property        | Type       | Required | Description                                |
| --------------- | ---------- | -------- | ------------------------------------------ |
| `appName`       | `string`   | Yes      | Your application name                      |
| `clientId`      | `string`   | Yes      | Your Intastellar client ID                 |
| `loginUri`      | `string`   | No       | Custom login redirect URI                  |
| `loginCallback` | `function` | No       | Called when login succeeds                 |
| `scopes`        | `string`   | No       | Requested permissions (default: "profile") |

### IntastellarTheme

| Property | Type                  | Default    | Description              |
| -------- | --------------------- | ---------- | ------------------------ |
| `theme`  | `'light' \| 'dark'`   | `'light'`  | Button theme             |
| `picker` | `'popup' \| 'button'` | `'button'` | Authentication flow type |

## React Native Setup

### Deep Links Configuration

For React Native, you need to configure deep links to handle authentication redirects.

#### iOS (ios/YourApp/Info.plist)

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

#### Android (android/app/src/main/AndroidManifest.xml)

```xml
<activity
  android:name=".MainActivity"
  android:launchMode="singleTask">
  <intent-filter>
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data android:scheme="myapp" />
  </intent-filter>
</activity>
```

## API Reference

### useIntastellar (React)

Returns an object with:

- `users: IntastellarUser[]` - Array of authenticated users
- `isLoading: boolean` - Loading state
- `error: string | null` - Error message if any
- `signin: (email?: string) => Promise<void>` - Sign in function
- `logout: () => void` - Sign out function
- `isSignedIn: boolean` - Authentication status

### useIntastellarRN (React Native)

Same as `useIntastellar` but with:

- `logout: () => Promise<void>` - Async logout function

### IntastellarUser Type

```typescript
interface IntastellarUser {
  name: {
    first: string;
    last: string;
  };
  email: string;
  image: string;
  phone?: string;
  birthday?: string;
}
```

### IntastellarAccount Type

```typescript
interface IntastellarAccount {
  user: IntastellarUser;
  token: string;
}
```

## Troubleshooting

### Common Issues

1. **Popup blocked**: Ensure popups are enabled for your domain
2. **CORS errors**: Check your domain is registered with Intastellar
3. **React Native deep links**: Verify your URL scheme configuration

### Support

- Documentation: [https://developers.intastellarsolutions.com/identity/sign-in/web/docs](https://developers.intastellarsolutions.com/identity/sign-in/web/docs)
- Issues: [GitHub Issues](https://github.com/Intastellar-Solutions-International/intastellar-signin/issues)
- Email: support@intastellar.com

## License

MIT License. See [LICENSE](LICENSE) file for details.
