<script setup lang="ts">
import PageTitle from "~/components/PageTitle.vue";
import ShippingConfigsTable from "./ShippingConfigsTable.vue";

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
            :title="'Shipping Configs'"
            :items="[{ label: 'Settings' }, { label: 'Shipping Configs', active: true }]" />

        <!-- Table -->
        <div class="mt-6">
            <ShippingConfigsTable />
        </div>
    </div>
</template>
