<script setup lang="ts">
import TasksTableRow, { type ITasksTableRow } from "./TasksTableRow.vue";

const tasks: ITasksTableRow[] = [
    {
        icon: "lucide--settings",
        name: "Model Fine-Tuning",
        status: "in_progress",
        time: "2h 30m",
    },
    {
        icon: "lucide--upload-cloud",
        name: "Dataset Processing",
        status: "on_hold",
        time: "1h 15m",
    },
    {
        icon: "lucide--wand",
        name: "Generating AI Art",
        status: "done",
        time: "45m",
    },
    {
        icon: "lucide--cpu",
        name: "Running Inference",
        status: "in_progress",
        time: "3h 10m",
    },
];
</script>
<template>
    <div aria-label="Card" class="card bg-base-100 shadow">
        <div class="card-body p-0">
            <div class="flex items-center gap-3 px-5 pt-5">
                <span class="iconify lucide--list-check size-4.5" />
                <span class="font-medium">Recent Generations</span>
                <button class="btn btn-outline border-base-300 max-sm:btn-square btn-sm ms-auto">
                    <span class="iconify lucide--file-text size-3.5" />
                    <span class="max-sm:hidden">Export</span>
                </button>
            </div>
            <div class="mt-2 overflow-auto">
                <table class="table *:text-nowrap">
                    <thead>
                        <tr>
                            <th>Task</th>
                            <th>Status</th>
                            <th>Duration</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <TasksTableRow v-for="(task, index) in tasks" :key="index" v-bind="task" />
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
