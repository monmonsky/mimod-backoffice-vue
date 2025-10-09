<script setup lang="ts">
import PageTitle from "~/components/PageTitle.vue";

import ProductTable from "./ProductTable.vue";

definePageMeta({
    layout: "admin",
});
</script>
<template>
    <div>
        <PageTitle :items="[{ label: 'Ecommerce' }, { label: 'Shops', active: true }]" title="Shops" />
        <div class="mt-6">
            <ProductTable />
        </div>
    </div>
</template>
