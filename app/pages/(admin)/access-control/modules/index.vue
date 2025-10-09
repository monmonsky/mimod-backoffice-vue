<script setup lang="ts">
import PageTitle from "~/components/PageTitle.vue";
import ModuleTable from "./ModuleTable.vue";

definePageMeta({
    layout: "admin",
});
</script>
<template>
    <div>
        <PageTitle :title="'Modules'" :items="[{ label: 'Access Control' }, { label: 'Modules', active: true }]" />
        <div class="mt-6">
            <ModuleTable />
        </div>
    </div>
</template>
