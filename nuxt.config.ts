import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    ssr: false,
    app: {
        head: {
            titleTemplate: "%s - Nexus Admin",
            script: [{ src: "/js/prefetch-config.js", async: true }],
            htmlAttrs: {
                class: "group/html",
                lang: "en",
            },
        },
    },
    experimental: {
        appManifest: false,
    },
    compatibilityDate: "2025-05-05",
    devtools: { enabled: true },
    modules: ["@pinia/nuxt"],
    typescript: {
        typeCheck: false,
    },
    css: ["~/assets/styles/app.css"],
    vite: {
        plugins: [tailwindcss()],
        optimizeDeps: {
            exclude: ['fsevents'],
        },
        build: {
            rollupOptions: {
                maxParallelFileOps: 2,
            },
        },
    },
    runtimeConfig: {
        public: {
            apiBase: process.env.NUXT_PUBLIC_API_BASE || "http://127.0.0.1:8000/api",
            apiToken: process.env.NUXT_PUBLIC_API_TOKEN || "",
            storageBase: process.env.NUXT_PUBLIC_STORAGE_BASE || "http://127.0.0.1:8000",
            rajaongkirApiKey: process.env.NUXT_PUBLIC_RAJAONGKIR_API_KEY || "",
        },
    },
});
