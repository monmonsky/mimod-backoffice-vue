<script lang="ts" setup>
import PageTitle from "~/components/PageTitle.vue";

import SellerTable from "./SellerTable.vue";

definePageMeta({
    layout: "admin",
});
</script>
<template>
    <div>
        <PageTitle :items="[{ label: 'Ecommerce' }, { label: 'Sellers', active: true }]" title="Sellers" />
        <div class="mt-6">
            <SellerTable />
        </div>
    </div>
</template>
