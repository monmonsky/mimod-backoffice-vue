<script setup lang="ts">
import { componentsMenuItems } from "~/layouts/component-menu";

definePageMeta({
    layout: "components",
});
</script>

<template>
    <div>
        <ComponentPageTitle
            label="Home"
            title="Components"
            description="All daisyUI, ApexCharts, and third-party components match the same clean style out of the box." />
        <div class="mt-12 space-y-6 md:space-y-8">
            <div v-for="(item, index) in componentsMenuItems.filter((i) => !i.isTitle)" :id="item.id" :key="index">
                <p class="text-base-content/60 font-medium sm:text-lg">{{ item.label }}</p>
                <div class="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
                    <NuxtLink v-for="(child, idx) in item.children" :key="idx" :to="child.url ?? ''" class="">
                        <div
                            class="bg-base-content/2 group border-base-content/5 rounded-box h-36 border opacity-75 grayscale-100 transition-all duration-500 hover:opacity-100 hover:grayscale-0">
                            <div
                                class="flex h-full items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.51,-0.69,0.3,2.01)] group-hover:scale-108">
                                <component :is="child.preview" />
                            </div>
                        </div>
                        <p class="p-2 text-center font-medium max-sm:text-sm">{{ child.label }}</p>
                    </NuxtLink>
                </div>
            </div>

            <div
                class="text-base-content/60 border-base-300 bg-base-200/5 rounded-box flex items-center justify-center border border-dashed py-8 text-lg">
                More crafted designs and powerful building blocks coming soon
            </div>
        </div>
    </div>
</template>
