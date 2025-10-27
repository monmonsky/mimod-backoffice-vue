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
}

export const useAuthStore = defineStore("auth", () => {
    const config = useRuntimeConfig();
    const token = useCookie<string | null>("auth_token", {
        maxAge: 60 * 60 * 24 * 7, // 7 days
        default: () => null, // Don't use env token as default
    });

    const user = useCookie<User | null>("auth_user", {
        maxAge: 60 * 60 * 24 * 7, // 7 days
        default: () => null,
    });

    const tokenExpiry = useCookie<number | null>("auth_token_expiry", {
        maxAge: 60 * 60 * 24 * 7, // 7 days
        default: () => null,
    });

    // User is authenticated if both token AND user exist
    const isAuthenticated = computed(() => !!token.value && !!user.value);

    // Check if token is expired based on stored expiry time
    const isTokenExpired = computed(() => {
        if (!tokenExpiry.value) return false;
        return Date.now() >= tokenExpiry.value;
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
        setToken,
        setUser,
        setTokenExpiry,
        logout,
        checkAuth,
    };
});
