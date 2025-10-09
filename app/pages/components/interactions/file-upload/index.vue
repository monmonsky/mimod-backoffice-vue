<script setup lang="ts">
import CircleDemo from "./CircleDemo.vue";
import DisabledDemo from "./DisabledDemo.vue";
import ImagePreviewDemo from "./ImagePreviewDemo.vue";
import MultipleDemo from "./MultipleDemo.vue";
import SimpleDemo from "./SimpleDemo.vue";

definePageMeta({
    layout: "components",
});
</script>

<template>
    <div>
        <ComponentPageTitle
            label="Interactions"
            title="File Upload"
            description="Customizable file upload with image preview, filters, renaming, and avatar selection support" />
        <div class="bg-base-200/40 rounded-box mt-6 px-5 py-4 lg:mt-12">
            <p class="text-base-content/60 font-medium">Usage guidelines</p>
            <p class="mt-1">
                <span class="me-1">- Plugin Documentation:</span>
                <NuxtLink href="https://pqina.nl/filepond/" target="_blank" class="text-primary"> Filepond </NuxtLink>
            </p>
        </div>
        <p class="text-base-content/60 mt-6 font-medium">Demos</p>
        <div class="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
            <div class="bg-base-100 card card-border">
                <div class="bg-base-200/30 rounded-t-box px-5 py-3 font-medium">Simple</div>
                <div class="p-6">
                    <SimpleDemo />
                </div>
            </div>
            <div class="bg-base-100 card card-border">
                <div class="bg-base-200/30 rounded-t-box px-5 py-3 font-medium">Disabled</div>
                <div class="p-6">
                    <DisabledDemo />
                </div>
            </div>
            <div class="bg-base-100 card card-border">
                <div class="bg-base-200/30 rounded-t-box px-5 py-3 font-medium">Image Preview</div>
                <div class="p-6">
                    <ImagePreviewDemo />
                </div>
            </div>

            <div class="bg-base-100 card card-border">
                <div class="bg-base-200/30 rounded-t-box px-5 py-3 font-medium">Multiple</div>
                <div class="p-6">
                    <MultipleDemo />
                </div>
            </div>
            <div class="bg-base-100 card card-border">
                <div class="bg-base-200/30 rounded-t-box px-5 py-3 font-medium">Avatar Picker</div>
                <div class="flex items-center justify-center p-6">
                    <CircleDemo />
                </div>
            </div>
        </div>
    </div>
</template>
