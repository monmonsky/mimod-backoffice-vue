<script setup lang="ts">
import PageTitle from "~/components/PageTitle.vue";
import PaymentConfigsTable from "./PaymentConfigsTable.vue";

definePageMeta({
    layout: "admin",
});

// Set page title from admin menu
const { setPageTitleFromMenu } = useAdminMenu();
setPageTitleFromMenu();
</script>

<template>
    <div>
        <PageTitle :title="'Payment Configs'" :items="[{ label: 'Settings' }, { label: 'Payment' }, { label: 'Payment Configs', active: true }]" />

        <div class="mt-6">
            <PaymentConfigsTable />
        </div>
    </div>
</template>
