<script setup lang="ts">
import PageTitle from '~/components/PageTitle.vue';
import AttributesTable from './AttributesTable.vue';

definePageMeta({
    layout: 'admin',
});

const { setPageTitleFromMenu } = useAdminMenu();
setPageTitleFromMenu();
</script>

<template>
    <div>
        <PageTitle
            :title="'Product Attributes'"
            :items="[
                { label: 'Catalogs' },
                { label: 'Attributes', active: true },
            ]"
        />

        <div class="mt-6">
            <AttributesTable />
        </div>
    </div>
</template>
