<script setup lang="ts">
import StatItem, { type IStatItem } from "./StatItem.vue";

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
    <div class="grid gap-5 lg:grid-cols-2 xl:grid-cols-4">
        <StatItem
            v-for="(card, index) in statItems"
            :key="index"
            :title="card.title"
            :amount="card.amount"
            :percent="card.percent"
            :icon="card.icon"
            :last-amount="card.lastAmount" />
    </div>
</template>
