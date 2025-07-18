import { IntastellarUser, IntastellarAccount, IntastellarError } from './types';

export class IntastellarAPI {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async getUsers(): Promise<IntastellarUser[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/usercontent/js/getuser?origin=mobile-app`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      return data.users || [];
    } catch (error) {
      console.error('Error fetching users:', error);
      throw new IntastellarError('Failed to fetch users');
    }
  }

  async signin(email?: string): Promise<{ success: boolean; message?: string; data?: any }> {
    try {
      const requestBody: any = {};
      if (email) {
        requestBody.email = email;
      }

      const response = await fetch(`${this.baseUrl}/usercontent/js/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error('Signin request failed');
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('Error during signin:', error);
      throw new IntastellarError('Signin failed');
    }
  }

  async signout(): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/usercontent/js/signout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Signout request failed');
      }
    } catch (error) {
      console.error('Error during signout:', error);
      throw new IntastellarError('Signout failed');
    }
  }

  async switchAccount(account: IntastellarAccount): Promise<void> {
    try {
      // Get domain from React Native specific method or use default
      const domain = 'mobile-app';

      const response = await fetch(
        `${this.baseUrl}/usercontent/js/redirect?token=${account.token}&domain=${domain}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        }
      );

      if (!response.ok) {
        throw new Error('Account switch failed');
      }
    } catch (error) {
      console.error('Error switching account:', error);
      throw new IntastellarError('Account switch failed');
    }
  }
}
