<script setup lang="ts">
import PageTitle from "~/components/PageTitle.vue";
import OrdersTable from "../OrdersTable.vue";

definePageMeta({
    layout: "admin",
    middleware: "auth",
});

const { setPageTitleFromMenu } = useAdminMenu();
setPageTitleFromMenu();

// Pre-filter for cancelled orders
const initialFilters = {
    status: 'cancelled'
};
</script>

<template>
    <div>
        <PageTitle :title="'Cancelled Orders'" :items="[{ label: 'Orders' }, { label: 'Cancelled', active: true }]" />

        <!-- Alert Info -->
        <div class="alert alert-error shadow-sm mt-6 mx-6">
            <span class="iconify lucide--x-circle size-5" />
            <span>Showing only orders with <strong>cancelled</strong> status. These orders have been cancelled by customer or admin.</span>
        </div>

        <!-- Reuse OrdersTable with initial filters -->
        <div class="mt-6">
            <OrdersTable :initial-filters="initialFilters" :locked-filters="['status']" />
        </div>
    </div>
</template>
