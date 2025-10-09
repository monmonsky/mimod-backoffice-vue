<script setup lang="ts">
export type IStatItem = {
    icon: string;
    name: string;
    used: number;
    total: number;
    progressClass: string;
};

const statItems: IStatItem[] = [
    {
        icon: "lucide--folder",
        name: "Projects",
        used: 65.5,
        total: 125,
        progressClass: "progress-primary",
    },
    {
        icon: "lucide--image",
        name: "Media",
        used: 42,
        total: 80,
        progressClass: "progress-warning",
    },
    {
        icon: "lucide--file-text",
        name: "Documents",
        used: 91,
        total: 100,
        progressClass: "progress-error",
    },
    {
        icon: "lucide--trash-2",
        name: "Trash",
        used: 18,
        total: 40,
        progressClass: "progress-info",
    },
];
</script>

<template>
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-4">
        <div
            v-for="(statItem, index) in statItems"
            :key="index"
            class="card bg-base-100 cursor-pointer shadow transition-all hover:shadow-md">
            <div class="p-4">
                <div class="bg-base-200 rounded-box inline-flex items-center justify-center p-2">
                    <span :class="`iconify size-5 ${statItem.icon}`" />
                </div>
                <div class="mt-3 flex items-center justify-between">
                    <p class="text-sm font-medium">{{ statItem.name }}</p>
                    <span class="text-base-content/80 text-xs">
                        {{ ((statItem.used * 100) / statItem.total).toFixed(0) }}%
                    </span>
                </div>
                <progress
                    :max="statItem.total"
                    :value="statItem.used"
                    :class="`progress ${statItem.progressClass} mt-0.5 h-1.5 align-super`" />
                <div class="-mt-1.5 flex items-center justify-between">
                    <span class="text-sm font-medium">{{ statItem.used }} GB</span>
                    <span class="text-base-content/80 text-xs">{{ statItem.total }} GB</span>
                </div>
            </div>
        </div>
    </div>
</template>
