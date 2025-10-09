<script lang="ts" setup>
import PageTitle from "~/components/PageTitle.vue";

import CreateCustomerForm from "./CreateCustomerForm.vue";

definePageMeta({
    layout: "admin",
});
</script>

<template>
    <div>
        <PageTitle
            :items="[
                { label: 'Customers', path: '/apps/ecommerce/customers' },
                { label: 'Create', active: true },
            ]"
            title="Create Customer" />
        <div class="mt-6">
            <CreateCustomerForm />
        </div>
    </div>
</template>
