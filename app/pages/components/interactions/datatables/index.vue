<script setup lang="ts">
import AdvancedDemo from "./AdvancedDemo.vue";
import ColumnSearchDemo from "./ColumnSearchDemo.vue";
import ColumnVisibilityDemo from "./ColumnVisibilityDemo.vue";
import GlobalSearchDemo from "./GlobalSearchDemo.vue";
import PaginationDemo from "./PaginationDemo.vue";
import RowActionsDemo from "./RowActionsDemo.vue";
import RowSelectionDemo from "./RowSelectionDemo.vue";
import ScrollableDemo from "./ScrollableDemo.vue";
import SimpleDemo from "./SimpleDemo.vue";
import SortingDemo from "./SortingDemo.vue";

definePageMeta({
    layout: "components",
});
</script>

<template>
    <div>
        <ComponentPageTitle
            label="Interactions"
            title="Data Tables"
            description="Powerful data tables with sorting, search, pagination, column control, and row actions" />
        <div class="bg-base-200/40 rounded-box mt-6 px-5 py-4 lg:mt-12">
            <p class="text-base-content/60 font-medium">Usage guidelines</p>
            <p class="mt-1">
                <span class="me-1">- Plugin Documentation:</span>
                <NuxtLink href="https://tanstack.com/table" target="_blank" class="text-primary">
                    Tanstack Table
                </NuxtLink>
            </p>
        </div>
        <p class="text-base-content/60 mt-8 font-medium">Complete Actions</p>
        <div class="mt-4 lg:mt-6">
            <div class="bg-base-100 card card-border">
                <div
                    class="bg-base-200/30 rounded-t-box flex flex-wrap items-center justify-between space-x-2 px-5 py-4">
                    <p class="font-medium">Recent Orders</p>
                    <p class="text-base-content/50 text-xs italic">Synced 20 min ago</p>
                </div>
                <AdvancedDemo />
            </div>
        </div>
        <p class="text-base-content/60 mt-8 font-medium">Feature Demos</p>

        <div class="mt-8 space-y-6 xl:space-y-8 2xl:space-y-12">
            <div class="bg-base-100 card card-border">
                <div
                    class="bg-base-200/30 rounded-t-box flex flex-wrap items-center justify-between space-x-2 px-5 py-4">
                    <p class="font-medium">Simple</p>
                    <p class="text-base-content/70 text-sm">Clean layout for static content</p>
                </div>
                <div class="py-1">
                    <SimpleDemo />
                </div>
            </div>
            <div class="bg-base-100 card card-border">
                <div
                    class="bg-base-200/30 rounded-t-box flex flex-wrap items-center justify-between space-x-2 px-5 py-4">
                    <p class="font-medium">Scrollable</p>
                    <p class="text-base-content/70 text-sm">Scroll to view more rows</p>
                </div>
                <ScrollableDemo />
            </div>
            <div class="bg-base-100 card card-border">
                <div
                    class="bg-base-200/30 rounded-t-box flex flex-wrap items-center justify-between space-x-2 px-5 py-4">
                    <p class="font-medium">Column Search</p>
                    <p class="text-base-content/70 text-sm">Search specific columns like name</p>
                </div>
                <div class="pb-1">
                    <ColumnSearchDemo />
                </div>
            </div>
            <div class="bg-base-100 card card-border">
                <div
                    class="bg-base-200/30 rounded-t-box flex flex-wrap items-center justify-between space-x-2 px-5 py-4">
                    <p class="font-medium">Global Search</p>
                    <p class="text-base-content/70 text-sm">Search across all table fields</p>
                </div>
                <div class="pb-1">
                    <GlobalSearchDemo />
                </div>
            </div>
            <div class="bg-base-100 card card-border">
                <div
                    class="bg-base-200/30 rounded-t-box flex flex-wrap items-center justify-between space-x-2 px-5 py-4">
                    <p class="font-medium">Pagination</p>
                    <p class="text-base-content/70 text-sm">Navigate data page by page</p>
                </div>
                <div class="py-1">
                    <PaginationDemo />
                </div>
            </div>
            <div class="bg-base-100 card card-border">
                <div
                    class="bg-base-200/30 rounded-t-box flex flex-wrap items-center justify-between space-x-2 px-5 py-4">
                    <p class="font-medium">Sorting</p>
                    <p class="text-base-content/70 text-sm">Sort rows by column values</p>
                </div>
                <div class="py-1">
                    <SortingDemo />
                </div>
            </div>
            <div class="bg-base-100 card card-border">
                <div
                    class="bg-base-200/30 rounded-t-box flex flex-wrap items-center justify-between space-x-2 px-5 py-4">
                    <p class="font-medium">Column Visibility</p>
                    <p class="text-base-content/70 text-sm">Show or hide table columns</p>
                </div>
                <ColumnVisibilityDemo />
            </div>
            <div class="bg-base-100 card card-border">
                <div
                    class="bg-base-200/30 rounded-t-box flex flex-wrap items-center justify-between space-x-2 px-5 py-4">
                    <p class="font-medium">Row Selection</p>
                    <p class="text-base-content/70 text-sm">Select one or multiple rows</p>
                </div>
                <div>
                    <RowSelectionDemo />
                </div>
            </div>
            <div class="bg-base-100 card card-border">
                <div
                    class="bg-base-200/30 rounded-t-box flex flex-wrap items-center justify-between space-x-2 px-5 py-4">
                    <p class="font-medium">Row Actions</p>
                    <p class="text-base-content/70 text-sm">Perform actions directly on rows</p>
                </div>
                <div class="py-1">
                    <RowActionsDemo />
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
