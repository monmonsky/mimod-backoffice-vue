<script setup lang="ts">
import PageTitle from "~/components/PageTitle.vue";
import CustomersTable from "./CustomersTable.vue";

definePageMeta({
    layout: "admin",
});

// Set page title from admin menu
const { setPageTitleFromMenu } = useAdminMenu();
setPageTitleFromMenu();
</script>

<template>
    <div>
        <PageTitle :title="'Customers'" :items="[{ label: 'Customers', active: true }]">
            <template #actions>
                <NuxtLink class="btn btn-primary btn-sm" href="/customers/create">
                    <span class="iconify lucide--plus size-4" />
                    Add Customer
                </NuxtLink>
            </template>
        </PageTitle>

        <div class="mt-6">
            <CustomersTable />
        </div>
    </div>
</template>
