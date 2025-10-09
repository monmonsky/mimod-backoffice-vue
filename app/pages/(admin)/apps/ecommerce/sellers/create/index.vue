<script setup lang="ts">
import PageTitle from "~/components/PageTitle.vue";

import CreateSellerForm from "./CreateSellerForm.vue";

definePageMeta({
    layout: "admin",
});
</script>
<template>
    <div>
        <PageTitle
            :items="[
                { label: 'Sellers', path: '/apps/ecommerce/sellers' },
                { label: 'Create', active: true },
            ]"
            title="Create Seller" />
        <div class="mt-6">
            <CreateSellerForm />
        </div>
    </div>
</template>
