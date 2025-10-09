<script lang="ts" setup>
import PageTitle from "~/components/PageTitle.vue";

import CreateShopForm from "./CreateShopForm.vue";

definePageMeta({
    layout: "admin",
});
</script>
<template>
    <div>
        <PageTitle
            :items="[
                { label: 'Shops', path: '/apps/ecommerce/shops' },
                { label: 'Create', active: true },
            ]"
            title="Create Shop" />
        <div class="mt-6">
            <CreateShopForm />
        </div>
    </div>
</template>
