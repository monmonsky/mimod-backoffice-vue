<script setup lang="ts">
import type { ApexOptions } from "apexcharts";

const data = [
    {
        y: 488,
        goals: {
            name: "Predicted Sales",
            value: 680,
            strokeDashArray: 2,
        },
    },
    {
        y: 680,
        goals: {
            name: "Predicted Sales",
            value: 710,
            strokeDashArray: 2,
        },
    },
    {
        y: 722,
        goals: {
            name: "Predicted Sales",
            value: 680,
        },
    },
    {
        y: 539,
        goals: {
            name: "Predicted Sales",
            value: 594,
            strokeDashArray: 2,
        },
    },
    {
        y: 461,
        goals: {
            name: "Predicted Sales",
            value: 397,
        },
    },
    {
        y: 322,
        goals: {
            name: "Predicted Sales",
            value: 300,
        },
    },
];
const currentYear = new Date().getFullYear();
const seriesWithGoals = data.map((data, index) => ({
    ...data,
    x: (currentYear - index).toString(),
    goals: [{ ...data.goals, strokeWidth: 6, strokeColor: "#EB6440" }],
}));

const chartOptions: ApexOptions = {
    xaxis: {
        type: "numeric",
        title: { text: "(Million USD)", style: { fontWeight: "500" } },
        labels: {
            formatter: (value) => value + "M",
        },
    },
    tooltip: {
        y: {
            formatter: (value) => value + "M",
        },
    },
    grid: {
        show: false,
    },
    chart: {
        type: "bar",
        height: 380,
        toolbar: {
            show: true,
        },
        background: "transparent",
    },
    colors: ["#167bff"],
    fill: {
        type: "solid",
    },
    legend: {
        show: true,
        showForSingleSeries: true,
    },
    plotOptions: {
        bar: {
            horizontal: true,
            barHeight: 28,
        },
    },
    series: [
        {
            name: "Total Sales",
            data: seriesWithGoals,
        },
    ],
};

const chartRef = ref<HTMLDivElement | null>(null);
onMounted(async () => {
    const ApexCharts = (await import("apexcharts")).default;
    if (chartRef.value) {
        new ApexCharts(chartRef.value, chartOptions).render();
    }
});
</script>

<template>
    <div ref="chartRef" />
</template>
