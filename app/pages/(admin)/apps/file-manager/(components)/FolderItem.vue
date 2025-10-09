<script setup lang="ts">
import FolderItemDropdown from "./FolderItemDropdown.vue";

export type IFolderItem = {
    icon: string;
    iconClass: string;
    name: string;
    filesCount: number;
};
defineProps<IFolderItem>();
</script>

<template>
    <div class="card card-border bg-base-100">
        <div class="card-body p-3">
            <div class="flex items-center gap-2">
                <div :class="`rounded-box flex items-center p-1.5 ${iconClass}`">
                    <span :class="`iconify ${icon} size-5`" />
                </div>
                <span class="text-sm font-medium">{{ name }}</span>
                <div class="ms-auto">
                    <FolderItemDropdown />
                </div>
            </div>
            <div class="text-base-content/70 mt-2 flex items-center text-xs">{{ filesCount }} Files</div>
        </div>
    </div>
</template>
