<script setup lang="ts">
import PageTitle from "~/components/PageTitle.vue";
import OrdersTable from "./OrdersTable.vue";

definePageMeta({
    layout: "admin",
    middleware: "auth",
});

// Set page title from admin menu
const { setPageTitleFromMenu } = useAdminMenu();
setPageTitleFromMenu();
</script>

<template>
    <div>
        <PageTitle :title="'Orders'" :items="[{ label: 'Orders', active: true }]" />
        <div class="mt-6">
            <OrdersTable />
        </div>
    </div>
</template>
