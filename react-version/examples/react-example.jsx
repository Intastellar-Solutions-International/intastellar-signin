import React from 'react';
import { IntastellarButton } from '@intastellar/signin-sdk';

function App() {
  const handleLogin = (account) => {
    console.log('User logged in:', account);
    alert(`Welcome ${account.user.name.first}!`);
  };

  const handleError = (error) => {
    console.error('Login error:', error);
    alert(`Login failed: ${error}`);
  };

  return (
    <div style={{ 
      padding: '40px', 
      textAlign: 'center',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1>Intastellar Sign-In Demo</h1>
      <p>Click the button below to sign in with your Intastellar account:</p>
      
      <IntastellarButton
        appName="Demo App"
        clientId="your-client-id"
        loginCallback={handleLogin}
        scopes="profile,email"
        theme={{ theme: 'light', picker: 'button' }}
        style={{ 
          margin: '20px auto',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px 20px',
          fontSize: '16px',
          borderRadius: '6px',
          border: '2px solid #dadce0',
          backgroundColor: '#fff',
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
      />
      
      <div style={{ marginTop: '40px', fontSize: '14px', color: '#666' }}>
        <p>This demo shows how easy it is to integrate Intastellar authentication.</p>
        <p>Replace "your-client-id" with your actual client ID from the Intastellar developer console.</p>
      </div>
    </div>
  );
}

export default App;
