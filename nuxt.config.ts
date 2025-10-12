import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    app: {
        head: {
            titleTemplate: "%s - Nexus Admin",
            script: [{ src: "/js/prefetch-config.js", async: true }],
            htmlAttrs: {
                class: "group/html",
            },
        },
    },
    compatibilityDate: "2025-05-05",
    devtools: { enabled: true },
    modules: ["@pinia/nuxt", "@nuxt/eslint"],
    css: ["~/assets/styles/app.css"],
    vite: {
        plugins: [tailwindcss()],
    },
    runtimeConfig: {
        public: {
            apiBase: process.env.NUXT_PUBLIC_API_BASE || "http://127.0.0.1:8000/api",
            apiToken: process.env.NUXT_PUBLIC_API_TOKEN || "",
        },
    },
});
