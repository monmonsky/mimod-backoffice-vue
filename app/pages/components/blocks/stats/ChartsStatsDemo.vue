<script setup lang="ts">
import type { ApexOptions } from "apexcharts";
import { nextTick, onMounted, ref } from "vue";

type IStatItem = {
    title: string;
    amount: string;
    percent: number;
    data: number[];
    color: string;
};

const statItems: IStatItem[] = [
    {
        title: "Total Sales",
        amount: "$189K",
        percent: 14.8,
        data: [120, 150, 180, 160, 200, 230, 210, 250],
        color: "#4caf50",
    },
    {
        title: "New Customers",
        amount: "1,245",
        percent: 7.2,
        data: [80, 90, 100, 95, 110, 130, 125, 140],
        color: "#6c74f8",
    },
    {
        title: "Churn Rate",
        amount: "2.8%",
        percent: -1.5,
        data: [3.2, 3.1, 3.0, 2.9, 3.1, 3.0, 2.8, 2.8],
        color: "#f44336",
    },
    {
        title: "Revenue Growth",
        amount: "23%",
        percent: 5.4,
        data: [15, 18, 20, 22, 21, 23, 24, 25],
        color: "#ff8b4b",
    },
];

const chartRefs = ref<(HTMLElement | null)[]>([]);

function setChartRef(el: HTMLElement | null, index: number) {
    chartRefs.value[index] = el;
}

function getChartOptions(stat: IStatItem): ApexOptions {
    const min = Math.min(...stat.data) * 0.85;
    const max = Math.max(...stat.data) * 1.15;

    return {
        chart: {
            height: 28,
            type: "line",
            background: "transparent",
            toolbar: { show: false },
            sparkline: { enabled: true },
        },
        stroke: {
            curve: "smooth",
            width: 2,
        },
        dataLabels: { enabled: false },
        legend: { show: false },
        xaxis: {
            categories: ["Feb 19", "Feb 20", "Feb 21", "Feb 22", "Feb 23", "Feb 24", "Feb 25", "Feb 26"],
            axisBorder: { show: false },
            labels: { show: false },
            axisTicks: { show: false },
        },
        yaxis: {
            show: false,
            labels: { show: false },
            axisBorder: { show: false },
            axisTicks: { show: false },
            min,
            max,
        },
        tooltip: {
            enabled: true,
            shared: true,
            intersect: false,
        },
        grid: { show: false },
        colors: [stat.color],
        series: [
            {
                name: stat.title,
                data: stat.data,
            },
        ],
    };
}

onMounted(async () => {
    const ApexCharts = (await import("apexcharts")).default;
    await nextTick();

    statItems.forEach((stat, index) => {
        const el = chartRefs.value[index];
        if (el) {
            const chart = new ApexCharts(el, getChartOptions(stat));
            chart.render();
        }
    });
});
</script>

<template>
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
        <div v-for="(statItem, index) in statItems" :key="index" class="card bg-base-100 card-border">
            <div class="card-body">
                <div class="flex justify-between gap-2 text-xs">
                    <p class="text-base-content/60 font-medium tracking-wide uppercase">
                        {{ statItem.title }}
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

                <div class="mt-2 flex items-end gap-2">
                    <p class="grow text-2xl/none font-semibold">{{ statItem.amount }}</p>
                    <div :ref="(el) => setChartRef(el as HTMLElement, index)" class="w-24" />
                </div>
            </div>
        </div>
    </div>
</template>
