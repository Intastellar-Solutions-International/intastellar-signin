import { IntastellarUser, IntastellarAccount } from './types';
export declare class IntastellarAPI {
    private baseUrl;
    constructor(baseUrl: string);
    getUsers(): Promise<IntastellarUser[]>;
    signin(email?: string): Promise<{
        success: boolean;
        message?: string;
        data?: any;
    }>;
    signout(): Promise<void>;
    switchAccount(account: IntastellarAccount): Promise<void>;
}
//# sourceMappingURL=api.d.ts.map