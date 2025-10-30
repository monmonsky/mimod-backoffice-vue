import { defineStore } from "pinia";

interface Module {
    id: number;
    name: string;
    display_name: string;
    route: string | null;
    icon: string | null;
    group_name: string | null;
    is_visible: boolean;
    is_active: boolean;
    children?: Module[];
}

export interface Permission {
    id: number;
    name: string;
    display_name: string;
    action: string;
    module: string;
    is_active: boolean;
}

interface Role {
    id: number;
    name: string;
    display_name: string;
    modules?: Module[];
}

interface User {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    email_verified_at: string | null;
    phone_verified_at: string | null;
    two_factor_enabled: boolean;
    role_name?: string;
    role_display_name?: string;
    role?: Role;
    permissions?: Permission[];
}

export const useAuthStore = defineStore("auth", () => {
    const config = useRuntimeConfig();

    // Use refs with localStorage persistence for SPA mode
    const token = ref<string | null>(null);
    const user = ref<User | null>(null);
    const tokenExpiry = ref<number | null>(null);

    // Initialize from localStorage on client-side
    if (import.meta.client) {
        token.value = localStorage.getItem('auth_token');
        const storedUser = localStorage.getItem('auth_user');
        user.value = storedUser ? JSON.parse(storedUser) : null;
        const storedExpiry = localStorage.getItem('auth_token_expiry');
        tokenExpiry.value = storedExpiry ? parseInt(storedExpiry) : null;

        // Watch for changes and sync to localStorage
        watch(token, (newToken) => {
            if (newToken) {
                localStorage.setItem('auth_token', newToken);
            } else {
                localStorage.removeItem('auth_token');
            }
        });

        watch(user, (newUser) => {
            if (newUser) {
                localStorage.setItem('auth_user', JSON.stringify(newUser));
            } else {
                localStorage.removeItem('auth_user');
            }
        });

        watch(tokenExpiry, (newExpiry) => {
            if (newExpiry) {
                localStorage.setItem('auth_token_expiry', newExpiry.toString());
            } else {
                localStorage.removeItem('auth_token_expiry');
            }
        });
    }

    // User is authenticated if both token AND user exist
    const isAuthenticated = computed(() => !!token.value && !!user.value);

    // Check if token is expired based on stored expiry time
    const isTokenExpired = computed(() => {
        if (!tokenExpiry.value) return false;
        return Date.now() >= tokenExpiry.value;
    });

    // Get user permissions
    const userPermissions = computed(() => {
        return user.value?.permissions || [];
    });

    // Get active permission names only
    const userPermissionNames = computed(() => {
        return userPermissions.value
            .filter(p => p.is_active)
            .map(p => p.name);
    });

    const setToken = (newToken: string, expiresIn?: number) => {
        token.value = newToken;

        // Set token expiry time (default: 1 hour from now to match backend)
        // expiresIn is in seconds (from backend), convert to milliseconds
        const expiryDuration = expiresIn ? expiresIn * 1000 : 60 * 60 * 1000; // 1 hour default
        tokenExpiry.value = Date.now() + expiryDuration;
    };

    const setUser = (userData: User) => {
        user.value = userData;
    };

    const setTokenExpiry = (expiryTimestamp: number) => {
        tokenExpiry.value = expiryTimestamp;
    };

    const logout = async () => {
        // Call logout API
        try {
            if (token.value) {
                await $fetch("/auth/logout", {
                    method: "POST",
                    baseURL: config.public.apiBase,
                    headers: {
                        Authorization: `Bearer ${token.value}`,
                    },
                });
            }
        } catch (err) {
            console.error("Logout API error:", err);
        }

        // Clear local state (all cookies)
        token.value = null;
        user.value = null;
        tokenExpiry.value = null;

        // Redirect to login - check if we're in browser
        if (import.meta.client) {
            await navigateTo("/auth/login");
        }
    };

    // Check authentication validity (for middleware)
    const checkAuth = () => {
        // If not authenticated, return false
        if (!isAuthenticated.value) return false;

        // If token is expired, logout and return false
        if (isTokenExpired.value) {
            console.warn('[Auth Store] Token expired - Auto logout');
            logout();
            return false;
        }

        return true;
    };

    return {
        token,
        user,
        tokenExpiry,
        isAuthenticated,
        isTokenExpired,
        userPermissions,
        userPermissionNames,
        setToken,
        setUser,
        setTokenExpiry,
        logout,
        checkAuth,
    };
});
