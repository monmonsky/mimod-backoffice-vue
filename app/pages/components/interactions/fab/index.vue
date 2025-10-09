<script setup lang="ts">
import SimpleDemo from "./SimpleDemo.vue";
import TitleDemo from "./TitleDemo.vue";
import UploadDemo from "./UploadDemo.vue";

definePageMeta({
    layout: "components",
});
</script>

<template>
    <div>
        <ComponentPageTitle
            label="Interactions"
            title="FAB"
            description="Floating action button with icons, labels, and quick access to key actions" />
        <p class="text-base-content/60 mt-6 font-medium lg:mt-12">Demos</p>

        <div class="mt-6 grid grid-cols-1 gap-6 space-y-6 md:grid-cols-2 xl:grid-cols-3">
            <div class="bg-base-100 card card-border h-fit">
                <div class="bg-base-200/30 rounded-t-box px-5 py-3 font-medium">Simple</div>
                <div class="p-6">
                    <SimpleDemo />
                </div>
            </div>
            <div class="bg-base-100 card card-border h-fit">
                <div class="bg-base-200/30 rounded-t-box px-5 py-3 font-medium">Title</div>
                <div class="p-6">
                    <TitleDemo />
                </div>
            </div>
            <div class="bg-base-100 card card-border h-fit">
                <div class="bg-base-200/30 rounded-t-box px-5 py-3 font-medium">Upload Menu</div>
                <div class="p-6">
                    <UploadDemo />
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
