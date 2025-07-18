import { IntastellarUser, IntastellarConfig } from '../types';
export interface UseIntastellarReturn {
    users: IntastellarUser[];
    isLoading: boolean;
    error: string | null;
    signin: (email?: string) => Promise<void>;
    logout: () => void;
    isSignedIn: boolean;
}
export declare function useIntastellar(config: IntastellarConfig): UseIntastellarReturn;
//# sourceMappingURL=useIntastellar.d.ts.map