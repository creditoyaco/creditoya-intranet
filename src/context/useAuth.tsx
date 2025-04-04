"use client"

import { AuthContextType, AuthState, JwtPayload, LoadingState } from "@/types/intranet";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

// Claves para almacenamiento - Exactamente las mismas que en el middleware
const TOKEN_KEY = '@creditoya:token';
const USER_KEY = '@creditoya:user';

// Crear contexto
const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [authState, setAuthState] = useState<AuthState>({
        isAuthenticated: false,
        isLoading: true,
        error: null,
        accessToken: null,
        user: null
    });

    const [loadingStates, setLoadingStates] = useState<Record<string, LoadingState>>({});

    const router = useRouter();

    // Configurar interceptor para todos los requests
    useEffect(() => {
        // Interceptor para agregar el token desde localStorage a todas las peticiones
        const interceptorId = axios.interceptors.request.use(config => {
            const token = localStorage.getItem(TOKEN_KEY);
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
            return config;
        });

        return () => {
            // Limpiar interceptor al desmontar
            axios.interceptors.request.eject(interceptorId);
        };
    }, []);

    // Inicializar desde localStorage
    useEffect(() => {
        const loadStoredAuth = () => {
            try {
                // Intentar obtener el token del localStorage
                const token = localStorage.getItem(TOKEN_KEY);
                const user = JSON.parse(localStorage.getItem(USER_KEY) || 'null');

                if (token && user) {
                    // Verificar si el token es válido
                    try {
                        const decoded = jwtDecode<JwtPayload>(token);
                        const currentTime = Date.now() / 1000;

                        if (decoded.exp < currentTime) {
                            // Token expirado, hacer logout
                            logout();
                            return;
                        }
                    } catch (e) {
                        logout();
                        return;
                    }

                    setAuthState({
                        isAuthenticated: true,
                        isLoading: false,
                        error: null,
                        accessToken: token,
                        user
                    });
                } else {
                    setAuthState(prev => ({ ...prev, isLoading: false }));
                }
            } catch (error) {
                setAuthState(prev => ({ ...prev, isLoading: false, error: 'Error al cargar datos de autenticación' }));
            }
        };

        loadStoredAuth();
    }, []);

    const login = async (email: string, password: string): Promise<boolean> => {
        setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

        try {
            const res = await axios.post("/api/auth/intranet", { email, password });
            const { user, accessToken } = res.data.data;

            if (!user || !accessToken) {
                throw new Error('Credenciales inválidas');
            }

            // Guardar en localStorage
            localStorage.setItem(TOKEN_KEY, accessToken);
            localStorage.setItem(USER_KEY, JSON.stringify(user));

            setAuthState({
                isAuthenticated: true,
                isLoading: false,
                error: null,
                accessToken,
                user
            });

            return true;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || 'Error al iniciar sesión';

            setAuthState(prev => ({
                ...prev,
                isLoading: false,
                isAuthenticated: false,
                error: errorMessage
            }));

            toast.error(errorMessage);
            return false;
        }
    };

    const logout = () => {
        // Limpiar localStorage
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);

        // Resetear estado
        setAuthState({
            isAuthenticated: false,
            isLoading: false,
            error: null,
            accessToken: null,
            user: null
        });

        // Redirigir a la página de inicio de sesión
        router.push('/');
    };

    // Verificador de rol
    const hasRole = (roles: string | string[]): boolean => {
        if (!authState.user?.rol) return false;

        const userRole = authState.user.rol;
        const checkRoles = Array.isArray(roles) ? roles : [roles];

        return checkRoles.includes(userRole);
    };

    // Gestión de estados de carga
    const startLoading = (key: string, message: string = 'Cargando...') => {
        setLoadingStates(prev => ({
            ...prev,
            [key]: { isLoading: true, message, error: null }
        }));
    };

    const stopLoading = (key: string, error: string | null = null) => {
        setLoadingStates(prev => ({
            ...prev,
            [key]: { isLoading: false, message: '', error }
        }));
    };

    const getLoadingState = (key: string): LoadingState => {
        return loadingStates[key] || { isLoading: false, message: '', error: null };
    };

    const withLoading = async <T,>(
        key: string,
        loadingMessage: string,
        operation: () => Promise<T>
    ): Promise<{ success: boolean; data?: T; error?: string }> => {
        startLoading(key, loadingMessage);

        try {
            const result = await operation();
            stopLoading(key);
            return { success: true, data: result };
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || 'Error en la operación';
            stopLoading(key, errorMessage);
            toast.error(errorMessage);
            return { success: false, error: errorMessage };
        }
    }

    return (
        <AuthContext.Provider value={{
            ...authState,
            login,
            logout,
            hasRole,
            startLoading,
            stopLoading,
            getLoadingState,
            withLoading,
            loadingStates
        }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook para usar el contexto de autenticación
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};