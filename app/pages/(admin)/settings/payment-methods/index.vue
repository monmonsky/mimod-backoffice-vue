<script setup lang="ts">
import PageTitle from "~/components/PageTitle.vue";
import PaymentMethodsTable from "./PaymentMethodsTable.vue";

definePageMeta({
    layout: "admin",
});

// Set page title from admin menu
const { setPageTitleFromMenu } = useAdminMenu();
setPageTitleFromMenu();
</script>

<template>
    <div>
        <PageTitle :title="'Payment Methods'" :items="[{ label: 'Settings' }, { label: 'Payment Methods', active: true }]" />

        <div class="mt-6">
            <PaymentMethodsTable />
        </div>
    </div>
</template>
