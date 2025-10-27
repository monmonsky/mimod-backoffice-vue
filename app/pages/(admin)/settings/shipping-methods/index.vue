<script setup lang="ts">
import PageTitle from "~/components/PageTitle.vue";
import ShippingMethodsTable from "./ShippingMethodsTable.vue";

definePageMeta({
    layout: "admin",
});

// Set page title
const { setPageTitleFromMenu } = useAdminMenu();
setPageTitleFromMenu();
</script>

<template>
    <div>
        <PageTitle
            :title="'Shipping Methods'"
            :items="[{ label: 'Settings' }, { label: 'Shipping Methods', active: true }]" />

        <!-- Table -->
        <div class="mt-6">
            <ShippingMethodsTable />
        </div>
    </div>
</template>
