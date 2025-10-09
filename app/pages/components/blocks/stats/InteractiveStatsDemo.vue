<script setup lang="ts">
type IStatItem = {
    title: string;
    amount: string;
    percent: number;
    time: string;
    icon: string;
};

const statItems: IStatItem[] = [
    {
        title: "MRR",
        amount: "$82,450",
        percent: 5.2,
        time: "30d",
        icon: "lucide--dollar-sign",
    },
    {
        title: "Churn",
        amount: "2.4%",
        percent: -0.6,
        time: "30d",
        icon: "lucide--user-minus",
    },
    {
        title: "New Users",
        amount: "1,920",
        percent: 8.1,
        time: "7d",
        icon: "lucide--user-plus",
    },
    {
        title: "Active Teams",
        amount: "734",
        percent: 3.9,
        time: "7d",
        icon: "lucide--users",
    },
];
</script>

<template>
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
        <div v-for="(statItem, index) in statItems" :key="index" class="card bg-base-100 group card-border relative">
            <div class="card-body">
                <div class="flex items-center justify-between gap-2">
                    <span :class="`iconify size-4 ${statItem.icon}`" />
                    <p class="text-base-content/80">{{ statItem.title }}</p>
                </div>
                <p class="mt-2 text-2xl/none font-semibold">{{ statItem.amount }}</p>
                <div class="mt-4 flex items-center gap-1 text-sm">
                    <div v-if="statItem.percent > 0" class="text-success flex items-center gap-1 px-1 font-medium">
                        <span class="iconify lucide--arrow-up size-3.5 -rotate-45" />
                        {{ statItem.percent }}%
                    </div>
                    <div v-else class="text-error flex items-center gap-0.5 px-1 font-medium">
                        <span class="iconify lucide--arrow-down size-3.5 -rotate-45" />
                        {{ statItem.percent }}%
                    </div>
                    <p class="text-base-content/50">({{ statItem.time }})</p>
                </div>
            </div>

            <div
                class="rounded-box border-base-300 absolute end-3 top-3 flex origin-right scale-80 items-center p-0.5 opacity-0 shadow transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
                <button class="btn btn-ghost btn-xs btn-square" aria-label="Edit">
                    <span class="iconify lucide--pencil size-3.5" />
                </button>
                <button class="btn btn-ghost btn-xs btn-square" aria-label="Move">
                    <span class="iconify lucide--arrow-left-right size-3.5" />
                </button>
                <button
                    class="btn btn-ghost btn-error text-error hover:text-error-content btn-xs btn-square"
                    aria-label="Delete">
                    <span class="iconify lucide--trash-2 size-3.5" />
                </button>
            </div>
        </div>
    </div>
</template>
