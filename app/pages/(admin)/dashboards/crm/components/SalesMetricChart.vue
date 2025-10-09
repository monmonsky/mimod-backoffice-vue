<script setup lang="ts">
import type { ApexOptions } from "apexcharts";

const chartOptions: ApexOptions = {
    chart: {
        height: 323,
        type: "bar",
        background: "transparent",
        toolbar: {
            show: false,
        },
    },
    plotOptions: {
        bar: {
            borderRadius: 2,
            columnWidth: "50%",
            barHeight: "100%",
        },
    },
    stroke: {
        show: true,
        width: 2,
        colors: ["transparent"],
    },
    dataLabels: {
        enabled: false,
    },
    colors: ["#ff8b4b", "#6c74f8"],
    legend: {
        show: true,
        horizontalAlign: "center",
        offsetY: 6,
    },
    series: [
        {
            name: "Customer",
            data: [1175, 1734, 2239, 2741, 1823, 2154, 1013, 2794, 1834, 3273],
        },
        {
            name: "Acquisition",
            data: [1803, 2175, 2882, 2486, 3755, 1888, 3154, 4345, 2683, 2891],
        },
    ],
    xaxis: {
        categories: [
            new Date("1/1/2016"),
            new Date("1/1/2017"),
            new Date("1/1/2018"),
            new Date("1/1/2019"),
            new Date("1/1/2020"),
            new Date("1/1/2021"),
            new Date("1/1/2022"),
            new Date("1/1/2023"),
            new Date("1/1/2024"),
            new Date("1/1/2025"),
        ],
        axisBorder: {
            show: false,
        },
        axisTicks: {
            show: false,
        },
        labels: {
            formatter: (val) => {
                return new Date(val).getFullYear().toString();
            },
        },
    },
    yaxis: {
        axisBorder: {
            show: false,
        },
        axisTicks: {
            show: false,
        },
        labels: {
            formatter: function (val, e) {
                if (e && e.seriesIndex == 1) {
                    return `${val}K`;
                }
                return val.toString();
            },
        },
    },

    tooltip: {
        enabled: true,
        shared: true,
        intersect: false,
    },
    grid: {
        show: false,
    },
    responsive: [
        {
            breakpoint: 450,
            options: {
                plotOptions: {
                    bar: {
                        borderRadius: 2,
                    },
                },
                xaxis: {
                    tickAmount: 3,
                },
            },
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
