import { defineStore } from "pinia";

interface User {
    id: number;
    name: string;
    email: string;
    role_name: string;
    role_display_name: string;
}

export const useAuthStore = defineStore("auth", () => {
    const config = useRuntimeConfig();
    const token = useCookie<string | null>("auth_token", {
        maxAge: 60 * 60 * 24 * 7, // 7 days
        default: () => config.public.apiToken || null,
    });

    const user = ref<User | null>(null);

    const isAuthenticated = computed(() => !!token.value);

    const setToken = (newToken: string) => {
        token.value = newToken;
    };

    const setUser = (userData: User) => {
        user.value = userData;
    };

    const logout = () => {
        token.value = null;
        user.value = null;
        // navigateTo("/auth/login"); // Disabled for now
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
