import { IntastellarUser, IntastellarConfig } from './types';
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
export declare function useIntastellarRN(config: IntastellarConfig): UseIntastellarRNReturn;
//# sourceMappingURL=useIntastellarRN.d.ts.map