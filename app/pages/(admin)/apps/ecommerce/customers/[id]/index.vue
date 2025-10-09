<script lang="ts" setup>
import PageTitle from "~/components/PageTitle.vue";

import EditCustomerForm from "./EditCustomerForm.vue";

definePageMeta({
    layout: "admin",
});
</script>

<template>
    <div>
        <PageTitle
            :items="[
                { label: 'Customers', path: '/apps/ecommerce/customers' },
                { label: 'Edit', active: true },
            ]"
            title="Edit Customer" />
        <div class="mt-6">
            <EditCustomerForm />
        </div>
    </div>
</template>
