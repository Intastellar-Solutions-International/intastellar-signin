import { useState, useEffect, useCallback } from 'react';
import { Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IntastellarUser, IntastellarAccount, IntastellarConfig, IntastellarError } from './types';

export interface UseIntastellarRNReturn {
  users: IntastellarUser[];
  isLoading: boolean;
  error: string | null;
  signin: (email?: string) => Promise<void>;
  logout: () => Promise<void>;
  isSignedIn: boolean;
}

export function useIntastellarRN(config: IntastellarConfig): UseIntastellarRNReturn {
  const [users, setUsers] = useState<IntastellarUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSignedIn, setIsSignedIn] = useState(false);

  const verifyToken = async (token: string): Promise<IntastellarAccount> => {
    const response = await fetch('https://apis.intastellaraccounts.com/verify', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    
    const result = await response.json();
    
    if (result.statusCode === 200) {
      const { phone, birthday } = result.account.user[0];
      result.account.user.phone = phone;
      result.account.user.birthday = birthday;
      delete result.account.user[0];
      
      return {
        user: result.account.user,
        token,
      };
    } else {
      throw new IntastellarError(result.error);
    }
  };

  const loadStoredToken = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('intastellar_token');
      if (token) {
        const account = await verifyToken(token);
        setUsers([account.user]);
        setIsSignedIn(true);
      }
    } catch (err) {
      console.error('Error loading stored token:', err);
      await AsyncStorage.removeItem('intastellar_token');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signin = useCallback(async (email?: string) => {
    try {
      setError(null);
      
      const loginUri = config.loginUri || 'your-app://auth';
      
      const params = new URLSearchParams({
        service: config.appName,
        continue: loginUri,
        entryFlow: btoa(config.scopes || 'profile'),
        key: config.clientId,
        passive: 'true',
        flowName: 'GeneralOAuthFlow',
        Entry: 'webauthsignin',
        scope: config.scopes || 'profile',
      });
      
      if (email) {
        params.append('identifier', email);
      }
      
      const baseUrl = email 
        ? 'https://www.intastellaraccounts.com/signin/v2/ws/oauth/pwd'
        : 'https://www.intastellaraccounts.com/signin/v2/ws/oauth/oauthchooser';
      
      const loginUrl = `${baseUrl}?${params.toString()}`;
      
      await Linking.openURL(loginUrl);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed');
    }
  }, [config]);

  const handleDeepLink = useCallback(async (url: string) => {
    try {
      const urlObj = new URL(url);
      const token = urlObj.searchParams.get('token');
      
      if (token) {
        const account = await verifyToken(token);
        await AsyncStorage.setItem('intastellar_token', token);
        
        setUsers([account.user]);
        setIsSignedIn(true);
        
        if (config.loginCallback) {
          config.loginCallback(account);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    }
  }, [config.loginCallback]);

  const logout = useCallback(async () => {
    await AsyncStorage.removeItem('intastellar_token');
    setUsers([]);
    setIsSignedIn(false);
  }, []);

  useEffect(() => {
    loadStoredToken();
    
    // Listen for deep links
    const subscription = Linking.addEventListener('url', ({ url }) => {
      handleDeepLink(url);
    });
    
    return () => subscription?.remove();
  }, [loadStoredToken, handleDeepLink]);

  return {
    users,
    isLoading,
    error,
    signin,
    logout,
    isSignedIn,
  };
}
