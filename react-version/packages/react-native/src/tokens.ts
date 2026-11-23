import { IntastellarError, IntastellarTokens } from './types';

/** Intastellar Accounts' refresh endpoint (token.php). */
export const DEFAULT_TOKEN_URL = 'https://www.intastellaraccounts.com/signin/v2/ws/oauth/token.php';

interface TokenRequest {
  refreshToken: string;
  clientId: string;
  tokenUrl?: string;
}

async function post(tokenUrl: string, body: object) {
  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(body),
  });
  const result = await response.json().catch(() => null);
  return { ok: response.ok, status: response.status, result };
}

/**
 * Trades a refresh token for a new access token. The refresh token rotates:
 * store the returned `refreshToken` and discard the old one. Throws
 * IntastellarError('invalid_grant') when the user must sign in again.
 */
export async function refreshAccessToken({ refreshToken, clientId, tokenUrl = DEFAULT_TOKEN_URL }: TokenRequest): Promise<IntastellarTokens> {
  const { ok, result } = await post(tokenUrl, { action: 'refresh', refresh_token: refreshToken, key: clientId });
  if (!ok || !result?.token || !result?.refresh_token) {
    throw new IntastellarError(result?.error || 'invalid_grant');
  }
  return { token: result.token, refreshToken: result.refresh_token, expiresIn: Number(result.expires_in) || 3600 };
}

/** Revokes a refresh token (sign-out). Never throws. */
export async function revokeRefreshToken({ refreshToken, clientId, tokenUrl = DEFAULT_TOKEN_URL }: TokenRequest): Promise<void> {
  await post(tokenUrl, { action: 'revoke', refresh_token: refreshToken, key: clientId }).catch(() => undefined);
}
