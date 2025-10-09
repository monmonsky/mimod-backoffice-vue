<script setup lang="ts">
import FileTable from "./(components)/FileTable.vue";
import FolderList from "./(components)/FolderList.vue";
import StatList from "./(components)/StatList.vue";
import StorageOverview from "./(components)/StorageOverview.vue";
import UploadButton from "./(components)/UploadButton.vue";

definePageMeta({
    layout: "admin",
});
</script>

<template>
    <div class="grid grid-cols-1 gap-6 xl:grid-cols-3 2xl:grid-cols-4">
        <div class="col-span-1 xl:col-span-2 2xl:col-span-3">
            <div class="flex items-center justify-between">
                <h3 class="text-lg font-medium">File Manager</h3>
                <div class="inline-flex items-center gap-3">
                    <div class="drawer drawer-end">
                        <input
                            id="apps-file-overview-drawer"
                            aria-label="File Overview Trigger"
                            class="drawer-toggle"
                            type="checkbox" />
                        <div class="drawer-content">
                            <label
                                class="btn drawer-button btn-sm btn-ghost border-base-300 flex xl:hidden"
                                for="apps-file-overview-drawer">
                                <span class="iconify lucide--folder-kanban size-4" />
                            </label>
                        </div>
                        <div class="drawer-side z-[50]">
                            <label aria-label="close sidebar" class="drawer-overlay" for="apps-file-overview-drawer" />
                            <div class="w-72">
                                <StorageOverview />
                            </div>
                        </div>
                    </div>
                    <UploadButton />
                </div>
            </div>
            <div class="mt-6">
                <StatList />
            </div>
            <h3 class="mt-6 font-medium">Folders</h3>
            <div class="mt-3">
                <FolderList />
            </div>
            <h3 class="mt-6 font-medium">Your Files</h3>
            <div class="mt-3">
                <FileTable />
            </div>
        </div>
        <div class="hidden xl:col-span-1 xl:block 2xl:col-span-1">
            <StorageOverview />
        </div>
    </div>
</template>
