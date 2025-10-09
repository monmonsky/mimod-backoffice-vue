import { defineStore } from "pinia";
import { computed, onMounted, reactive, ref, watch } from "vue";

export const themes = ["light", "contrast", "material", "dark", "dim", "material-dark", "system"] as const;

export type ITheme = (typeof themes)[number];

const localStorageKey = "__NEXUS_CONFIG_v3.0__";

export type IConfig = {
    theme: ITheme;
    direction: "ltr" | "rtl";
    sidebarTheme: "light" | "dark";
    fontFamily: "default" | "dm-sans" | "inclusive" | "ar-one" | "wix";
    fullscreen: boolean;
};

const defaultConfig: IConfig = {
    theme: "system",
    direction: "ltr",
    fontFamily: "default",
    sidebarTheme: "light",
    fullscreen: false,
};

const getConfigFromLocalStorage = (): IConfig => {
    if (typeof window !== "undefined") {
        const saved = localStorage.getItem(localStorageKey);
        if (saved) {
            return JSON.parse(saved) as IConfig;
        }
    }
    return defaultConfig;
};

export const useConfig = defineStore(localStorageKey, () => {
    const config = reactive<IConfig>(getConfigFromLocalStorage());
    const isMounted = ref(false);

    const calculatedSidebarTheme = computed(() => {
        console.info("side");
        return config.sidebarTheme === "dark" && ["light", "contrast"].includes(config.theme) ? "dark" : undefined;
    });

    const changeTheme = (theme: IConfig["theme"]) => {
        config.theme = theme;
    };

    const changeSidebarTheme = (sidebarTheme: IConfig["sidebarTheme"]) => {
        config.sidebarTheme = sidebarTheme;
    };
    const changeFontFamily = (fontFamily: IConfig["fontFamily"]) => {
        config.fontFamily = fontFamily;
    };

    const changeDirection = (direction: IConfig["direction"]) => {
        config.direction = direction;
    };

    const toggleTheme = () => {
        if (["system", "light", "contrast", "material"].includes(config.theme)) {
            config.theme = "dark";
        } else {
            config.theme = "light";
        }
    };

    const toggleFullscreen = async () => {
        const htmlRef = document?.documentElement;
        if (htmlRef) {
            if (document.fullscreenElement != null) {
                await document.exitFullscreen();
            } else {
                await htmlRef.requestFullscreen();
            }
        }
        config.fullscreen = !config.fullscreen;
    };

    const reset = async () => {
        Object.assign(config, defaultConfig);
        if (document.fullscreenElement != null) {
            await document.exitFullscreen();
        }
    };

    const updateConfig = (_config: IConfig) => {
        Object.assign(config, _config);
    };

    watch(
        () => ({ ...config }), // shallow clone to trigger reactivity
        (cfg) => {
            applyConfigToDOM(cfg);
            if (isMounted.value) {
                localStorage.setItem(localStorageKey, JSON.stringify(cfg));
            }
        },
        { immediate: true },
    );

    onMounted(() => {
        isMounted.value = true;
        const saved = getConfigFromLocalStorage();
        updateConfig(saved);
        applyConfigToDOM(saved);
    });

    return {
        config,
        calculatedSidebarTheme,
        changeFontFamily,
        changeDirection,
        changeSidebarTheme,
        changeTheme,
        toggleTheme,
        toggleFullscreen,
        reset,
        updateConfig,
    };
});

const applyConfigToDOM = (config: IConfig) => {
    const htmlRef = document?.documentElement;
    if (!htmlRef) return;

    if (config.theme === "system") {
        htmlRef.removeAttribute("data-theme");
    } else {
        htmlRef.setAttribute("data-theme", config.theme);
    }

    if (config.fullscreen) {
        htmlRef.setAttribute("data-fullscreen", "");
    } else {
        htmlRef.removeAttribute("data-fullscreen");
    }

    if (config.sidebarTheme) {
        htmlRef.setAttribute("data-sidebar-theme", config.sidebarTheme);
    }

    if (config.fontFamily !== "default") {
        htmlRef.setAttribute("data-font-family", config.fontFamily);
    } else {
        htmlRef.removeAttribute("data-font-family");
    }

    if (JSON.stringify(config) !== JSON.stringify(defaultConfig)) {
        htmlRef.setAttribute("data-changed", "");
    } else {
        htmlRef.removeAttribute("data-changed");
    }

    htmlRef.dir = config.direction;
};
