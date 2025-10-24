<script setup lang="ts">
import PageTitle from "~/components/PageTitle.vue";
import CategoryTable from "./CategoryTable.vue";

definePageMeta({
    layout: "admin",
});

// Set page title from admin menu
const { setPageTitleFromMenu } = useAdminMenu();
setPageTitleFromMenu();
</script>
<template>
    <div>
        <PageTitle :title="'Categories'" :items="[{ label: 'Catalogs' }, { label: 'Categories', active: true }]" />
        <div class="mt-6">
            <CategoryTable />
        </div>
    </div>
</template>
