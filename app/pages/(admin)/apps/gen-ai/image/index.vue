<script lang="ts" setup>
import PageTitle from "@/components/PageTitle.vue";

import GeneratedImages from "./GeneratedImages.vue";
import ImageCreationForm from "./ImageCreationForm.vue";

definePageMeta({
    layout: "admin",
});
</script>
<template>
    <div>
        <PageTitle :title="'Image Gen'" :items="[{ label: 'Gen Ai' }, { label: 'Image Gen', active: true }]" />

        <div class="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-5 2xl:grid-cols-10">
            <div class="xl:col-span-2 2xl:col-span-3">
                <ImageCreationForm />
            </div>
            <div class="xl:col-span-3 2xl:col-span-7">
                <GeneratedImages />
            </div>
        </div>
    </div>
</template>
