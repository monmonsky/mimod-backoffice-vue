import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    // @ts-ignore - i18n module config
    app: {
        head: {
            titleTemplate: "%s - Nexus Admin",
            script: [{ src: "/js/prefetch-config.js", async: true }],
            htmlAttrs: {
                class: "group/html",
            },
        },
    },
    experimental: {
        appManifest: false,
    },
    compatibilityDate: "2025-05-05",
    devtools: { enabled: true },
    modules: ["@pinia/nuxt", "@nuxt/eslint", "@nuxtjs/i18n"],
    css: ["~/assets/styles/app.css"],
    i18n: {
        locales: [
            {
                code: "en",
                iso: "en-US",
                name: "English",
                file: "en.ts",
            },
            {
                code: "id",
                iso: "id-ID",
                name: "Indonesia",
                file: "id.ts",
            },
        ],
        langDir: "locales",
        defaultLocale: "en",
        strategy: "prefix_except_default",
        detectBrowserLanguage: {
            useCookie: true,
            cookieKey: "i18n_redirected",
            redirectOn: "root",
        },
    },
    vite: {
        plugins: [tailwindcss()],
    },
    runtimeConfig: {
        public: {
            apiBase: process.env.NUXT_PUBLIC_API_BASE || "http://127.0.0.1:8000/api",
            apiToken: process.env.NUXT_PUBLIC_API_TOKEN || "",
            storageBase: process.env.NUXT_PUBLIC_STORAGE_BASE || "http://127.0.0.1:8000",
        },
    },
});
