<script setup lang="ts">
type IStatItem = {
    title: string;
    amount: string;
    percent: number;
    icon: string;
    lastAmount: string;
};

const statItems: IStatItem[] = [
    {
        title: "Revenue",
        amount: "$587.54",
        percent: 10.8,
        icon: "lucide--circle-dollar-sign",
        lastAmount: "$494.16",
    },
    {
        title: "Sales",
        amount: "4500",
        percent: 21.2,
        icon: "lucide--package",
        lastAmount: "3845",
    },
    {
        title: "Customers",
        amount: "2242",
        percent: -6.8,
        icon: "lucide--users",
        lastAmount: "2448",
    },
    {
        title: "Spending",
        amount: "$112.54",
        percent: 8.5,
        icon: "lucide--eraser",
        lastAmount: "$98.14",
    },
];
</script>

<template>
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 2xl:grid-cols-4">
        <div v-for="(statItem, index) in statItems" :key="index" class="card bg-base-100 shadow">
            <div class="card-body gap-2 p-4">
                <div class="flex items-start justify-between gap-2 text-sm">
                    <div>
                        <p class="text-base-content/60 font-medium">{{ statItem.title }}</p>
                        <div class="mt-3 flex items-center gap-2">
                            <p class="inline text-2xl font-semibold">{{ statItem.amount }}</p>
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
                        </div>
                    </div>
                    <div class="bg-base-200 rounded-box flex items-center p-1.5">
                        <span :class="`iconify size-4.5 ${statItem.icon}`" />
                    </div>
                </div>

                <p class="text-base-content/60 text-sm">
                    vs.<span class="mx-1">{{ statItem.lastAmount }}</span
                    >last period
                </p>
            </div>
        </div>
    </div>
</template>
