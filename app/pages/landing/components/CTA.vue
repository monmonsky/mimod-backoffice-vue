<template>
    <div class="container sm:px-16">
        <div class="relative overflow-hidden py-8 sm:rounded-[60px] md:py-12 xl:py-16 2xl:pt-24 2xl:pb-48">
            <div class="absolute start-16 -bottom-40 h-64 w-72 bg-blue-400 blur-[180px] max-sm:hidden" />
            <div
                class="absolute start-1/2 -bottom-40 h-64 w-72 -translate-x-1/2 bg-cyan-400 blur-[180px] max-sm:hidden" />
            <div class="absolute end-16 -bottom-40 h-64 w-72 bg-purple-400 blur-[180px] max-sm:hidden" />
            <div class="grainy absolute inset-0 z-0 opacity-20 max-sm:hidden" />
            <div class="absolute inset-x-0 top-0 h-160 bg-linear-to-b from-(--root-bg) to-transparent max-sm:hidden" />

            <div class="relative">
                <div class="text-center">
                    <div
                        class="from-primary to-secondary text-primary-content inline-flex items-center rounded-full bg-linear-to-tr p-2.5">
                        <span class="iconify lucide--rocket size-5" />
                    </div>
                    <p class="mt-4 text-xl font-bold sm:text-2xl lg:text-4xl">Launch, Manage, and Succeed</p>
                    <p class="mt-3 inline-block max-w-2xl max-sm:text-sm">
                        Pay once, use forever. No subscriptions, only powerful tools and endless possibilities to build
                        with confidence.
                    </p>
                </div>

                <div class="mt-6 flex justify-center xl:mt-8">
                    <ul class="max-w-md space-y-3 text-center">
                        <li class="flex items-center gap-2 max-sm:text-sm">
                            <span class="iconify lucide--badge-check size-6 text-green-500" />
                            Built with Tailwind CSS 4 & DaisyUI 5
                        </li>
                        <li class="flex items-center gap-2 max-sm:text-sm">
                            <span class="iconify lucide--badge-check size-6 text-green-500" />
                            Lifetime access with free updates
                        </li>
                        <li class="flex items-center gap-2 max-sm:text-sm">
                            <span class="iconify lucide--badge-check size-6 text-green-500" />
                            Fully responsive & optimized for all devices
                        </li>
                    </ul>
                </div>
                <div class="mt-6 flex items-center justify-center gap-3 sm:gap-5 xl:mt-8">
                    <NuxtLink
                        href="https://daisyui.com/store/244268"
                        target="_blank"
                        class="btn from-primary to-secondary group text-primary-content relative gap-3 border-0 bg-linear-to-r text-base">
                        <span class="iconify lucide--shopping-cart size-4 sm:size-5" />
                        Buy Now
                        <div
                            class="from-primary to-secondary absolute inset-x-1 top-2 -z-1 h-10 bg-linear-to-r opacity-40 blur-md transition-all duration-500 group-hover:inset-x-0 group-hover:opacity-80 group-hover:blur-lg dark:opacity-20 group-hover:dark:!opacity-40" />
                    </NuxtLink>
                    <a href="#faqs" class="btn btn-ghost">
                        Need help?
                        <span class="iconify lucide--arrow-down size-3.5" />
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>
