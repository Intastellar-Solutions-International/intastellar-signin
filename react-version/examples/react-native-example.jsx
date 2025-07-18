import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { IntastellarButton } from '@intastellar-solutions-international/signin-sdk/react-native';

export default function App() {
  const handleLogin = (account) => {
    console.log('User logged in:', account);
    Alert.alert('Success', `Welcome ${account.user.name.first}!`);
  };

  const handleError = (error) => {
    console.error('Login error:', error);
    Alert.alert('Error', `Login failed: ${error}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Intastellar Sign-In Demo</Text>
      <Text style={styles.subtitle}>
        Sign in with your Intastellar account:
      </Text>
      
      <IntastellarButton
        appName="Demo App"
        clientId="your-client-id"
        loginCallback={handleLogin}
        scopes="profile,email"
        loginUri="myapp://auth" // Replace with your app's deep link
        theme={{ theme: 'light', picker: 'button' }}
        style={styles.button}
        textStyle={styles.buttonText}
      />
      
      <View style={styles.note}>
        <Text style={styles.noteText}>
          Replace "your-client-id" with your actual client ID from the Intastellar developer console.
        </Text>
        <Text style={styles.noteText}>
          Make sure to configure deep links for authentication to work properly.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: 'center',
    color: '#666',
  },
  button: {
    marginVertical: 20,
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  buttonText: {
    fontSize: 16,
  },
  note: {
    marginTop: 40,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dadce0',
  },
  noteText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 5,
  },
});
