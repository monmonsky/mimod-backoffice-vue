<script setup lang="ts">
import PageTitle from "~/components/PageTitle.vue";
import UserActivityTable from "./UserActivityTable.vue";

definePageMeta({
    layout: "admin",
});

// Set page title from admin menu
const { setPageTitleFromMenu } = useAdminMenu();
setPageTitleFromMenu();
</script>
<template>
    <div>
        <PageTitle :title="'User Activity'" :items="[{ label: 'Access Control' }, { label: 'User Activity', active: true }]" />
        <div class="mt-6">
            <UserActivityTable />
        </div>
    </div>
</template>
