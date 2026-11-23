import { useState, useEffect, useCallback, useRef } from 'react';
import { Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IntastellarUser, IntastellarAccount, IntastellarConfig, IntastellarError } from './types';

// Optional imports for different in-app browser solutions
let InAppBrowser: any = null;
let ExpoWebBrowser: any = null;
let isExpo = false;

// Check if running in Expo
try {
  require('expo-constants');
  isExpo = true;
} catch (e) {
  isExpo = false;
}

// Import appropriate browser library
if (isExpo) {
  try {
    ExpoWebBrowser = require('expo-web-browser');
  } catch (e) {
    console.warn('expo-web-browser not found. Will use external browser.');
  }
} else {
  try {
    InAppBrowser = require('react-native-inappbrowser-reborn').InAppBrowser;
  } catch (e) {
    console.warn('react-native-inappbrowser-reborn not found. Will use external browser.');
  }
}

const TOKEN_KEY = 'intastellar_token';

export interface UseIntastellarRNReturn {
  users: IntastellarUser[];
  /** The signed-in account's token (also after an app restart), or null. */
  token: string | null;
  isLoading: boolean;
  error: string | null;
  signin: (email?: string) => Promise<void>;
  logout: () => Promise<void>;
  isSignedIn: boolean;
}

/** The ?token= of a redirect URL, or null. Works for custom schemes and exp:// too. */
function tokenFromUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    return new URL(url).searchParams.get('token');
  } catch {
    const match = /[?&]token=([^&#]+)/.exec(url);
    return match ? decodeURIComponent(match[1]) : null;
  }
}

export function useIntastellarRN(config: IntastellarConfig): UseIntastellarRNReturn {
  const [users, setUsers] = useState<IntastellarUser[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSignedIn, setIsSignedIn] = useState(false);

  // The redirect can arrive through several paths at once (the auth
  // session's result, the deep-link listener, the launch URL) — handle each
  // token once.
  const handledToken = useRef<string | null>(null);
  // Always call the latest loginCallback without re-subscribing listeners.
  const loginCallback = useRef(config.loginCallback);
  loginCallback.current = config.loginCallback;

  const verifyToken = async (candidate: string): Promise<IntastellarAccount> => {
    const response = await fetch('https://apis.intastellaraccounts.com/verify', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${candidate}`,
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
        token: candidate,
      };
    } else {
      throw new IntastellarError(result.error);
    }
  };

  const loadStoredToken = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(TOKEN_KEY);
      if (stored) {
        const account = await verifyToken(stored);
        setUsers([account.user]);
        setToken(stored);
        setIsSignedIn(true);
      }
    } catch (err) {
      console.error('Error loading stored token:', err);
      await AsyncStorage.removeItem(TOKEN_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /** Completes sign-in from a redirect URL (…?token=…). Ignores URLs without a token. */
  const handleRedirect = useCallback(async (url: string | null | undefined) => {
    const received = tokenFromUrl(url);
    if (!received || handledToken.current === received) return;
    handledToken.current = received;
    try {
      const account = await verifyToken(received);
      await AsyncStorage.setItem(TOKEN_KEY, received);
      setUsers([account.user]);
      setToken(received);
      setIsSignedIn(true);
      setError(null);
      loginCallback.current?.(account);
    } catch (err) {
      handledToken.current = null;
      setError(err instanceof Error ? err.message : 'Authentication failed');
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
        // Intastellar Accounts' app flow: redirects to `continue` (keeping
        // its scheme, e.g. myapp:// or exp://) with ?token=…, or posts the
        // token to a React Native WebView when it runs inside one.
        Entry: 'reactauth',
        scope: config.scopes || 'profile',
      });

      if (email) {
        params.append('identifier', email);
      }

      const baseUrl = email
        ? 'https://www.intastellaraccounts.com/signin/v2/ws/oauth/pwd'
        : 'https://www.intastellaraccounts.com/signin/v2/ws/oauth/oauthchooser';

      const loginUrl = `${baseUrl}?${params.toString()}`;

      // Auth sessions (ASWebAuthenticationSession / Custom Tabs) close
      // themselves when the browser reaches loginUri and hand back that URL
      // — no "Open in app?" prompt, and no reliance on the deep-link
      // listener.
      try {
        if (isExpo && ExpoWebBrowser?.openAuthSessionAsync) {
          const result = await ExpoWebBrowser.openAuthSessionAsync(loginUrl, loginUri, {
            showInRecents: false,
          });
          if (result?.type === 'success') await handleRedirect(result.url);
        } else if (!isExpo && InAppBrowser && await InAppBrowser.isAvailable()) {
          const result = await InAppBrowser.openAuth(loginUrl, loginUri, {
            // iOS
            ephemeralWebSession: false,
            // Android
            showTitle: true,
            enableUrlBarHiding: true,
            enableDefaultShare: false,
          });
          if (result?.type === 'success') await handleRedirect(result.url);
        } else {
          // No in-app browser: the redirect comes back through the deep-link listener.
          await Linking.openURL(loginUrl);
        }
      } catch (browserError) {
        console.warn('Browser opening failed, falling back to external browser:', browserError);
        await Linking.openURL(loginUrl);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed');
    }
  }, [config.appName, config.clientId, config.loginUri, config.scopes, handleRedirect]);

  const logout = useCallback(async () => {
    await AsyncStorage.removeItem(TOKEN_KEY);
    handledToken.current = null;
    setUsers([]);
    setToken(null);
    setIsSignedIn(false);
  }, []);

  useEffect(() => {
    loadStoredToken();

    // A redirect that launched the app arrives as the initial URL, before
    // any listener exists.
    Linking.getInitialURL().then(handleRedirect).catch(() => {});

    // Redirects while the app is running (e.g. the external-browser fallback).
    const subscription = Linking.addEventListener('url', ({ url }) => {
      handleRedirect(url);
    });

    return () => subscription?.remove();
  }, [loadStoredToken, handleRedirect]);

  return {
    users,
    token,
    isLoading,
    error,
    signin,
    logout,
    isSignedIn,
  };
}
