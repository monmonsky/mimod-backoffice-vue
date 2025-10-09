<script setup lang="ts">
type IStatItem = {
    title: string;
    amount: string;
    percent: number;
    icon: string;
};

const statItems: IStatItem[] = [
    {
        title: "Articles Published",
        amount: "1,284",
        percent: 6.2,
        icon: "lucide--file-text",
    },
    {
        title: "Search Queries",
        amount: "86.7K",
        percent: 9.5,
        icon: "lucide--search",
    },
    {
        title: "User Feedback",
        amount: "3,210",
        percent: 4.3,
        icon: "lucide--message-square",
    },
    {
        title: "Bounce Rate",
        amount: "38.2%",
        percent: -2.1,
        icon: "lucide--trending-down",
    },
];
</script>

<template>
    <div class="bg-base-100 rounded-box grid grid-cols-1 gap-4 shadow sm:grid-cols-2 2xl:grid-cols-4">
        <div v-for="(statItem, index) in statItems" :key="index" class="group relative py-6">
            <div
                class="bg-base-200 rounded-box absolute inset-3 scale-80 opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-30" />

            <div class="relative flex flex-col items-center">
                <div class="bg-base-100 flex items-center justify-center rounded-full p-2.5 shadow">
                    <span :class="`iconify size-5 ${statItem.icon}`" />
                </div>
                <p class="mt-3 text-2xl font-semibold">{{ statItem.amount }}</p>
                <p class="text-base-content/60 text-sm font-medium">{{ statItem.title }}</p>
                <div class="mt-1">
                    <div v-if="statItem.percent > 0" class="text-success flex items-center gap-1 font-medium">
                        <span class="iconify lucide--arrow-up size-3.5" />
                        {{ statItem.percent }}%
                    </div>
                    <div v-else class="text-error flex items-center gap-1 font-medium">
                        <span class="iconify lucide--arrow-down size-3.5" />
                        {{ statItem.percent }}%
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
