<script setup lang="ts">
import PageTitle from "~/components/PageTitle.vue";
import CouponsTable from "./CouponsTable.vue";

definePageMeta({
    layout: "admin",
});

// Set page title from admin menu
const { setPageTitleFromMenu } = useAdminMenu();
setPageTitleFromMenu();
</script>

<template>
    <div>
        <PageTitle :title="'Coupons'" :items="[{ label: 'Marketing' }, { label: 'Coupons', active: true }]" />

        <div class="mt-6">
            <CouponsTable />
        </div>
    </div>
</template>
