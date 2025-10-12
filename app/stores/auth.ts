import { defineStore } from "pinia";

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

    // User is authenticated if both token AND user exist
    const isAuthenticated = computed(() => !!token.value && !!user.value);

    const setToken = (newToken: string) => {
        token.value = newToken;
    };

    const setUser = (userData: User) => {
        user.value = userData;
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

        // Clear local state (both cookies)
        token.value = null;
        user.value = null;

        // Redirect to login - check if we're in browser
        if (import.meta.client) {
            await navigateTo("/auth/login");
        }
    };

    return {
        token,
        user,
        isAuthenticated,
        setToken,
        setUser,
        logout,
    };
});
