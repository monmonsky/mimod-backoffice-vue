<script lang="ts" setup>
import PageTitle from "~/components/PageTitle.vue";

import EditShopForm from "./EditShopForm.vue";

definePageMeta({
    layout: "admin",
});
</script>
<template>
    <div>
        <PageTitle
            :items="[
                { label: 'Shops', path: '/apps/ecommerce/shops' },
                { label: 'Edit', active: true },
            ]"
            title="Edit Shop" />
        <div class="mt-6">
            <EditShopForm />
        </div>
    </div>
</template>
