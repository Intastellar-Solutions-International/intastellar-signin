import { useState, useCallback, useEffect } from 'react';
import { IntastellarAPI } from './api';
import { IntastellarUser, IntastellarAccount, IntastellarConfig, IntastellarError } from './types';

export interface UseIntastellarReturn {
  users: IntastellarUser[];
  isLoading: boolean;
  error: string | null;
  signin: (email?: string) => Promise<void>;
  logout: () => void;
  isSignedIn: boolean;
}

export function useIntastellar(config: IntastellarConfig): UseIntastellarReturn {
  const [users, setUsers] = useState<IntastellarUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSignedIn, setIsSignedIn] = useState(false);

  const getCookie = (name: string): string | undefined => {
    if (typeof document === 'undefined') return undefined;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
  };

  const setCookie = (name: string, value: string, domain: string, expires?: Date) => {
    if (typeof document === 'undefined') return;
    let cookieString = `${name}=${value}; domain=${domain}; path=/`;
    if (expires) {
      cookieString += `; expires=${expires.toUTCString()}`;
    }
    document.cookie = cookieString;
  };

  const getDomain = (): string => {
    if (typeof window === 'undefined') return '';
    let domain = window.location.hostname || window.location.host;
    const domainParts = domain.split('.');
    if (domainParts.length > 2) {
      domainParts.shift();
    }
    if (isNaN(Number(domainParts[0]))) {
      domain = domainParts.join('.');
    }
    return domain.split(':')[0];
  };

  const loadUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const fetchedUsers = await IntastellarAPI.getUsers();
      setUsers(fetchedUsers);
      setIsSignedIn(fetchedUsers.length > 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signin = useCallback(async (email?: string) => {
    try {
      setError(null);
      
      if (typeof window === 'undefined') {
        throw new IntastellarError('Window object not available');
      }
      
      const loginUri = config.loginUri || 
        `${location.hostname}${location.port ? ':' + location.port : ''}${location.pathname}`;
      
      const loginUrl = IntastellarAPI.buildLoginUrl({
        appName: config.appName,
        clientId: config.clientId,
        loginUri,
        scopes: config.scopes || 'profile',
        email,
        type: config.type || 'signin',
      });

      const loginWindow = window.open(
        loginUrl,
        'intastellarLogin',
        'height=719,width=500,left=100,top=100,resizable=no'
      );

      if (!loginWindow) {
        throw new IntastellarError('Please enable popups for this website');
      }

      // Listen for the token from the popup
      const messageListener = async (event: MessageEvent) => {
        const token = event.data;
        
        if (token && typeof token === 'string') {
          loginWindow.postMessage('iframe-token-received', event.origin);
          
          // Clean up event listener immediately
          window.removeEventListener('message', messageListener);
          
          try {
            const account = await IntastellarAPI.verifyToken(token);
            
            // Set cookie
            const expires = new Date();
            expires.setFullYear(expires.getFullYear() + 2);
            setCookie('inta_acc', token, getDomain(), expires);
            
            // Handle callback or redirect
            if (config.loginCallback) {
              config.loginCallback(account);
              // Use setTimeout to ensure callback completes before closing
              setTimeout(() => {
                if (!loginWindow.closed) {
                  loginWindow.close();
                }
              }, 100);
            } else if (config.loginUri) {
              const hasQuery = window.location.href.includes('?');
              const separator = hasQuery ? '&' : '?';
              window.location.href = `${window.location.protocol}//${config.loginUri}${separator}token=${JSON.stringify(account.user)}`;
              // Close window after redirect is initiated
              setTimeout(() => {
                if (!loginWindow.closed) {
                  loginWindow.close();
                }
              }, 100);
            } else {
              // No callback or redirect specified, just close the window
              loginWindow.close();
            }
            
            await loadUsers();
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Authentication failed');
            // Close window on error too
            if (!loginWindow.closed) {
              loginWindow.close();
            }
          }
        }
      };

      window.addEventListener('message', messageListener);

      // Check if window is closed and clean up
      const checkClosed = setInterval(() => {
        if (loginWindow.closed) {
          clearInterval(checkClosed);
          window.removeEventListener('message', messageListener);
        }
      }, 1000);

      // Cleanup function in case component unmounts
      const cleanup = () => {
        clearInterval(checkClosed);
        window.removeEventListener('message', messageListener);
        if (!loginWindow.closed) {
          loginWindow.close();
        }
      };

      // Store cleanup function for potential use
      (window as any).intastellarCleanup = cleanup;

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed');
    }
  }, [config, loadUsers]);

  const logout = useCallback(() => {
    const domain = getDomain();
    if (typeof document !== 'undefined') {
      document.cookie = `inta_acc=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${domain};`;
    }
    setUsers([]);
    setIsSignedIn(false);
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  return {
    users,
    isLoading,
    error,
    signin,
    logout,
    isSignedIn,
  };
}
