# @intastellar-solutions-international/signin-sdk-react

Official Intastellar authentication SDK for React applications.

## Installation

```bash
npm install @intastellar-solutions-international/signin-sdk-react
```

## Usage

### Basic Usage

```jsx
import { IntastellarButton } from "@intastellar-solutions-international/signin-sdk-react";

function App() {
  const handleLogin = (account) => {
    console.log("User logged in:", account);
  };

  return (
    <IntastellarButton
      clientId="your-client-id"
      baseUrl="https://api.intastellar.app"
      loginCallback={handleLogin}
    />
  );
}
```

### Using the Hook

```jsx
import { useIntastellar } from "@intastellar-solutions-international/signin-sdk-react";

function MyComponent() {
  const { users, isLoading, signin, logout, isSignedIn } = useIntastellar({
    clientId: "your-client-id",
    baseUrl: "https://api.intastellar.app",
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

## Configuration

| Property        | Type     | Required | Description                             |
| --------------- | -------- | -------- | --------------------------------------- |
| `clientId`      | string   | Yes      | Your Intastellar application client ID  |
| `baseUrl`       | string   | Yes      | Intastellar API base URL                |
| `scopes`        | string   | No       | OAuth scopes (default: "profile,email") |
| `theme`         | object   | No       | Theme configuration                     |
| `loginCallback` | function | No       | Callback when login succeeds            |
| `errorCallback` | function | No       | Callback when login fails               |

## License

MIT © Intastellar Solutions International
