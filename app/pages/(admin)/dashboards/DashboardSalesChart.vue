<script setup lang="ts">
// Dashboard Sales Chart Component
const selectedPeriod = ref<"week" | "month" | "year">("week");
const { getSalesChart } = useDashboard();

const { data: response, pending } = await getSalesChart(selectedPeriod.value);

const salesData = computed(() => (response.value as any)?.data || null);

const formatCurrency = (value: number | string) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(Number(value));
};

// Calculate max value for chart scaling
const maxValue = computed(() => {
    if (!salesData.value?.chart_data || !Array.isArray(salesData.value.chart_data)) return 0;
    const values = salesData.value.chart_data.map((item: any) => Number(item.sales || 0));
    return Math.max(...values, 0);
});

// Calculate total sales from chart data
const totalSales = computed(() => {
    if (!salesData.value?.chart_data || !Array.isArray(salesData.value.chart_data)) return 0;
    return salesData.value.chart_data.reduce((sum: number, item: any) => sum + Number(item.sales || 0), 0);
});

// Calculate total orders from chart data
const totalOrders = computed(() => {
    if (!salesData.value?.chart_data || !Array.isArray(salesData.value.chart_data)) return 0;
    return salesData.value.chart_data.reduce((sum: number, item: any) => sum + Number(item.orders || 0), 0);
});

// Calculate bar height percentage
const getBarHeight = (value: number) => {
    if (maxValue.value === 0) return 0;
    return (value / maxValue.value) * 100;
};

const changePeriod = async (period: "week" | "month" | "year") => {
    selectedPeriod.value = period;
    const { data } = await getSalesChart(period);
    response.value = data.value;
};
</script>

<template>
    <div class="space-y-4">
        <!-- Period Selector -->
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
                <span class="iconify lucide--trending-up text-primary size-5" />
                <span class="text-sm font-medium">Sales Trend</span>
            </div>
            <div role="tablist" class="tabs tabs-boxed tabs-sm">
                <button
                    role="tab"
                    :class="['tab', selectedPeriod === 'week' ? 'tab-active' : '']"
                    @click="changePeriod('week')">
                    Week
                </button>
                <button
                    role="tab"
                    :class="['tab', selectedPeriod === 'month' ? 'tab-active' : '']"
                    @click="changePeriod('month')">
                    Month
                </button>
                <button
                    role="tab"
                    :class="['tab', selectedPeriod === 'year' ? 'tab-active' : '']"
                    @click="changePeriod('year')">
                    Year
                </button>
            </div>
        </div>

        <!-- Loading State -->
        <div v-if="pending" class="flex items-center justify-center py-12">
            <span class="loading loading-spinner loading-md"></span>
        </div>

        <!-- Empty State -->
        <div v-else-if="!salesData || !salesData.chart_data || salesData.chart_data.length === 0" class="flex flex-col items-center justify-center py-12">
            <span class="iconify lucide--bar-chart size-16 mb-3 text-base-content/40" />
            <p class="text-sm font-medium">No sales data</p>
            <p class="text-xs text-base-content/60 mt-1">Sales data will appear here once orders are placed</p>
        </div>

        <!-- Chart Content -->
        <div v-else class="space-y-4">
            <!-- Summary Stats -->
            <div class="grid grid-cols-2 gap-4">
                <div class="bg-base-200/50 rounded-lg p-3">
                    <p class="text-xs text-base-content/60">Total Sales</p>
                    <p class="text-lg font-bold mt-1">{{ formatCurrency(totalSales) }}</p>
                </div>
                <div class="bg-base-200/50 rounded-lg p-3">
                    <p class="text-xs text-base-content/60">Total Orders</p>
                    <p class="text-lg font-bold mt-1">{{ totalOrders }}</p>
                </div>
            </div>

            <!-- Bar Chart -->
            <div class="space-y-2">
                <div class="flex items-end gap-2 h-48">
                    <div
                        v-for="(item, index) in salesData.chart_data"
                        :key="index"
                        class="flex-1 flex flex-col items-center gap-2 group">
                        <!-- Bar -->
                        <div class="w-full flex flex-col justify-end h-full">
                            <div
                                class="bg-primary hover:bg-primary-focus w-full rounded-t-lg transition-all cursor-pointer relative group"
                                :style="{ height: `${getBarHeight(item.sales)}%` }">
                                <!-- Tooltip -->
                                <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                                    <div class="bg-base-300 text-base-content rounded-lg px-3 py-2 shadow-lg whitespace-nowrap">
                                        <p class="text-xs font-medium">{{ formatCurrency(item.sales) }}</p>
                                        <p class="text-xs text-base-content/60">{{ item.orders }} orders</p>
                                    </div>
                                    <div class="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
                                        <div class="border-4 border-transparent border-t-base-300"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- Label -->
                        <p class="text-xs text-base-content/60 text-center truncate w-full">
                            {{ item.label }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
