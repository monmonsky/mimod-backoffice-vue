<script setup lang="ts">
import CardsDemo from "./CardsDemo.vue";
import CoverflowDemo from "./CoverflowDemo.vue";
import GridDemo from "./GridDemo.vue";
import NavigationDemo from "./NavigationDemo.vue";
import ParallaxDemo from "./ParallaxDemo.vue";
import ScrollbarDemo from "./ScrollbarDemo.vue";
import SimpleDemo from "./SimpleDemo.vue";
import ThumbsDemo from "./ThumbsDemo.vue";

definePageMeta({
    layout: "components",
});
</script>

<template>
    <div>
        <ComponentPageTitle
            label="Interactions"
            title="Carousel"
            description="Swipeable, responsive carousel with effects, grid layouts, navigation, and thumbnail support" />
        <div class="bg-base-200/40 rounded-box mt-6 px-5 py-4 lg:mt-12">
            <p class="text-base-content/60 font-medium">Usage guidelines</p>
            <p class="mt-1">
                <span class="me-1">- Plugin Documentation:</span>
                <NuxtLink href="https://swiperjs.com/" target="_blank" class="text-primary"> Swiperjs </NuxtLink>
            </p>
        </div>
        <p class="text-base-content/60 mt-6 font-medium">Demos</p>
        <div class="mt-6 space-y-6">
            <div class="bg-base-100 card card-border">
                <div class="bg-base-200/30 rounded-t-box px-5 py-3 font-medium">Simple</div>
                <div class="p-6">
                    <SimpleDemo />
                </div>
            </div>
            <div class="bg-base-100 card card-border">
                <div class="bg-base-200/30 rounded-t-box px-5 py-3 font-medium">Navigation</div>
                <div class="p-6">
                    <NavigationDemo />
                </div>
            </div>
            <div class="bg-base-100 card card-border">
                <div class="bg-base-200/30 rounded-t-box px-5 py-3 font-medium">Scrollbar</div>
                <div class="p-6">
                    <ScrollbarDemo />
                </div>
            </div>
            <div class="bg-base-100 card card-border">
                <div class="bg-base-200/30 rounded-t-box px-5 py-3 font-medium">Grid</div>
                <div class="p-6">
                    <GridDemo />
                </div>
            </div>
            <div class="bg-base-100 card card-border">
                <div class="bg-base-200/30 rounded-t-box px-5 py-3 font-medium">Parallax</div>
                <div class="p-6">
                    <ParallaxDemo />
                </div>
            </div>
            <div class="bg-base-100 card card-border">
                <div class="bg-base-200/30 rounded-t-box px-5 py-3 font-medium">Coverflow Effect</div>
                <div class="p-6">
                    <CoverflowDemo />
                </div>
            </div>
            <div class="bg-base-100 card card-border">
                <div class="bg-base-200/30 rounded-t-box px-5 py-3 font-medium">Cards Effect</div>
                <div class="p-6">
                    <CardsDemo />
                </div>
            </div>
            <div class="bg-base-100 card card-border">
                <div class="bg-base-200/30 rounded-t-box px-5 py-3 font-medium">Thumbs</div>
                <div class="p-6">
                    <ThumbsDemo />
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
