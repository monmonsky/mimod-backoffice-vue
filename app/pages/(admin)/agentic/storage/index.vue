<script setup lang="ts">
import ErrorActionDemo from "./ErrorActionDemo.vue";
import FileDeletedActionDemo from "./FileDeletedActionDemo.vue";
import FileRenameActionDemo from "./FileRenameActionDemo.vue";
import FileSharedActionDemo from "./FileSharedActionDemo.vue";
import FileUploadedActionDemo from "./FileUploadedActionDemo.vue";
import FolderCreatedActionDemo from "./FolderCreatedActionDemo.vue";
import InProcessActionDemo from "./InProcessActionDemo.vue";
import InQueueActionDemo from "./InQueueActionDemo.vue";
import InputToolbar from "./InputToolbar.vue";
import NeedConfirmationActionDemo from "./NeedConfirmationActionDemo.vue";
import PermissionUpdatedActionDemo from "./PermissionUpdatedActionDemo.vue";
import StorageStatusActionDemo from "./StorageStatusActionDemo.vue";

definePageMeta({
    layout: "admin",
});
</script>

<template>
    <PageTitle title="Agentic Storage" :items="[{ label: 'Agentic Hub' }, { label: 'Storage', active: true }]" />
    <div class="mt-6 flex items-center justify-center">
        <InputToolbar />
    </div>
    <div class="mt-6 xl:mt-8">
        <p class="text-base-content/60 font-medium">Examples</p>
        <div class="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            <InProcessActionDemo />
            <InQueueActionDemo />
            <NeedConfirmationActionDemo />
            <ErrorActionDemo />
        </div>
        <p class="text-base-content/60 mt-6 font-medium">Tasks</p>
        <div class="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            <FileSharedActionDemo />
            <FileUploadedActionDemo />
            <StorageStatusActionDemo />
            <FolderCreatedActionDemo />
            <FileRenameActionDemo />
            <PermissionUpdatedActionDemo />
            <FileDeletedActionDemo />
            <div
                class="card bg-base-100 text-base-content/40 flex items-center justify-center py-6 text-lg font-medium shadow">
                More examples coming soon!
            </div>
        </div>
    </div>
</template>
