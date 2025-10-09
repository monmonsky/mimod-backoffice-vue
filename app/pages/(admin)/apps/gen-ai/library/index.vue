<script lang="ts" setup>
import PageTitle from "~/components/PageTitle.vue";

import AiLibraryTable from "./AiLibraryTable.vue";

definePageMeta({
    layout: "admin",
});
</script>

<template>
    <div>
        <PageTitle title="Image Gen" :items="[{ label: 'Gen Ai' }, { label: 'Image Gen', active: true }]" />
        <div class="mt-6">
            <AiLibraryTable />
        </div>
    </div>
</template>
