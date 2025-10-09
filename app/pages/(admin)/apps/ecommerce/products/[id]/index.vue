<script setup lang="ts">
import PageTitle from "~/components/PageTitle.vue";

import EditProductForm from "./EditProductForm.vue";

definePageMeta({
    layout: "admin",
});
</script>

<template>
    <div>
        <PageTitle
            :items="[
                { label: 'Products', path: '/apps/ecommerce/products' },
                { label: 'Edit', active: true },
            ]"
            title="Edit Product" />
        <div class="mt-6">
            <EditProductForm />
        </div>
    </div>
</template>
