<script setup lang="ts">
import PageTitle from "~/components/PageTitle.vue";
import PermissionTable from "./PermissionTable.vue";

definePageMeta({
    layout: "admin",
});

// Set page title from admin menu
const { setPageTitleFromMenu } = useAdminMenu();
setPageTitleFromMenu();
</script>
<template>
    <div>
        <PageTitle
            :title="'Permissions'"
            :items="[{ label: 'Access Control' }, { label: 'Permissions', active: true }]" />
        <div class="mt-6">
            <PermissionTable />
        </div>
    </div>
</template>
