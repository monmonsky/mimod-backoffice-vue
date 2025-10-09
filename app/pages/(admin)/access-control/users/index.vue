<script setup lang="ts">
import PageTitle from "~/components/PageTitle.vue";
import UserTable from "./UserTable.vue";

definePageMeta({
    layout: "admin",
});
</script>
<template>
    <div>
        <PageTitle :title="'Users'" :items="[{ label: 'Access Control' }, { label: 'Users', active: true }]" />
        <div class="mt-6">
            <UserTable />
        </div>
    </div>
</template>
