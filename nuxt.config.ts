import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    app: {
        head: {
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
});
