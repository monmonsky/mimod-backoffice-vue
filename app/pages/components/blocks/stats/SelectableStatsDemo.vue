<script setup lang="ts">
type IStatItem = {
    title: string;
    amount: string;
    percent: number;
};

const statItems: IStatItem[] = [
    {
        title: "Projects Active",
        amount: "248",
        percent: 6.2,
    },
    {
        title: "Tasks Completed",
        amount: "12,584",
        percent: 9.4,
    },
    {
        title: "Team Messages",
        amount: "47.2K",
        percent: 3.7,
    },
    {
        title: "Downtime",
        amount: "1.2h",
        percent: -12.5,
    },
];
</script>

<template>
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
        <div
            v-for="(statItem, index) in statItems"
            :key="index"
            class="card bg-base-100 group card-border relative overflow-hidden">
            <div class="card-body">
                <p class="text-base-content/60 text-xs font-medium tracking-wide uppercase">
                    {{ statItem.title }}
                </p>

                <div class="mt-4 flex items-end justify-end gap-2 text-sm">
                    <p class="text-2xl/none font-semibold">{{ statItem.amount }}</p>
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

            <div
                class="bg-base-200 group-hover:bg-primary absolute -start-1 top-1/2 h-12 w-2 -translate-y-1/2 rounded-full transition-all duration-300 group-hover:h-16" />
        </div>
    </div>
</template>
