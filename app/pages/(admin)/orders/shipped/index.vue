<script setup lang="ts">
import PageTitle from "~/components/PageTitle.vue";
import OrdersTable from "../OrdersTable.vue";

definePageMeta({
    layout: "admin",
    middleware: "auth",
});

const { setPageTitleFromMenu } = useAdminMenu();
setPageTitleFromMenu();

// Pre-filter for shipped orders
const initialFilters = {
    status: 'shipped'
};
</script>

<template>
    <div>
        <PageTitle :title="'Shipped Orders'" :items="[{ label: 'Orders' }, { label: 'Shipped', active: true }]" />

        <!-- Alert Info -->
        <div class="alert alert-info shadow-sm mt-6 mx-6">
            <span class="iconify lucide--truck size-5" />
            <span>Showing only orders with <strong>shipped</strong> status. These orders are currently in delivery.</span>
        </div>

        <!-- Reuse OrdersTable with initial filters -->
        <div class="mt-6">
            <OrdersTable :initial-filters="initialFilters" :locked-filters="['status']" />
        </div>
    </div>
</template>
