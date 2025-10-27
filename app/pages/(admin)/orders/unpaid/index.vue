<script setup lang="ts">
import PageTitle from "~/components/PageTitle.vue";
import OrdersTable from "../OrdersTable.vue";

definePageMeta({
    layout: "admin",
    middleware: "auth",
});

const { setPageTitleFromMenu } = useAdminMenu();
setPageTitleFromMenu();

// Pre-filter for unpaid orders
const initialFilters = {
    payment_status: 'unpaid'
};
</script>

<template>
    <div>
        <PageTitle :title="'Unpaid Orders'" :items="[{ label: 'Orders' }, { label: 'Unpaid', active: true }]" />

        <!-- Alert Info -->
        <div class="alert alert-warning shadow-sm mt-6 mx-6">
            <span class="iconify lucide--info size-5" />
            <span>Showing only orders with <strong>unpaid</strong> payment status.</span>
        </div>

        <!-- Reuse OrdersTable with initial filters -->
        <div class="mt-6">
            <OrdersTable :initial-filters="initialFilters" :locked-filters="['payment_status']" />
        </div>
    </div>
</template>
