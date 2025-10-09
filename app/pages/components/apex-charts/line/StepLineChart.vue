<script setup lang="ts">
import type { ApexOptions } from "apexcharts";

const chartOptions: ApexOptions = {
    chart: {
        type: "line",
        height: 380,
        toolbar: {
            show: true,
            tools: {
                download: true,
                zoom: false,
                zoomin: false,
                zoomout: false,
                pan: false,
                reset: false,
            },
        },
        background: "transparent",
    },
    xaxis: {
        categories: ["Jul-2", "Aug-1", "Aug-2", "Sep-1", "Sep-2", "Oct-1", "Oct-2", "Nov-1", "Nov-2", "Dec-1"],
        title: {
            text: "Customer Support Ticket Volume",
            style: { fontWeight: "500" },
        },
    },
    tooltip: {
        y: {
            formatter: (val) => val + " Tickets",
        },
    },
    stroke: {
        curve: "stepline",
        width: 2,
    },
    colors: ["#167bff"],
    series: [
        {
            name: "Volume",
            data: [144, 154, 121, 112, 143, 233, 223, 166, 166, 158],
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
