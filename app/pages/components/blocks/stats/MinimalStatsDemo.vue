<script setup lang="ts">
type IStatItem = {
    title: string;
    amount: string;
    percent: number;
};

const statItems: IStatItem[] = [
    {
        title: "Tokens Used",
        amount: "8.9M",
        percent: 12.3,
    },
    {
        title: "Active Users",
        amount: "4,532",
        percent: 5.7,
    },
    {
        title: "Latency (ms)",
        amount: "98",
        percent: -3.2,
    },
    {
        title: "Model Invocations",
        amount: "117K",
        percent: 9.1,
    },
];
</script>

<template>
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
        <div v-for="(statItem, index) in statItems" :key="index" class="card bg-base-100 card-border">
            <div class="card-body">
                <p class="text-base-content/60 text-xs font-medium tracking-wide uppercase">
                    {{ statItem.title }}
                </p>
                <div class="mt-4 flex items-end justify-end gap-2 text-sm">
                    <p class="text-2xl/none font-semibold">
                        {{ statItem.amount }}
                    </p>
                    <div v-if="statItem.percent > 0" class="text-success flex items-center gap-0.5 px-1 font-medium">
                        <span class="iconify lucide--arrow-up size-3.5" />
                        {{ statItem.percent }}%
                    </div>
                    <div v-else class="text-error flex items-center gap-0.5 px-1 font-medium">
                        <span class="iconify lucide--arrow-down size-3.5" />
                        {{ statItem.percent }}%
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
