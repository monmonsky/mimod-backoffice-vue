<script setup lang="ts">
import PageTitle from "~/components/PageTitle.vue";
import BrandTable from "./BrandTable.vue";

definePageMeta({
    layout: "admin",
});

// Set page title from admin menu
const { setPageTitleFromMenu } = useAdminMenu();
setPageTitleFromMenu();
</script>
<template>
    <div>
        <PageTitle :title="'Brands'" :items="[{ label: 'Catalogs' }, { label: 'Brands', active: true }]" />
        <div class="mt-6">
            <BrandTable />
        </div>
    </div>
</template>
