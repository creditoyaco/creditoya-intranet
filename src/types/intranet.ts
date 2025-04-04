export type ScalarUserIntranet = {
    id?: string;
    password: string;
    email: string;
    name?: string;
    lastNames?: string;
    avatar?: string;
    rol?: RolIntranet;
    isActive?: boolean;
    phone?: string;
    created_at?: Date;
    updated_at?: Date;
};

export type RolIntranet = "admin" | "employee";

export interface JwtPayload {
    sub: string;
    email: string;
    rol: string;
    type: string;
    iat: number;
    exp: number;
}

export interface AuthState {
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    accessToken: string | null;
    user: Omit<ScalarUserIntranet, 'password'> | null;
}

export interface LoadingState {
    isLoading: boolean;
    message: string;
    error: string | null;
}

export interface AuthContextType extends AuthState {
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    hasRole: (roles: string | string[]) => boolean;
    startLoading: (key: string, message?: string) => void;
    stopLoading: (key: string, error?: string | null) => void;
    getLoadingState: (key: string) => LoadingState;
    withLoading: <T>(key: string, loadingMessage: string, operation: () => Promise<T>) => Promise<{ success: boolean; data?: T; error?: string }>;
    loadingStates: Record<string, LoadingState>;
}