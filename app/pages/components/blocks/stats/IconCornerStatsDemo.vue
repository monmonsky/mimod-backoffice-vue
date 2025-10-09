<script setup lang="ts">
type IStatItem = {
    title: string;
    amount: string;
    percent: number;
    icon: string;
};

const statItems: IStatItem[] = [
    {
        title: "Prompts Generated",
        amount: "9.2M",
        percent: 14.6,
        icon: "lucide--zap",
    },
    {
        title: "New Paid Users",
        amount: "3,124",
        percent: 7.8,
        icon: "lucide--badge-check",
    },
    {
        title: "API Requests",
        amount: "174.6K",
        percent: 11.2,
        icon: "lucide--terminal-square",
    },
    {
        title: "Avg. Response Time",
        amount: "87 ms",
        percent: -4.1,
        icon: "lucide--gauge-circle",
    },
];
</script>

<template>
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 2xl:grid-cols-4">
        <div v-for="(statItem, index) in statItems" :key="index" class="card bg-base-100 relative shadow">
            <div class="card-body gap-2">
                <p class="inline text-2xl/none font-semibold">{{ statItem.amount }}</p>
                <p class="text-base-content/60 mt-1 text-sm font-medium">{{ statItem.title }}</p>
                <div class="mt-5 flex items-center gap-2">
                    <div
                        v-if="statItem.percent > 0"
                        class="badge badge-soft badge-success badge-sm gap-0.5 px-1 font-medium">
                        <span class="iconify lucide--arrow-up size-3.5" />
                        {{ statItem.percent }}%
                    </div>
                    <div v-else class="badge badge-soft badge-error badge-sm gap-0.5 px-1 font-medium">
                        <span class="iconify lucide--arrow-down size-3.5" />
                        {{ statItem.percent }}%
                    </div>
                    <p class="text-base-content/60 text-sm">compared to week</p>
                </div>
            </div>
            <div class="to-base-200/60 absolute -end-3 -top-3 rounded-full bg-linear-to-bl from-transparent p-1.5">
                <div class="bg-base-100 flex items-center justify-center rounded-full p-2 shadow">
                    <span :class="`iconify size-6 ${statItem.icon}`" />
                </div>
            </div>
        </div>
    </div>
</template>
