<script setup lang="ts">
import PageTitle from "~/components/PageTitle.vue";

import RoleTable from "./RoleTable.vue";

definePageMeta({
    layout: "admin",
});

// Set page title from admin menu
const { setPageTitleFromMenu } = useAdminMenu();
setPageTitleFromMenu();
</script>
<template>
    <div>
        <PageTitle :title="'Roles'" :items="[{ label: 'Access Control' }, { label: 'Roles', active: true }]" />
        <div class="mt-6">
            <RoleTable />
        </div>
    </div>
</template>
