<script setup lang="ts">
import BubbleDemo from "./BubbleDemo.vue";
import SnowDemo from "./SnowDemo.vue";

definePageMeta({
    layout: "components",
});
</script>

<template>
    <div>
        <ComponentPageTitle
            label="Interactions"
            title="Text Editor"
            description="Rich text editor with clean themes, formatting tools, and live editing experience." />
        <div class="bg-base-200/40 rounded-box mt-6 px-5 py-4 lg:mt-12">
            <p class="text-base-content/60 font-medium">Usage guidelines</p>
            <p class="mt-1">
                <span class="me-1">- Plugin Documentation:</span>
                <NuxtLink href="https://quilljs.com/" target="_blank" class="text-primary"> Quill </NuxtLink>
            </p>
        </div>
        <p class="text-base-content/60 mt-6 font-medium">Demos</p>
        <div class="mt-6 space-y-6">
            <div class="bg-base-100 card card-border">
                <div class="bg-base-200/30 px-5 py-3 font-medium">Snow Theme</div>
                <div class="p-6">
                    <SnowDemo />
                </div>
            </div>
            <div class="bg-base-100 card card-border">
                <div class="bg-base-200/30 px-5 py-3 font-medium">Bubble Theme</div>
                <div class="p-3">
                    <BubbleDemo />
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
