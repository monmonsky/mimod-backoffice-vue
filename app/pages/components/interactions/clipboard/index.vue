<script setup lang="ts">
import CommandDemo from "./CommandDemo.vue";
import TextDemo from "./TextDemo.vue";

definePageMeta({
    layout: "components",
});
</script>

<template>
    <div>
        <ComponentPageTitle
            label="Interactions"
            title="Clipboard"
            description="Copy text to clipboard instantly with simple triggers and command-based interactions" />
        <p class="text-base-content/60 mt-6 font-medium lg:mt-12">Demos</p>
        <div class="mt-6 space-y-6">
            <div class="bg-base-100 card card-border">
                <div class="bg-base-200/30 rounded-t-box px-5 py-3 font-medium">Text</div>
                <div class="flex items-center justify-center p-6">
                    <TextDemo />
                </div>
            </div>
            <div class="bg-base-100 card card-border">
                <div class="bg-base-200/30 rounded-t-box px-5 py-3 font-medium">Command</div>
                <div class="flex items-center justify-center p-6">
                    <CommandDemo />
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
