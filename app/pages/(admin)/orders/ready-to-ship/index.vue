<script setup lang="ts">
import PageTitle from "~/components/PageTitle.vue";
import OrdersTable from "../OrdersTable.vue";

definePageMeta({
    layout: "admin",
    middleware: "auth",
});

const { setPageTitleFromMenu } = useAdminMenu();
setPageTitleFromMenu();

// Pre-filter for ready to ship orders (paid + processing status)
const initialFilters = {
    payment_status: 'paid',
    status: 'processing'
};
</script>

<template>
    <div>
        <PageTitle :title="'Ready to Ship Orders'" :items="[{ label: 'Orders' }, { label: 'Ready to Ship', active: true }]" />

        <!-- Alert Info -->
        <div class="alert alert-success shadow-sm mt-6 mx-6">
            <span class="iconify lucide--info size-5" />
            <span>Showing only orders with <strong>paid</strong> payment status and <strong>processing</strong> status. These orders are ready for shipment.</span>
        </div>

        <!-- Reuse OrdersTable with initial filters -->
        <div class="mt-6">
            <OrdersTable :initial-filters="initialFilters" :locked-filters="['payment_status', 'status']" />
        </div>
    </div>
</template>
