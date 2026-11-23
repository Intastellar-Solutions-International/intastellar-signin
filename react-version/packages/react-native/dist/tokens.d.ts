import { IntastellarTokens } from './types';
/** Intastellar Accounts' refresh endpoint (token.php). */
export declare const DEFAULT_TOKEN_URL = "https://www.intastellaraccounts.com/signin/v2/ws/oauth/token.php";
interface TokenRequest {
    refreshToken: string;
    clientId: string;
    tokenUrl?: string;
}
/**
 * Trades a refresh token for a new access token. The refresh token rotates:
 * store the returned `refreshToken` and discard the old one. Throws
 * IntastellarError('invalid_grant') when the user must sign in again.
 */
export declare function refreshAccessToken({ refreshToken, clientId, tokenUrl }: TokenRequest): Promise<IntastellarTokens>;
/** Revokes a refresh token (sign-out). Never throws. */
export declare function revokeRefreshToken({ refreshToken, clientId, tokenUrl }: TokenRequest): Promise<void>;
export {};
//# sourceMappingURL=tokens.d.ts.map