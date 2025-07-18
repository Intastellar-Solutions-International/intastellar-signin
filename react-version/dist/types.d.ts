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
export declare class IntastellarError extends Error {
    constructor(message: string);
}
//# sourceMappingURL=types.d.ts.map