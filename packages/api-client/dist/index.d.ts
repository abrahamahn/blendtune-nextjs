import type { LoginRequest, SignupRequest, AuthResponse, User, Track } from '@blendtune/shared-types';
declare class APIClient {
    private client;
    private baseURL;
    constructor(baseURL?: string);
    auth: {
        login: (credentials: LoginRequest) => Promise<AuthResponse>;
        signup: (userData: SignupRequest) => Promise<any>;
        logout: () => Promise<any>;
        checkSession: () => Promise<User>;
        confirmEmail: (token: string) => Promise<any>;
        resetPassword: (email: string) => Promise<any>;
    };
    account: {
        getProfile: () => Promise<User>;
        updateProfile: (profileData: Partial<User>) => Promise<any>;
    };
    tracks: {
        getAll: () => Promise<Track[]>;
    };
    audio: {
        getStreamUrl: (trackId: string) => string;
    };
}
export declare const createApiClient: (baseURL?: string) => APIClient;
export declare const apiClient: APIClient;
export default apiClient;
