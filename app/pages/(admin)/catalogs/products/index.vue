<script setup lang="ts">
import PageTitle from "~/components/PageTitle.vue";
import ProductsTable from "./ProductsTable.vue";

definePageMeta({
    layout: "admin",
});
</script>

<template>
    <div>
        <PageTitle :title="'Products'" :items="[{ label: 'Catalogs' }, { label: 'Products', active: true }]" />

        <div class="mt-6">
            <ProductsTable />
        </div>
    </div>
</template>
