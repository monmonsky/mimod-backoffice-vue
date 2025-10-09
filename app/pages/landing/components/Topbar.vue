<script setup lang="ts">
import Logo from "@/components/Logo.vue";

const scrollPosition = ref(0);
const prevScrollPosition = ref(0);
const scrolling = ref<"up" | "down" | undefined>(undefined);

const handleScroll = () => {
    setTimeout(() => {
        prevScrollPosition.value = scrollPosition.value;
        scrollPosition.value = window.scrollY;

        if (scrollPosition.value < 500) {
            scrolling.value = undefined;
        } else {
            if (scrollPosition.value - prevScrollPosition.value > 0) {
                scrolling.value = "down";
            } else if (scrollPosition.value - prevScrollPosition.value < 0) {
                scrolling.value = "up";
            }
        }
    }, 200);
};

onMounted(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
});

onUnmounted(() => {
    window.removeEventListener("scroll", handleScroll);
});
</script>

<template>
    <div
        :data-scrolling="scrolling"
        :data-at-top="scrollPosition < 30"
        class="group fixed inset-x-0 z-[60] flex justify-center transition-[top] duration-500 data-[scrolling=down]:-top-full sm:container [&:not([data-scrolling=down])]:top-4">
        <div
            class="group-data-[at-top=false]:bg-base-100 group-data-[at-top=false]:dark:bg-base-200 flex w-full items-center justify-between px-3 py-3 transition-all duration-500 group-data-[at-top=false]:w-[800px] group-data-[at-top=false]:shadow sm:rounded-full sm:px-6 lg:py-1.5">
            <div class="flex items-center gap-2">
                <div class="flex-none lg:hidden">
                    <div class="drawer">
                        <input id="landing-menu-drawer" type="checkbox" class="drawer-toggle" />
                        <div class="drawer-content">
                            <label for="landing-menu-drawer" class="btn drawer-button btn-ghost btn-square btn-sm">
                                <span class="iconify lucide--menu size-4.5" />
                            </label>
                        </div>
                        <div class="drawer-side z-[50]">
                            <label for="landing-menu-drawer" aria-label="close sidebar" class="drawer-overlay" />
                            <ul class="menu bg-base-100 text-base-content min-h-full w-80 p-4">
                                <li>
                                    <NuxtLink href="/dashboards/ecommerce">Dashboard</NuxtLink>
                                </li>
                                <li>
                                    <NuxtLink href="/components">Components</NuxtLink>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <NuxtLink href="/dashboards/ecommerce">
                    <Logo />
                </NuxtLink>
            </div>
            <ul class="menu menu-horizontal hidden gap-2 px-0 lg:inline-flex">
                <li>
                    <NuxtLink href="/dashboards/ecommerce">Dashboard</NuxtLink>
                </li>
                <li>
                    <NuxtLink href="/components">Components</NuxtLink>
                </li>
            </ul>
            <div class="inline-flex items-center gap-3">
                <ThemeToggle class="btn btn-square btn-ghost btn-sm border-transparent" />
                <NuxtLink
                    href="https://daisyui.com/store/244268?aff=Db6q2"
                    target="_blank"
                    class="btn from-primary to-secondary group/purchase text-primary-content btn-sm max-sm:btn-square relative gap-2 border-0 bg-linear-to-r text-sm">
                    <span class="iconify lucide--shopping-cart size-4" />
                    <span class="max-sm:hidden">Buy Now</span>
                    <div
                        class="from-primary to-secondary absolute inset-x-0 top-1 -z-1 h-8 bg-linear-to-r opacity-40 blur-md transition-all duration-500 group-hover/purchase:opacity-60 group-hover/purchase:blur-lg" />
                </NuxtLink>
            </div>
        </div>
    </div>
</template>
