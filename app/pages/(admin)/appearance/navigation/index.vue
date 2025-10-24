<script setup lang="ts">
import PageTitle from "~/components/PageTitle.vue";
import MenusTable from "./MenusTable.vue";

definePageMeta({
    layout: "admin",
});

// Set page title from admin menu
const { setPageTitleFromMenu } = useAdminMenu();
setPageTitleFromMenu();

const statistics = ref<any>({});

const handleStatisticsUpdate = (stats: any) => {
    statistics.value = stats;
};
</script>

<template>
    <div>
        <PageTitle :title="'Navigation Menus'" :items="[{ label: 'Appearance' }, { label: 'Navigation', active: true }]" />

        <!-- Statistics Cards -->
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mt-6">
            <div class="card bg-base-100 shadow">
                <div class="card-body p-4">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-base-content/60 text-xs">Total Menus</p>
                            <p class="text-2xl font-bold">{{ statistics.total_menus || 0 }}</p>
                        </div>
                        <div class="rounded-full bg-primary/10 p-3">
                            <span class="iconify lucide--menu size-6 text-primary" />
                        </div>
                    </div>
                </div>
            </div>

            <div class="card bg-base-100 shadow">
                <div class="card-body p-4">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-base-content/60 text-xs">Active</p>
                            <p class="text-2xl font-bold">{{ statistics.active_menus || 0 }}</p>
                        </div>
                        <div class="rounded-full bg-success/10 p-3">
                            <span class="iconify lucide--check-circle size-6 text-success" />
                        </div>
                    </div>
                </div>
            </div>

            <div class="card bg-base-100 shadow">
                <div class="card-body p-4">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-base-content/60 text-xs">Header Menus</p>
                            <p class="text-2xl font-bold">{{ statistics.header_menus || 0 }}</p>
                        </div>
                        <div class="rounded-full bg-info/10 p-3">
                            <span class="iconify lucide--layout-dashboard size-6 text-info" />
                        </div>
                    </div>
                </div>
            </div>

            <div class="card bg-base-100 shadow">
                <div class="card-body p-4">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-base-content/60 text-xs">Footer Menus</p>
                            <p class="text-2xl font-bold">{{ statistics.footer_menus || 0 }}</p>
                        </div>
                        <div class="rounded-full bg-warning/10 p-3">
                            <span class="iconify lucide--layout-grid size-6 text-warning" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="mt-6">
            <MenusTable @update:statistics="handleStatisticsUpdate" />
        </div>
    </div>
</template>
