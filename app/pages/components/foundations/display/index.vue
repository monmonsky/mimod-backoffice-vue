<script setup lang="ts">
definePageMeta({
    layout: "components",
});
</script>

<template>
    <div>
        <ComponentPageTitle
            label="Foundations"
            title="Display"
            description="Showcase visual styles and utilities to control layout, visibility, and element appearance" />

        <p class="text-base-content/60 mt-6 font-medium lg:mt-12">Demos</p>

        <div class="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div class="card card-border bg-base-100">
                <div class="bg-base-200/30 rounded-t-box px-5 py-3 font-medium">Flex: Row</div>
                <div class="p-6">
                    <div class="flex gap-6">
                        <div
                            class="bg-base-200 rounded-box text-base-content/60 flex size-12 items-center justify-center md:size-16">
                            1
                        </div>
                        <div
                            class="bg-base-200 rounded-box text-base-content/60 flex size-12 items-center justify-center md:size-16">
                            2
                        </div>
                        <div
                            class="bg-base-200 rounded-box text-base-content/60 flex size-12 items-center justify-center md:size-16">
                            3
                        </div>
                        <div
                            class="bg-base-200 rounded-box text-base-content/60 flex size-12 items-center justify-center md:size-16">
                            4
                        </div>
                    </div>
                </div>
            </div>

            <div class="card card-border bg-base-100">
                <div class="bg-base-200/30 rounded-t-box px-5 py-3 font-medium">Flex: Reverse Row</div>
                <div class="p-6">
                    <div class="inline-flex flex-row-reverse gap-6">
                        <div
                            class="bg-base-200 rounded-box text-base-content/60 flex size-12 items-center justify-center md:size-16">
                            1
                        </div>
                        <div
                            class="bg-base-200 rounded-box text-base-content/60 flex size-12 items-center justify-center md:size-16">
                            2
                        </div>
                        <div
                            class="bg-base-200 rounded-box text-base-content/60 flex size-12 items-center justify-center md:size-16">
                            3
                        </div>
                        <div
                            class="bg-base-200 rounded-box text-base-content/60 flex size-12 items-center justify-center md:size-16">
                            4
                        </div>
                    </div>
                </div>
            </div>

            <div class="card card-border bg-base-100">
                <div class="bg-base-200/30 rounded-t-box px-5 py-3 font-medium">Flex: Column</div>
                <div class="p-6">
                    <div class="flex flex-col gap-6">
                        <div
                            class="bg-base-200 rounded-box text-base-content/60 flex size-12 items-center justify-center md:size-16">
                            1
                        </div>
                        <div
                            class="bg-base-200 rounded-box text-base-content/60 flex size-12 items-center justify-center md:size-16">
                            2
                        </div>
                        <div
                            class="bg-base-200 rounded-box text-base-content/60 flex size-12 items-center justify-center md:size-16">
                            3
                        </div>
                    </div>
                </div>
            </div>

            <div class="card card-border bg-base-100">
                <div class="bg-base-200/30 rounded-t-box px-5 py-3 font-medium">Flex: Reverse Column</div>
                <div class="p-6">
                    <div class="inline-flex flex-col-reverse gap-6">
                        <div
                            class="bg-base-200 rounded-box text-base-content/60 flex size-12 items-center justify-center md:size-16">
                            1
                        </div>
                        <div
                            class="bg-base-200 rounded-box text-base-content/60 flex size-12 items-center justify-center md:size-16">
                            2
                        </div>
                        <div
                            class="bg-base-200 rounded-box text-base-content/60 flex size-12 items-center justify-center md:size-16">
                            3
                        </div>
                    </div>
                </div>
            </div>

            <div class="card card-border bg-base-100 col-span-full">
                <div class="bg-base-200/30 rounded-t-box px-5 py-3 font-medium">Grid of 4</div>
                <div class="p-4 sm:p-6">
                    <div class="grid grid-cols-4 gap-4 sm:gap-6">
                        <div
                            class="bg-base-200 rounded-box text-base-content/60 flex h-20 items-center justify-center text-sm md:h-28">
                            1/4
                        </div>
                        <div
                            class="bg-base-200 rounded-box text-base-content/60 flex h-20 items-center justify-center text-sm md:h-28">
                            1/4
                        </div>
                        <div
                            class="bg-base-200 rounded-box text-base-content/60 flex h-20 items-center justify-center text-sm md:h-28">
                            1/4
                        </div>
                        <div
                            class="bg-base-200 rounded-box text-base-content/60 flex h-20 items-center justify-center text-sm sm:h-28">
                            1/4
                        </div>
                    </div>
                </div>
            </div>

            <div class="card card-border bg-base-100 col-span-full">
                <div class="bg-base-200/30 rounded-t-box px-5 py-3 font-medium">Grid of 6</div>
                <div class="p-4 sm:p-6">
                    <div class="grid grid-cols-6 gap-4 sm:gap-6">
                        <div
                            class="bg-base-200 rounded-box text-base-content/60 col-span-3 flex h-20 items-center justify-center text-sm sm:h-28">
                            3/6
                        </div>
                        <div
                            class="bg-base-200 rounded-box text-base-content/60 col-span-2 flex h-20 items-center justify-center text-sm sm:h-28">
                            2/6
                        </div>
                        <div
                            class="bg-base-200 rounded-box text-base-content/60 col-span-1 flex h-20 items-center justify-center text-sm sm:h-28">
                            1/6
                        </div>
                    </div>
                </div>
            </div>

            <div class="card card-border bg-base-100 col-span-full">
                <div class="bg-base-200/30 rounded-t-box px-5 py-3 font-medium">Grid: Column</div>
                <div class="p-6">
                    <div class="grid grid-flow-col grid-rows-4 gap-6">
                        <div
                            v-for="i in 9"
                            :key="i"
                            class="bg-base-200 rounded-box text-base-content/60 col-span-2 flex h-12 items-center justify-center">
                            {{ i }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
