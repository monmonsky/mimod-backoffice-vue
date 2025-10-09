<template>
    <div id="faqs" class="container py-8 md:py-12 xl:py-16 2xl:py-24">
        <div class="grid grid-cols-1 gap-12 lg:grid-cols-7 lg:gap-24">
            <div class="col-span-1 flex flex-col max-sm:items-center max-sm:text-center lg:col-span-3">
                <div class="rounded-box inline-flex w-fit items-center border border-purple-500/10 bg-purple-500/5 p-2">
                    <span class="iconify lucide--messages-square size-5 text-purple-600" />
                </div>
                <p class="mt-4 text-2xl font-semibold sm:text-3xl">Support Center</p>
                <p class="text-base-content/70 mt-3 inline-block max-w-lg max-sm:text-sm">
                    If you still have questions, don’t hesitate to reach out. Contact us anytime for quick assistance.
                </p>
                <NuxtLink class="btn btn-sm mt-4 w-fit" target="_blank" href="https://discord.com/invite/S6TZxycVHs">
                    Contact Us
                </NuxtLink>
            </div>
            <div class="lg:col-span-4">
                <div class="space-y-0">
                    <div class="collapse-plus border-base-300 collapse">
                        <input type="radio" aria-label="Accordion radio" name="accordion" />
                        <div class="collapse-title cursor-pointer font-medium sm:text-xl">
                            <div class="ite flex items-center gap-4">
                                <div
                                    class="border-base-300 rounded-box inline-flex items-center justify-center border p-1.5">
                                    <span class="iconify lucide--messages-square size-4.5" />
                                </div>
                                How can i give a feedback?
                            </div>
                        </div>
                        <div class="collapse-content ms-12">
                            <p>
                                You can provide feedback by filling out our
                                <NuxtLink
                                    class="text-primary ms-1"
                                    target="_blank"
                                    href="https://forms.gle/UeX3jgsjFNFcZsq9A">
                                    Google Form
                                </NuxtLink>
                            </p>
                        </div>
                    </div>
                    <div class="collapse-plus border-base-300 collapse">
                        <input type="radio" aria-label="Accordion radio" name="accordion" />
                        <div class="collapse-title cursor-pointer font-medium sm:text-xl">
                            <div class="ite flex items-center gap-4">
                                <div
                                    class="border-base-300 rounded-box inline-flex items-center justify-center border p-1.5">
                                    <span class="iconify lucide--code size-4.5" />
                                </div>
                                Can i get full source code?
                            </div>
                        </div>
                        <div class="collapse-content ms-12">
                            <p>
                                Certainly, we offer the complete source code depending on the package you've purchased.
                                You might look into depth:
                                <NuxtLink
                                    class="text-primary ms-1"
                                    target="_blank"
                                    href="https://nexus.daisyui.com/docs/">
                                    Packages
                                </NuxtLink>
                            </p>
                        </div>
                    </div>
                    <div class="collapse-plus border-base-300 collapse">
                        <input type="radio" aria-label="Accordion radio" name="accordion" />
                        <div class="collapse-title cursor-pointer font-medium sm:text-xl">
                            <div class="ite flex items-center gap-4">
                                <div
                                    class="border-base-300 rounded-box inline-flex items-center justify-center border p-1.5">
                                    <span class="iconify lucide--credit-card size-4.5" />
                                </div>
                                Will there be any future payments required?
                            </div>
                        </div>
                        <div class="collapse-content ms-12">
                            <p>
                                Absolutely not. It's a one-time purchase, with no hidden charges or future payments to
                                worry about.
                            </p>
                        </div>
                    </div>
                    <div class="collapse-plus border-base-300 collapse">
                        <input type="radio" aria-label="Accordion radio" name="accordion" />
                        <div class="collapse-title cursor-pointer font-medium sm:text-xl">
                            <div class="ite flex items-center gap-4">
                                <div
                                    class="border-base-300 rounded-box inline-flex items-center justify-center border p-1.5">
                                    <span class="iconify lucide--repeat size-4.5" />
                                </div>
                                Are there plans for future updates, and will they incur any costs?
                            </div>
                        </div>
                        <div class="collapse-content ms-12">
                            <p>
                                All future updates are completely free. No payment is required for any upcoming updates.
                                Yes, there are many plans for future updates. You can checkout
                                <NuxtLink
                                    class="text-primary ms-1"
                                    target="_blank"
                                    href="https://nexus.daisyui.com/docs/">
                                    future roadmap
                                </NuxtLink>
                            </p>
                        </div>
                    </div>
                    <div class="collapse-plus border-base-300 collapse">
                        <input type="radio" aria-label="Accordion radio" name="accordion" />
                        <div class="collapse-title cursor-pointer font-medium sm:text-xl">
                            <div class="ite flex items-center gap-4">
                                <div
                                    class="border-base-300 rounded-box inline-flex items-center justify-center border p-1.5">
                                    <span class="iconify lucide--server size-4.5" />
                                </div>
                                Do I need a backend for this?
                            </div>
                        </div>
                        <div class="collapse-content ms-12">
                            <p>
                                No backend is required to run this UI template. However, you can integrate any type of
                                backend as needed.
                            </p>
                        </div>
                    </div>
                    <div class="collapse-plus border-base-300 collapse">
                        <input type="radio" aria-label="Accordion radio" name="accordion" />
                        <div class="collapse-title cursor-pointer font-medium sm:text-xl">
                            <div class="ite flex items-center gap-4">
                                <div
                                    class="border-base-300 rounded-box inline-flex items-center justify-center border p-1.5">
                                    <span class="iconify lucide--telescope size-4.5" />
                                </div>
                                Is there any updates in the future?
                            </div>
                        </div>
                        <div class="collapse-content ms-12">
                            <p>
                                Yes, Our team constantly improves the admin template based on user feedback and industry
                                trends.
                                <NuxtLink
                                    class="text-primary ms-1"
                                    target="_blank"
                                    href="https://nexus.daisyui.com/docs/">
                                    You can see product roadmap
                                </NuxtLink>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
