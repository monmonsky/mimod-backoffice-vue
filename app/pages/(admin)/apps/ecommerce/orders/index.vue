<script setup lang="ts">
import PageTitle from "~/components/PageTitle.vue";

import OrderTable from "./OrderTable.vue";

definePageMeta({
    layout: "admin",
});
</script>
<template>
    <div>
        <PageTitle title="Orders" :items="[{ label: 'Ecommerce' }, { label: 'Orders', active: true }]" />
        <div class="mt-6">
            <OrderTable />
        </div>
    </div>
</template>
