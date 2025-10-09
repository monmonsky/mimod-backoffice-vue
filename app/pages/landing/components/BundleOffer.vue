<template>
    <div id="bundle" class="container pt-8 pb-12 md:pt-12 md:pb-18 xl:pt-16 xl:pb-24 2xl:pt-24 2xl:pb-36">
        <div class="text-center">
            <div
                class="rounded-box inline-flex items-center border border-purple-500/10 bg-purple-500/5 p-2 text-purple-500">
                <span class="iconify lucide--package-search size-5" />
            </div>
            <p class="mt-4 text-2xl font-semibold sm:text-3xl">The Powerful Admin & Startup Solution</p>
            <p class="text-base-content/70 mt-3 inline-block max-w-lg max-sm:text-sm">
                Accelerate your projects with a flexible dashboard and landing template designed for startup growth and
                business success.
            </p>
        </div>
        <div class="mt-8 grid gap-6 lg:mt-16 lg:grid-cols-2">
            <NuxtLink
                href="https://daisyui.com/store/475050/"
                class="border-base-300 bg-base-100 h-fit rounded-md border p-6"
                target="_blank">
                <p class="text-base-content/60 font-medium italic">
                    Looking for <span class="underline">Startup</span>
                </p>
                <div class="mt-5">
                    <img src="/images/landing/scalo-logo-light.svg" class="h-6.5 dark:hidden" alt="Scalo" />
                    <img src="/images/landing/scalo-logo-dark.svg" class="hidden h-6.5 dark:inline" alt="Scalo" />
                </div>
                <p class="text-base-content/70 mt-5">
                    Scalo and Nexus make your admin dashboard feel less like work and more like launching your next big
                    thing. Smart, fast, focused, and beautifully built for startups.
                </p>
                <div class="flex justify-center">
                    <button class="btn btn-primary mt-5 gap-3 text-base">
                        <span class="iconify lucide--plane-takeoff size-4 sm:size-5" />
                        Get Scalo
                    </button>
                </div>
            </NuxtLink>
            <NuxtLink
                class="from-primary to-secondary group h-fit rounded-md bg-linear-to-br p-0.5"
                href="https://daisyui.com/store/244268/"
                target="_blank">
                <div class="bg-base-100 rounded-box">
                    <div
                        class="from-primary/5 to-secondary/5 group-hover:from-primary/10 group-hover:to-secondary/10 relative bg-linear-to-br p-6 transition-all">
                        <p class="text-base-content/60 font-medium italic">Bundle Offer</p>
                        <div class="mt-5 flex items-center gap-4">
                            <img src="/images/logo/logo-light.svg" class="h-5 dark:hidden" alt="Scalo" />
                            <img src="/images/logo/logo-dark.svg" class="hidden h-5 dark:inline" alt="Scalo" />
                            <span class="iconify lucide--plus text-base-content/50 size-5" />
                            <img src="/images/landing/scalo-logo-light.svg" class="h-6.5 dark:hidden" alt="Scalo" />
                            <img
                                src="/images/landing/scalo-logo-dark.svg"
                                class="hidden h-6.5 dark:inline"
                                alt="Scalo" />
                        </div>
                        <p class="text-base-content/80 mt-4">
                            Get <span class="text-primary font-semibold">Nexus Dashboard</span> and{" "}
                            <span class="text-secondary font-semibold">Scalo Startup Template</span> together at a
                            discounted price. The perfect combo for building and managing modern web projects
                            effortlessly.
                        </p>
                        <div class="mt-5 flex justify-center">
                            <button
                                class="btn shadow-primary-content/20 from-primary to-secondary text-primary-content gap-3 border-0 bg-linear-to-br text-base shadow-inner">
                                <span class="iconify lucide--package size-4 sm:size-5" />
                                Get Bundle
                            </button>
                        </div>
                        <p class="absolute end-4 top-4 font-medium text-orange-600 dark:text-orange-400">
                            Special Discount
                        </p>
                    </div>
                </div>
            </NuxtLink>
        </div>
    </div>
</template>
