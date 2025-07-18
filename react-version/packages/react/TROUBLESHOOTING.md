# Troubleshooting "Invalid Hook Call" Error

## Common Solutions

### 1. Check React Version Compatibility

Make sure your React version is compatible:

```bash
npm ls react
```

The SDK requires React >=16.8.0

### 2. Install Peer Dependencies

Install both React and React DOM:

```bash
npm install react react-dom
```

### 3. Check for Multiple React Versions

```bash
npm ls react
npm ls react-dom
```

If you see multiple versions, you need to resolve the conflict.

### 4. Use npm dedupe (if using npm)

```bash
npm dedupe
```

### 5. Clear node_modules and reinstall

```bash
rm -rf node_modules package-lock.json
npm install
```

### 6. Webpack Configuration (if applicable)

Add to your webpack config:

```javascript
module.exports = {
  resolve: {
    alias: {
      react: path.resolve("./node_modules/react"),
      "react-dom": path.resolve("./node_modules/react-dom"),
    },
  },
};
```

### 7. For Create React App users

If using Create React App, the issue might be in your dependencies. Try:

```bash
npm install --save-exact react react-dom
```

## Example Usage

```jsx
import React from "react";
import { IntastellarButton } from "@intastellar/signin-sdk-react";

function App() {
  const config = {
    clientId: "your-client-id",
    redirectUri: "http://localhost:3000/callback",
    loginCallback: (account) => {
      console.log("Logged in:", account);
    },
  };

  return (
    <div>
      <IntastellarButton {...config} />
    </div>
  );
}

export default App;
```

## If the problem persists

1. Check that you're not importing React hooks directly in your parent component from a different React instance
2. Ensure you're not bundling React with the SDK package
3. Make sure your bundler is treating React as an external dependency for the SDK
