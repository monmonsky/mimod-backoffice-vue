<script setup lang="ts">
export type ITasksTableRow = {
    icon: string;
    name: string;
    status: "in_progress" | "on_hold" | "done";
    time: string;
};

defineProps<ITasksTableRow>();
</script>
<template>
    <tr>
        <td class="flex items-center space-x-3 truncate">
            <div class="bg-base-200 rounded-box p-2">
                <span :class="`iconify ${icon} block size-4`" />
            </div>
            <p>{{ name }}</p>
        </td>

        <td>
            <div class="flex items-center gap-2">
                <template v-if="status === 'in_progress'">
                    <div class="status status-info" />
                    In Progress
                </template>
                <template v-else-if="status === 'on_hold'">
                    <div class="status status-warning" />
                    On Hold
                </template>
                <template v-else-if="status === 'done'">
                    <div class="status status-success" />
                    Done
                </template>
            </div>
        </td>

        <td>
            <div class="text-base-content/80 inline-flex items-center gap-1 text-sm">
                <span class="iconify lucide--clock size-3.5" />
                {{ time }}
            </div>
        </td>

        <td>
            <button aria-label="Show product" class="btn btn-circle btn-ghost btn-sm">
                <span class="iconify lucide--eye text-base-content/80 size-4" />
            </button>
        </td>
    </tr>
</template>
