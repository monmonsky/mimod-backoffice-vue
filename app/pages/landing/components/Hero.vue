<script lang="ts" setup>
import Swiper from "swiper";
import "swiper/css";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

const swiperOptions = {
    slidesPerView: 1,
    cardsEffect: {
        rotate: false,
        perSlideOffset: 10,
        slideShadows: false,
    },
    loop: true,
    speed: 1500,
    autoplay: {
        delay: 5000,
    },
    spaceBetween: 20,
    navigation: {
        prevEl: ".hero-swiper-button-prev",
        nextEl: ".hero-swiper-button-next",
    },
    modules: [Navigation, Pagination, Autoplay],
};

onMounted(() => {
    new Swiper("#hero-swiper", swiperOptions);
});
</script>
<template>
    <div class="relative">
        <div
            class="absolute inset-0 -top-2 h-[1600px] bg-[url(/images/landing/hero-bg-gradient.png)] [background-size:200%_60%] bg-no-repeat opacity-20 [background-position-x:center] sm:[background-size:100%_100%] dark:opacity-15" />

        <div class="relative z-10 container py-28 xl:py-40">
            <div class="flex flex-col items-center">
                <NuxtLink
                    class="flex items-center gap-1.5 rounded-full border border-white/60 bg-white/40 py-0.5 ps-1 pe-2 text-sm transition-all hover:bg-white/60 dark:border-white/5 dark:bg-white/5 dark:hover:bg-white/10"
                    href="/components"
                    target="_blank">
                    <div
                        class="bg-primary/10 border-primary/10 text-primary flex items-center justify-center rounded-full border px-1.5 py-0 text-xs font-medium dark:border-white/5 dark:bg-white/5 dark:text-white">
                        v3
                    </div>
                    Endless Design
                </NuxtLink>
                <div
                    class="mt-4 max-w-[1000px] transition-all duration-1000 starting:scale-125 starting:opacity-0 starting:blur-sm">
                    <p
                        class="text-center text-2xl leading-tight font-bold sm:text-3xl md:text-4xl lg:text-5xl 2xl:text-6xl">
                        Flexible, Quick, Effortless
                        <br />
                        Ultimate
                        <span
                            class="animated-text bg-linear-to-r from-purple-500 via-blue-500 to-cyan-600 dark:from-purple-400 dark:via-blue-400 dark:to-cyan-400">
                            Admin Dashboard
                        </span>
                    </p>
                </div>
                <div
                    class="mt-4 max-w-[750px] transition-all duration-1000 sm:mt-6 xl:mt-8 starting:opacity-0 starting:blur-sm">
                    <p class="text-center max-sm:text-sm md:text-lg">
                        Launch powerful modern dashboards with customizable apps, components, blocks and integrations
                        designed to accelerate workflows and boost efficiency.
                    </p>
                </div>

                <div
                    class="mt-6 inline-flex items-center gap-2.5 transition-all delay-300 duration-1000 sm:gap-5 xl:mt-10 starting:opacity-0 starting:blur-sm">
                    <NuxtLink href="/dashboards/ecommerce" target="_blank" class="btn btn-primary btn-lg gap-2.5">
                        <span class="iconify lucide--monitor-dot size-5 sm:size-5.5" />
                        <div class="text-start">
                            <p class="text-sm/none">Dashboard</p>
                            <p class="text-primary-content/70 mt-px text-[11px]/none">Preview</p>
                        </div>
                    </NuxtLink>
                    <NuxtLink
                        href="/components"
                        class="btn btn-ghost btn-neutral btn-lg gap-3 !border-transparent text-base dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black">
                        <span class="iconify lucide--blocks size-5 sm:size-5.5" />
                        Components
                    </NuxtLink>
                </div>
                <div
                    class="group relative mt-8 max-w-full md:mt-16 md:max-w-xl lg:max-w-3xl xl:mt-20 xl:max-w-5xl 2xl:max-w-6xl">
                    <div
                        class="border-base-100/20 bg-base-100/30 dark:border-px relative rounded-lg border-2 py-2 dark:border-white/2 dark:bg-white/4">
                        <div id="hero-swiper" class="swiper">
                            <div class="swiper-wrapper">
                                <div class="swiper-slide">
                                    <div class="mx-2 cursor-pointer">
                                        <NuxtLink class="relative" href="/dashboards/ecommerce">
                                            <img
                                                src="/images/landing/dashboard-ecommerce-light.jpg"
                                                class="h-full w-full rounded-lg dark:hidden"
                                                alt="hero-landing" />
                                            <img
                                                src="/images/landing/dashboard-ecommerce-dark.jpg"
                                                class="hidden h-full w-full rounded-lg dark:block"
                                                alt="hero-landing" />
                                            <div
                                                class="absolute inset-0 flex items-end justify-center rounded-lg bg-linear-to-b from-transparent from-[50%] via-black/20 via-[80%] to-black/80 opacity-0 transition-all duration-300 group-hover:opacity-100">
                                                <div
                                                    class="rounded-box mb-8 gap-2.5 bg-white px-4 py-2 text-sm font-medium text-black/80">
                                                    Ecommerce Dashboard
                                                </div>
                                            </div>
                                        </NuxtLink>
                                    </div>
                                </div>
                                <div class="swiper-slide">
                                    <div class="mx-2 cursor-pointer">
                                        <NuxtLink class="relative" href="/dashboards/gen-ai">
                                            <img
                                                src="/images/landing/dashboard-gen-ai-light.jpg"
                                                class="h-full w-full rounded-lg dark:hidden"
                                                alt="hero-landing" />
                                            <img
                                                src="/images/landing/dashboard-gen-ai-dark.jpg"
                                                class="hidden h-full w-full rounded-lg dark:block"
                                                alt="hero-landing" />
                                            <div
                                                class="absolute inset-0 flex items-end justify-center rounded-lg bg-linear-to-b from-transparent from-[50%] via-black/20 via-[80%] to-black/80 opacity-0 transition-all duration-300 group-hover:opacity-100">
                                                <div
                                                    class="rounded-box mb-8 gap-2.5 bg-white px-4 py-2 text-sm font-medium text-black/80">
                                                    Gen AI Dashboard
                                                </div>
                                            </div>
                                        </NuxtLink>
                                    </div>
                                </div>
                                <div class="swiper-slide">
                                    <div class="mx-2 cursor-pointer">
                                        <NuxtLink class="relative" href="/dashboards/crm">
                                            <img
                                                src="/images/landing/dashboard-crm-light.jpg"
                                                class="h-full w-full rounded-lg dark:hidden"
                                                alt="hero-landing" />
                                            <img
                                                src="/images/landing/dashboard-crm-dark.jpg"
                                                class="hidden h-full w-full rounded-lg dark:block"
                                                alt="hero-landing" />
                                            <div
                                                class="absolute inset-0 flex items-end justify-center rounded-lg bg-linear-to-b from-transparent from-[50%] via-black/20 via-[80%] to-black/80 opacity-0 transition-all duration-300 group-hover:opacity-100">
                                                <div
                                                    class="rounded-box mb-8 gap-2.5 bg-white px-4 py-2 text-sm font-medium text-black/80">
                                                    CRM Dashboard
                                                </div>
                                            </div>
                                        </NuxtLink>
                                    </div>
                                </div>
                                <div class="swiper-slide">
                                    <div class="mx-2 cursor-pointer">
                                        <NuxtLink class="relative" href="/components" target="_blank">
                                            <img
                                                src="/images/landing/components-home-light.jpg"
                                                class="h-full w-full rounded-lg dark:hidden"
                                                alt="hero-landing" />
                                            <img
                                                src="/images/landing/components-home-dark.jpg"
                                                class="hidden h-full w-full rounded-lg dark:block"
                                                alt="hero-landing" />
                                            <div
                                                class="absolute inset-0 flex items-end justify-center rounded-lg bg-linear-to-b from-transparent from-[50%] via-black/20 via-[80%] to-black/80 opacity-0 transition-all duration-300 group-hover:opacity-100">
                                                <div
                                                    class="rounded-box mb-8 gap-2.5 bg-white px-4 py-2 text-sm font-medium text-black/80">
                                                    Components
                                                </div>
                                            </div>
                                        </NuxtLink>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                        class="absolute z-1 flex justify-between max-md:start-1/2 max-md:-bottom-12 max-md:-translate-x-1/2 max-md:gap-3 md:-inset-x-24 md:top-1/2 md:-translate-y-1/2">
                        <button
                            class="hero-swiper-button-prev border-base-200 flex size-8 cursor-pointer items-center justify-center rounded-full bg-white shadow-xs transition-all hover:shadow-md max-md:shadow md:size-10 dark:border-white/10 dark:bg-white/10 dark:hover:bg-white/20">
                            <span class="iconify lucide--chevron-left size-5"></span>
                        </button>
                        <button
                            class="hero-swiper-button-next border-base-200 flex size-8 cursor-pointer items-center justify-center rounded-full bg-white shadow-xs transition-all hover:shadow-md max-md:shadow md:size-10 dark:border-white/10 dark:bg-white/10 dark:hover:bg-white/20">
                            <span class="iconify lucide--chevron-right size-5"></span>
                        </button>
                    </div>
                </div>

                <div class="mt-8 text-center sm:mt-12 lg:mt-16">
                    <p class="text-base-content/60 font-medium">Available In</p>
                    <div class="mt-4 flex flex-wrap items-center justify-center gap-6">
                        <div class="tooltip" data-tip="Tailwind CSS 4">
                            <img src="/images/landing/logo-tailwind.svg" class="size-7 sm:size-9" alt="Tailwind CSS" />
                        </div>
                        <div class="tooltip" data-tip="daisyUI 5 - Component Library">
                            <img src="/images/landing/logo-daisyui.svg" class="size-7 sm:size-9" alt="DaisyUI" />
                        </div>
                        <div class="tooltip" data-tip="Alpine.js">
                            <img src="/images/landing/logo-alpinejs.svg" class="size-8 sm:size-11" alt="Alpine.js" />
                        </div>

                        <div class="tooltip" data-tip="Typescript">
                            <img src="/images/landing/logo-ts.svg" class="size-7 sm:size-9" alt="Typescript" />
                        </div>
                        <div class="tooltip" data-tip="Vite">
                            <img src="/images/landing/logo-vite.svg" class="size-7 sm:size-9" alt="Vite" />
                        </div>

                        <div class="tooltip" data-tip="React 19">
                            <img src="/images/landing/logo-react.svg" class="size-7 sm:size-9" alt="React" />
                        </div>

                        <div class="tooltip" data-tip="Next.JS 15">
                            <img
                                src="/images/landing/logo-next.svg"
                                class="size-7 sm:size-9 dark:invert"
                                alt="Next.JS" />
                        </div>
                        <div class="tooltip" data-tip="SvelteKit 2">
                            <img src="/images/landing/logo-svelte.svg" class="size-7 sm:size-9" alt="SvelteKit 2" />
                        </div>
                        <div class="tooltip" data-tip="Nuxt 4">
                            <img src="/images/landing/logo-nuxt.svg" class="size-8 sm:size-10" alt="Nuxt 4" />
                        </div>
                    </div>
                </div>
            </div>
            <div class="animate-bounce-slow absolute start-16 top-60 opacity-80 max-xl:hidden dark:opacity-60">
                <img src="/images/landing/hero-widget-1.png" class="h-30" alt="Hero 1" />
            </div>
            <div class="animate-bounce-slow absolute end-0 top-160 opacity-80 max-xl:hidden dark:opacity-60">
                <img src="/images/landing/hero-widget-2.png" class="h-30" alt="Hero 2" />
            </div>
        </div>
    </div>
</template>
