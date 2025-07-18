# In-App Browser Setup for React Native

## 🎉 Features Added

The React Native SDK now supports **in-app browser** authentication for a seamless user experience!

## 📦 Installation

### 1. Install the SDK

```bash
npm install @intastellar/signin-sdk-react-native@1.0.1
```

### 2. Install Required Dependencies

```bash
npm install @react-native-async-storage/async-storage react-native-inappbrowser-reborn
```

### 3. Platform Setup

#### iOS Setup

```bash
cd ios && pod install
```

#### Android Setup

No additional setup needed for Android.

## 🚀 How It Works

The SDK now automatically:

1. **Opens an in-app browser** when `signin()` is called
2. **Handles the OAuth flow** within your app
3. **Captures the redirect** back to your app
4. **Extracts the authentication token** automatically
5. **Fallback to external browser** if in-app browser is unavailable

## 💡 Smart Fallback System

The SDK includes intelligent fallback:

- ✅ **First**: Tries to use in-app browser for seamless experience
- ✅ **Fallback**: Uses external browser if in-app browser is not available
- ✅ **Graceful**: No crashes if `react-native-inappbrowser-reborn` is not installed

## 🔧 Configuration

### Basic Usage (Automatic In-App Browser)

```jsx
import {
  IntastellarButton,
  useIntastellarRN,
} from "@intastellar/signin-sdk-react-native";

function App() {
  const config = {
    clientId: "your-client-id",
    appName: "Your App Name",
    loginUri: "yourapp://auth", // Your deep link scheme
    loginCallback: (account) => {
      console.log("User authenticated:", account);
    },
  };

  return (
    <View>
      <IntastellarButton {...config} />
    </View>
  );
}
```

### Advanced Hook Usage

```jsx
import { useIntastellarRN } from "@intastellar/signin-sdk-react-native";

function CustomSignIn() {
  const { signin, users, isLoading, error } = useIntastellarRN({
    clientId: "your-client-id",
    appName: "Your App Name",
    loginUri: "yourapp://auth",
  });

  const handleSignIn = async () => {
    await signin(); // Opens in-app browser automatically
  };

  return (
    <TouchableOpacity onPress={handleSignIn} disabled={isLoading}>
      <Text>Sign In with Intastellar</Text>
    </TouchableOpacity>
  );
}
```

## 🎨 Browser Customization

The in-app browser is pre-configured with:

- **iOS**: Purple theme (`#453AA4`), full-screen modal
- **Android**: Material Design colors, smooth animations
- **Animations**: Slide transitions
- **Toolbar**: Branded colors and controls

## 🔗 Deep Link Setup

Make sure your app handles the redirect URI properly:

### iOS (Info.plist)

```xml
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleURLName</key>
    <string>yourapp</string>
    <key>CFBundleURLSchemes</key>
    <array>
      <string>yourapp</string>
    </array>
  </dict>
</array>
```

### Android (android/app/src/main/AndroidManifest.xml)

```xml
<activity
  android:name=".MainActivity"
  android:exported="true"
  android:launchMode="singleTop"
  android:theme="@style/LaunchTheme">

  <intent-filter android:autoVerify="true">
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data android:scheme="yourapp" />
  </intent-filter>
</activity>
```

## 🆕 What's New in v1.0.1

- ✅ **In-app browser support** with `react-native-inappbrowser-reborn`
- ✅ **Smart fallback** to external browser
- ✅ **Optional dependency** - won't crash if not installed
- ✅ **Improved documentation** and setup guides
- ✅ **Better error handling** for browser operations

## 🔍 Troubleshooting

### In-App Browser Not Working?

1. Make sure `react-native-inappbrowser-reborn` is installed
2. Run `cd ios && pod install` for iOS
3. Check deep link configuration
4. The SDK will automatically fallback to external browser

### Still Having Issues?

The SDK includes extensive logging - check your console for helpful error messages and fallback notifications.

## 📱 User Experience

**Before**: User leaves your app → External browser → Manual return to app
**Now**: User stays in your app → Seamless in-app authentication → Automatic return

Perfect for a smooth, professional authentication flow! 🎉
