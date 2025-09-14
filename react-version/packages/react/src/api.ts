import { IntastellarUser, IntastellarAccount, IntastellarError } from './types';

export class IntastellarAPI {
  private static baseUrl = 'https://apis.intastellaraccounts.com';
  
  static async getUsers(): Promise<IntastellarUser[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/usercontent/js/getuser?origin=${typeof window !== 'undefined' ? window.location.host : ''}`,
        {
          method: 'GET',
          credentials: 'include',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
      if (response.status === 200) {
        return await response.json();
      }
      return [];
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  }
  
  static async verifyToken(token: string): Promise<IntastellarAccount> {
    const response = await fetch(`${this.baseUrl}/verify`, {
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
  }
  
  static buildLoginUrl(config: {
    appName: string;
    clientId: string;
    loginUri: string;
    scopes: string;
    email?: string;
    type?: 'signin' | 'signup';
  }): string {
    const { appName, clientId, loginUri, scopes, email, type } = config;

    let domain = '';
    if (typeof window !== 'undefined') {
      domain = window.location.hostname || window.location.host;
      const domainParts = domain.split('.');
      if (domainParts.length > 2) {
        domainParts.shift();
      }
      if (isNaN(Number(domainParts[0]))) {
        domain = domainParts.join('.');
      }
      if (window.location.port) {
        domain += ':' + window.location.port;
      }
    }
    
    const baseUrl = email 
      ? 'https://www.intastellaraccounts.com/signin/v2/ws/oauth/pwd'
      : type === 'signup'
      ? 'https://www.intastellaraccounts.com/Signup/'
      : 'https://www.intastellaraccounts.com/signin/v2/ws/oauth/oauthchooser';
    
    const params = new URLSearchParams({
      service: appName,
      continue: loginUri,
      entryFlow: btoa(scopes),
      key: clientId,
      access_id: encodeURIComponent(domain),
      passive: 'true',
      flowName: 'GeneralOAuthFlow',
      Entry: 'webauthsignin',
      scope: scopes,
    });
    
    if (email) {
      params.append('identifier', email);
    }
    
    return `${baseUrl}?${params.toString()}`;
  }
}
