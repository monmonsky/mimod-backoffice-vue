<script lang="ts" setup>
import StatItem from "./StatItem.vue";

export type IStatItem = {
    image: string;
    name: string;
    used: number;
    total: number;
    progressClass: string;
};

const statItems: IStatItem[] = [
    {
        image: "/images/apps/files/one-drive.svg",
        name: "One Drive",
        used: 85,
        total: 250,
        progressClass: "progress-primary",
    },
    {
        image: "/images/apps/files/google-drive.svg",
        name: "Google Drive",
        used: 56,
        total: 100,
        progressClass: "progress-warning",
    },
    {
        image: "/images/apps/files/mega.svg",
        name: "Mega",
        used: 126,
        total: 150,
        progressClass: "progress-error",
    },
    {
        image: "/images/apps/files/dropbox.svg",
        name: "Dropbox",
        used: 22,
        total: 40,
        progressClass: "progress-info",
    },
];
</script>

<template>
    <div class="grid gap-6 md:grid-cols-2 2xl:grid-cols-4">
        <StatItem v-for="(stat, index) in statItems" :key="index" v-bind="stat" />
    </div>
</template>
