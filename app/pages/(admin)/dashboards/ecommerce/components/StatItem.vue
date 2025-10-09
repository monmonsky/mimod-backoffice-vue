<script setup lang="ts">
export type IStatItem = {
    title: string;
    amount: string;
    percent: number;
    icon: string;
    lastAmount: string;
};

defineProps<IStatItem>();
</script>
<template>
    <div class="card bg-base-100 shadow">
        <div class="card-body gap-2">
            <div class="flex items-start justify-between gap-2 text-sm">
                <div>
                    <p class="text-base-content/80 font-medium">{{ title }}</p>
                    <div class="mt-3 flex items-center gap-2">
                        <p class="inline text-2xl font-semibold">{{ amount }}</p>
                        <div
                            v-if="percent > 0"
                            class="badge badge-soft badge-success badge-sm gap-0.5 px-1 font-medium">
                            <span class="iconify lucide--arrow-up size-3.5" />
                            {{ percent }}%
                        </div>
                        <div v-else class="badge badge-soft badge-error badge-sm gap-0.5 px-1 font-medium">
                            <span class="iconify lucide--arrow-down size-3.5" />
                            {{ percent }}%
                        </div>
                    </div>
                </div>
                <div class="bg-base-200 rounded-box flex items-center p-2">
                    <span :class="`iconify size-5 ${icon}`" />
                </div>
            </div>

            <p class="text-base-content/60 text-sm">
                vs.<span class="mx-1">{{ lastAmount }}</span
                >last period
            </p>
        </div>
    </div>
</template>
