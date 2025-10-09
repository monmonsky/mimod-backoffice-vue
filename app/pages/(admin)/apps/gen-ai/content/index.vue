<script lang="ts" setup>
import PageTitle from "~/components/PageTitle.vue";

import ContentCreationForm from "./ContentCreationForm.vue";
import GeneratedContents from "./GeneratedContents.vue";

definePageMeta({
    layout: "admin",
});
</script>
<template>
    <div>
        <PageTitle :title="'Chat'" :items="[{ label: 'Apps' }, { label: 'Chat', active: true }]" />
        <div class="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-5 2xl:grid-cols-10">
            <div class="xl:col-span-2 2xl:col-span-3">
                <ContentCreationForm />
            </div>
            <div class="xl:col-span-3 2xl:col-span-7">
                <GeneratedContents />
            </div>
        </div>
    </div>
</template>
