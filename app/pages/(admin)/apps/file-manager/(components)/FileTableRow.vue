<script setup lang="ts">
export type IFileTableRow = {
    icon: string;
    name: string;
    size: string;
    date: string;
    owner: string;
    sharedWith: string;
};
defineProps<IFileTableRow>();
</script>
<template>
    <tr class="hover:bg-base-200">
        <td>
            <input class="checkbox checkbox-sm" aria-label="Checkbox example" type="checkbox" />
        </td>
        <td class="flex items-center space-x-3 truncate">
            <div class="bg-base-200 text-base-content/80 rounded-box flex items-center p-1.5">
                <span :class="`iconify ${icon} size-5`" />
            </div>
            <div class="text-sm font-medium">{{ name }}</div>
        </td>
        <td>{{ size }}</td>
        <td>{{ date }}</td>
        <td>{{ owner }}</td>
        <td v-html="sharedWith" />
        <td>
            <button class="btn btn-ghost btn-square btn-sm" aria-label="Show file">
                <span class="iconify lucide--eye text-base-content/80 size-4" />
            </button>
        </td>
    </tr>
</template>
