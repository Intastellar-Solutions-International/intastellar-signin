# Expo Integration Guide

This guide shows how to use the Intastellar authentication SDK with Expo projects.

## Installation

For Expo projects, install the React Native SDK with the required Expo dependencies:

```bash
npx expo install @intastellar/signin-sdk-react-native @react-native-async-storage/async-storage expo-web-browser expo-constants
```

## Automatic Detection

The SDK automatically detects if you're running in an Expo environment by checking for `expo-constants`. No additional configuration is needed!

## Platform-Specific Behavior

### Expo Managed Workflow
- Uses `expo-web-browser` for in-app authentication
- Provides a smooth, native-like experience
- No need to install `react-native-inappbrowser-reborn`

### Bare React Native Projects
- Uses `react-native-inappbrowser-reborn` for in-app authentication
- Requires iOS pod installation for bare React Native
- Fallback to system browser if in-app browser fails

## Example Usage

```jsx
import React from 'react';
import { View, Text } from 'react-native';
import { IntastellarButton } from '@intastellar/signin-sdk-react-native';

export default function App() {
  const handleLogin = (account) => {
    console.log('User logged in:', account);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Welcome to Intastellar Auth</Text>
      <IntastellarButton
        clientId="your-client-id"
        loginUri="myapp://auth"
        loginCallback={handleLogin}
      />
    </View>
  );
}
```

## Deep Link Configuration

### app.json/app.config.js

```json
{
  "expo": {
    "scheme": "myapp",
    "platforms": ["ios", "android"]
  }
}
```

### Linking Configuration

```jsx
import { Linking } from 'expo-linking';

const linking = {
  prefixes: ['myapp://'],
  config: {
    screens: {
      Auth: 'auth',
    },
  },
};
```

## Testing

You can test the authentication flow in:
- Expo Go (development)
- Development builds
- Production builds

The SDK will automatically choose the correct browser implementation based on your environment.

## Troubleshooting

### Browser Not Opening
- Ensure you have the correct dependencies installed
- Check that your deep link scheme is properly configured
- Verify your `loginUri` matches your app's URL scheme

### Authentication Not Working
- Confirm your `clientId` is correct
- Check that your deep link is properly registered
- Look at console logs for debugging information

## Version Compatibility

- `@intastellar/signin-sdk-react-native` v1.1.0+
- `expo-web-browser` v12.0.0+
- `expo-constants` v14.0.0+
- Expo SDK 48+
