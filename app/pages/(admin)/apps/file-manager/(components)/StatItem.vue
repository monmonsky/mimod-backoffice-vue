<script lang="ts" setup>
export type IStatItem = {
    image: string;
    name: string;
    used: number;
    total: number;
    progressClass: string;
};

const props = defineProps<IStatItem>();
</script>

<template>
    <div class="card bg-base-100 cursor-pointer shadow transition-all hover:shadow-md">
        <div class="card-body p-4">
            <div class="bg-base-200 rounded-box w-fit p-2">
                <img :src="props.image" class="size-6" alt="" />
            </div>
            <div class="mt-3 flex items-center justify-between">
                <p class="text-sm font-medium">{{ props.name }}</p>
                <span class="text-base-content/80 text-xs"> {{ ((props.used * 100) / props.total).toFixed(0) }}% </span>
            </div>
            <progress
                class="progress mt-1.5 h-1.5"
                :class="props.progressClass"
                :max="props.total"
                :value="props.used" />
            <div class="mt-1.5 flex items-center justify-between">
                <span class="text-sm font-medium">{{ props.used }} GB</span>
                <span class="text-base-content/80 text-xs">{{ props.total }} GB</span>
            </div>
        </div>
    </div>
</template>
