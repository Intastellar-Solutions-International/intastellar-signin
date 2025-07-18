# How to Publish @intastellar/signin-sdk to NPM

## Prerequisites

1. **NPM Account**: Create an account at [npmjs.com](https://npmjs.com)
2. **NPM CLI**: Make sure you have npm installed
3. **Login**: Run `npm login` to authenticate

## Private Package Setup Options

### Option 1: NPM Private Packages (Paid - $7/month)

- ✅ Easy to set up and use
- ✅ Integrates seamlessly with public NPM
- ✅ Professional and reliable
- ❌ Requires paid subscription

### Option 2: GitHub Packages (Free for private repos)

- ✅ Free for private repositories
- ✅ Integrates with GitHub
- ✅ Good for GitHub-based workflows
- ❌ Requires GitHub authentication setup
- ❌ More complex configuration

### Option 3: Local/Self-hosted (Free but complex)

- ✅ Completely free
- ✅ Full control
- ❌ Requires server setup and maintenance
- ❌ More complex to manage

## Setting Up GitHub Packages (Recommended for Private Use)

### 1. Create GitHub Personal Access Token

1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Select scopes: `write:packages`, `read:packages`, `delete:packages`
4. Copy the token (save it securely!)

### 2. Configure NPM for GitHub Packages

```bash
# Create or edit ~/.npmrc file
echo "@intastellar:registry=https://npm.pkg.github.com/" >> ~/.npmrc
echo "//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN" >> ~/.npmrc
```

### 3. Update package.json for GitHub Packages

```json
{
  "name": "@intastellar/signin-sdk",
  "publishConfig": {
    "registry": "https://npm.pkg.github.com/"
  }
}
```

### 4. Publish to GitHub Packages

```bash
npm publish
```

### 5. Install in Your Projects

```bash
# In your private projects, install from GitHub Packages
npm install @intastellar/signin-sdk
```

## Step-by-Step Publishing Process

### 1. Prepare the Package

```bash
# Navigate to your project directory
cd /Users/felixschultz/intastellar-signin

# Install dependencies
npm install --legacy-peer-deps

# Build the TypeScript to JavaScript
npm run build

# Test the build (optional)
npm run test
```

### 2. Update Version (if needed)

```bash
# For bug fixes
npm version patch   # 1.0.0 -> 1.0.1

# For new features
npm version minor   # 1.0.0 -> 1.1.0

# For breaking changes
npm version major   # 1.0.0 -> 2.0.0
```

### 3. Verify Package Contents

```bash
# Check what files will be included
npm pack --dry-run

# This should show:
# - dist/ folder with compiled JS and type definitions
# - README.md
# - package.json
# - LICENSE
```

### 4. Publish to NPM

#### Option A: Public Package (Free)

```bash
# First time publishing (public package)
npm publish --access public

# For subsequent updates
npm publish
```

#### Option B: Private Package on NPM (Paid)

```bash
# First time publishing (private package) - requires NPM Pro subscription
npm publish --access restricted

# For subsequent updates
npm publish
```

#### Option C: Private Package on GitHub Packages (Free for private repos)

```bash
# Configure GitHub Packages registry for @intastellar scope
npm config set @intastellar:registry https://npm.pkg.github.com/

# Login to GitHub Packages (use GitHub Personal Access Token)
npm login --registry=https://npm.pkg.github.com/

# Publish to GitHub Packages
npm publish
```

#### Option D: Local/Self-hosted Registry

```bash
# For local development or self-hosted registries
npm publish --registry http://your-private-registry.com
```

### 5. Verify Publication

```bash
# Check if package is published
npm view @intastellar/signin-sdk

# Test installation in a new project
mkdir test-install
cd test-install
npm init -y
npm install @intastellar/signin-sdk
```

## Testing the Published Package

### React Project Test

```bash
# Create a new React project
npx create-react-app test-intastellar-react
cd test-intastellar-react

# Install the SDK
npm install @intastellar/signin-sdk

# Copy the example code
cp ../examples/react-example.jsx src/App.js

# Start the project
npm start
```

### React Native Project Test

```bash
# Create a new React Native project
npx react-native init TestIntastellarRN
cd TestIntastellarRN

# Install the SDK and dependencies
npm install @intastellar/signin-sdk
npm install @react-native-async-storage/async-storage

# For iOS
cd ios && pod install && cd ..

# Copy the example code
cp ../examples/react-native-example.jsx App.js

# Run the project
npx react-native run-ios  # or run-android
```

## Package Structure

Your published package includes:

```
@intastellar/signin-sdk/
├── dist/
│   ├── index.js              # Main entry point
│   ├── index.d.ts            # TypeScript definitions
│   ├── api.js                # Core API functions
│   ├── api.d.ts              # API type definitions
│   ├── types.js              # Type definitions
│   ├── types.d.ts            # Type definitions
│   ├── react/
│   │   ├── index.js          # React exports
│   │   ├── index.d.ts        # React type definitions
│   │   ├── useIntastellar.js # React hook
│   │   └── IntastellarButton.js # React component
│   └── react-native/
│       ├── index.js          # React Native exports
│       ├── index.d.ts        # React Native type definitions
│       ├── useIntastellarRN.js # React Native hook
│       └── IntastellarButton.js # React Native component
├── package.json
├── README.md
└── LICENSE
```

## Usage Examples

### Basic React Usage

```jsx
import { IntastellarButton } from "@intastellar/signin-sdk";

function App() {
  return (
    <IntastellarButton
      appName="My App"
      clientId="your-client-id"
      loginCallback={(account) => console.log("Logged in:", account)}
    />
  );
}
```

### Basic React Native Usage

```jsx
import { IntastellarButtonRN } from "@intastellar/signin-sdk";

function App() {
  return (
    <IntastellarButtonRN
      appName="My App"
      clientId="your-client-id"
      loginUri="myapp://auth"
      loginCallback={(account) => console.log("Logged in:", account)}
    />
  );
}
```

### Using Hooks Directly

```jsx
// React
import { useIntastellar } from "@intastellar/signin-sdk";

function MyComponent() {
  const { users, signin, logout, isSignedIn } = useIntastellar({
    appName: "My App",
    clientId: "your-client-id",
  });

  return (
    <div>
      {isSignedIn ? (
        <button onClick={logout}>Sign Out</button>
      ) : (
        <button onClick={() => signin()}>Sign In</button>
      )}
    </div>
  );
}
```

```jsx
// React Native
import { useIntastellarRN } from "@intastellar/signin-sdk";

function MyComponent() {
  const { users, signin, logout, isSignedIn } = useIntastellarRN({
    appName: "My App",
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

## Troubleshooting

### Common Issues

1. **"Cannot resolve module"**: Make sure you're importing from the correct path
2. **TypeScript errors**: Check that your TypeScript version is compatible
3. **React Native deep links not working**: Verify your URL scheme configuration
4. **Popup blocked**: Ensure popups are enabled for your domain

### Publishing Issues

1. **Permission denied**: Make sure you're logged in with `npm whoami`
2. **Package name taken**: Use a scoped name like `@your-org/signin-sdk`
3. **Version already exists**: Increment version with `npm version patch`
4. **401 Unauthorized (GitHub Packages)**: Check your GitHub token permissions
5. **Registry mismatch**: Ensure you're publishing to the correct registry

### GitHub Packages Specific Issues

1. **"unauthenticated: User cannot be authenticated"**:

   - Check your GitHub Personal Access Token
   - Verify token has `write:packages` permission
   - Ensure token is not expired

2. **"Package not found" when installing**:

   - Verify your `.npmrc` file has the correct registry
   - Check that the package name matches your GitHub organization

3. **"403 Forbidden"**:
   - Ensure you have write access to the repository
   - Check that the package name matches the repository owner

### Private Package Installation in Projects

For private packages, your team members need to configure their npm as well:

```bash
# Each developer needs this in their ~/.npmrc
echo "@intastellar:registry=https://npm.pkg.github.com/" >> ~/.npmrc
echo "//npm.pkg.github.com/:_authToken=THEIR_GITHUB_TOKEN" >> ~/.npmrc
```

### Support

- Issues: [GitHub Issues](https://github.com/Intastellar-Solutions-International/intastellar-signin/issues)
- Documentation: [README.md](./README.md)
- Email: support@intastellar.com

## Version Management Best Practices

- **Patch (1.0.1)**: Bug fixes, security updates
- **Minor (1.1.0)**: New features, backward compatible changes
- **Major (2.0.0)**: Breaking changes, API modifications

Always test thoroughly before publishing and consider using `npm publish --dry-run` to preview what will be published.
