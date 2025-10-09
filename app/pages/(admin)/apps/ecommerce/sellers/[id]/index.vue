<script setup lang="ts">
import PageTitle from "~/components/PageTitle.vue";

import EditSellerForm from "./EditSellerForm.vue";

definePageMeta({
    layout: "admin",
});
</script>
<template>
    <div>
        <PageTitle
            :items="[
                { label: 'Sellers', path: '/apps/ecommerce/sellers' },
                { label: 'Edit', active: true },
            ]"
            title="Edit Seller" />
        <div class="mt-6">
            <EditSellerForm />
        </div>
    </div>
</template>
