<script setup lang="ts">
import StatItem, { type IStatItem } from "./StatItem.vue";

const statItems: IStatItem[] = [
    {
        title: "Customers",
        amount: "4,235",
        percent: 8.04,
        icon: "lucide--users",
    },
    {
        title: "Revenue",
        amount: "$75,400",
        percent: 15.3,
        icon: "lucide--dollar-sign",
    },
    {
        title: "Closed Deals",
        amount: "574",
        percent: -2.4,
        icon: "lucide--handshake",
    },
    {
        title: "Satisfaction",
        amount: "93%",
        percent: 2.3,
        icon: "lucide--smile",
    },
];

// State to track the selected stat item
const selected = ref(statItems[1]);
</script>
<template>
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-1">
        <div v-for="(stat, index) in statItems" :key="index" class="cursor-pointer" @click="selected = stat">
            <StatItem v-bind="stat" :selected="selected.title === stat.title" />
        </div>
    </div>
</template>
