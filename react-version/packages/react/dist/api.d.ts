import { IntastellarUser, IntastellarAccount } from './types';
export declare class IntastellarAPI {
    private static baseUrl;
    static getUsers(): Promise<IntastellarUser[]>;
    static verifyToken(token: string): Promise<IntastellarAccount>;
    static buildLoginUrl(config: {
        appName: string;
        clientId: string;
        loginUri: string;
        scopes: string;
        email?: string;
    }): string;
}
//# sourceMappingURL=api.d.ts.map