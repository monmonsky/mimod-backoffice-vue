<script setup lang="ts">
import PageTitle from "~/components/PageTitle.vue";

import CreateProductForm from "./CreateProductForm.vue";

definePageMeta({
    layout: "admin",
});
</script>

<template>
    <div>
        <PageTitle
            :items="[
                { label: 'Products', path: '/apps/ecommerce/products' },
                { label: 'Create', active: true },
            ]"
            title="Create Product" />
        <div class="mt-6">
            <CreateProductForm />
        </div>
    </div>
</template>
