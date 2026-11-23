export interface IntastellarUser {
    name: {
        first: string;
        last: string;
    };
    email: string;
    image: string;
    phone?: string;
    birthday?: string;
}
export interface IntastellarAccount {
    user: IntastellarUser;
    token: string;
    /**
     * Long-lived refresh token (apps, Entry=reactauth). Not stored by the SDK —
     * keep it in secure storage (Keychain / Keystore) and trade it for new
     * access tokens with refreshAccessToken().
     */
    refreshToken?: string;
}
export interface IntastellarTheme {
    theme?: 'light' | 'dark';
    scopes?: string;
    picker?: 'popup' | 'button';
    appName?: string;
}
export interface IntastellarConfig {
    appName: string;
    clientId: string;
    loginUri?: string;
    loginCallback?: (account: IntastellarAccount) => void;
    scopes?: string;
}
export interface IntastellarTokens {
    /** New access token (base64 JWT, valid for `expiresIn` seconds). */
    token: string;
    /** The refresh token to use next time — the old one is no longer valid. */
    refreshToken: string;
    expiresIn: number;
}
export declare class IntastellarError extends Error {
    constructor(message: string);
}
//# sourceMappingURL=types.d.ts.map