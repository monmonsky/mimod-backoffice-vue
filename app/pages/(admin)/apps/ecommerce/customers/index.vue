<script setup lang="ts">
import PageTitle from "~/components/PageTitle.vue";

import CustomerTable from "./CustomerTable.vue";

definePageMeta({
    layout: "admin",
});
</script>
<template>
    <div>
        <PageTitle :title="'Customers'" :items="[{ label: 'Ecommerce' }, { label: 'Customers', active: true }]" />
        <div class="mt-6">
            <CustomerTable />
        </div>
    </div>
</template>
