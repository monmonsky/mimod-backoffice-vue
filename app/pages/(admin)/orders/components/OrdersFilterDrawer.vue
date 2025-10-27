<script setup lang="ts">
const props = defineProps<{
    selectedPaymentMethod: string;
    selectedCourier: string;
    dateFrom: string;
    dateTo: string;
    minTotal: string;
    maxTotal: string;
}>();

const emit = defineEmits<{
    'update:selectedPaymentMethod': [value: string];
    'update:selectedCourier': [value: string];
    'update:dateFrom': [value: string];
    'update:dateTo': [value: string];
    'update:minTotal': [value: string];
    'update:maxTotal': [value: string];
    'clear': [];
}>();

// Refs for date inputs
const dateFromInput = ref<HTMLInputElement | null>(null);
const dateToInput = ref<HTMLInputElement | null>(null);

// Quick date filters
const setDateRange = (range: string) => {
    const today = new Date();
    const formatDate = (date: Date) => date.toISOString().split('T')[0];

    let from = '';
    let to = '';

    switch (range) {
        case 'today':
            from = formatDate(today);
            to = formatDate(today);
            break;
        case 'yesterday':
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            from = formatDate(yesterday);
            to = formatDate(yesterday);
            break;
        case 'this-week':
            const weekStart = new Date(today);
            weekStart.setDate(today.getDate() - today.getDay());
            from = formatDate(weekStart);
            to = formatDate(today);
            break;
        case 'this-month':
            const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
            from = formatDate(monthStart);
            to = formatDate(today);
            break;
        case 'last-month':
            const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
            const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
            from = formatDate(lastMonthStart);
            to = formatDate(lastMonthEnd);
            break;
        case 'last-3-months':
            const threeMonthsAgo = new Date(today);
            threeMonthsAgo.setMonth(today.getMonth() - 3);
            from = formatDate(threeMonthsAgo);
            to = formatDate(today);
            break;
        case 'last-6-months':
            const sixMonthsAgo = new Date(today);
            sixMonthsAgo.setMonth(today.getMonth() - 6);
            from = formatDate(sixMonthsAgo);
            to = formatDate(today);
            break;
        case 'this-year':
            const yearStart = new Date(today.getFullYear(), 0, 1);
            from = formatDate(yearStart);
            to = formatDate(today);
            break;
    }

    emit('update:dateFrom', from);
    emit('update:dateTo', to);

    // Auto-open date picker after setting values
    nextTick(() => {
        dateFromInput.value?.showPicker?.();
    });
};

// Check if a date range is active
const isDateRangeActive = (range: string) => {
    if (!props.dateFrom || !props.dateTo) return false;

    const today = new Date();
    const formatDate = (date: Date) => date.toISOString().split('T')[0];

    switch (range) {
        case 'today':
            return props.dateFrom === formatDate(today) && props.dateTo === formatDate(today);
        case 'yesterday':
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            return props.dateFrom === formatDate(yesterday) && props.dateTo === formatDate(yesterday);
        default:
            return false;
    }
};
</script>

<template>
    <div class="drawer drawer-end">
        <input id="orders-filter-drawer" type="checkbox" class="drawer-toggle" />
        <div class="drawer-side z-50">
            <label for="orders-filter-drawer" aria-label="close sidebar" class="drawer-overlay" />
            <div class="bg-base-100 text-base-content h-full w-80 sm:w-96 flex flex-col">
                <!-- Drawer Header -->
                <div class="bg-base-200 flex justify-between px-5 py-4">
                    <p class="text-lg font-medium">Filters</p>
                    <label
                        for="orders-filter-drawer"
                        aria-label="close sidebar"
                        class="btn btn-ghost btn-sm btn-circle">
                        <span class="iconify lucide--x size-5" />
                    </label>
                </div>

                <!-- Drawer Content (Scrollable) -->
                <div class="flex-1 overflow-y-auto p-5 space-y-6">
                    <!-- Payment Method -->
                    <div>
                        <p class="font-medium mb-3">Payment Method</p>
                        <select
                            :value="selectedPaymentMethod"
                            @input="emit('update:selectedPaymentMethod', ($event.target as HTMLSelectElement).value)"
                            class="select select-bordered w-full">
                            <option value="all">All Methods</option>
                            <option value="bank_transfer">Bank Transfer</option>
                            <option value="midtrans">Midtrans</option>
                        </select>
                    </div>

                    <!-- Courier -->
                    <div>
                        <p class="font-medium mb-3">Courier</p>
                        <select
                            :value="selectedCourier"
                            @input="emit('update:selectedCourier', ($event.target as HTMLSelectElement).value)"
                            class="select select-bordered w-full">
                            <option value="all">All Couriers</option>
                            <option value="JNE">JNE</option>
                            <option value="J&T">J&T</option>
                            <option value="SiCepat">SiCepat</option>
                            <option value="AnterAja">AnterAja</option>
                        </select>
                    </div>

                    <!-- Date Range -->
                    <div>
                        <p class="font-medium mb-3">Date</p>
                        <!-- Quick Date Buttons -->
                        <div class="grid grid-cols-2 gap-2 mb-3">
                            <button
                                @click="setDateRange('today')"
                                :class="[
                                    'btn btn-sm',
                                    isDateRangeActive('today') ? 'btn-primary' : 'btn-outline',
                                ]">
                                Today
                            </button>
                            <button
                                @click="setDateRange('yesterday')"
                                :class="[
                                    'btn btn-sm',
                                    isDateRangeActive('yesterday') ? 'btn-primary' : 'btn-outline',
                                ]">
                                Yesterday
                            </button>
                            <button
                                @click="setDateRange('this-week')"
                                class="btn btn-sm btn-outline">
                                This Week
                            </button>
                            <button
                                @click="setDateRange('this-month')"
                                class="btn btn-sm btn-outline">
                                This Month
                            </button>
                            <button
                                @click="setDateRange('last-month')"
                                class="btn btn-sm btn-outline">
                                Last Month
                            </button>
                            <button
                                @click="setDateRange('last-3-months')"
                                class="btn btn-sm btn-outline">
                                Last 3 Months
                            </button>
                            <button
                                @click="setDateRange('last-6-months')"
                                class="btn btn-sm btn-outline">
                                Last 6 Months
                            </button>
                            <button
                                @click="setDateRange('this-year')"
                                class="btn btn-sm btn-outline">
                                This Year
                            </button>
                        </div>

                        <!-- Custom Date Inputs -->
                        <div class="grid grid-cols-2 gap-2">
                            <div class="form-control">
                                <label class="input input-bordered input-sm flex items-center gap-2">
                                    <input
                                        ref="dateFromInput"
                                        :value="dateFrom"
                                        @input="emit('update:dateFrom', ($event.target as HTMLInputElement).value)"
                                        type="date"
                                        class="grow"
                                        placeholder="Date" />
                                    <span class="iconify lucide--calendar size-4 text-base-content/60" />
                                </label>
                            </div>
                            <div class="form-control">
                                <label class="input input-bordered input-sm flex items-center gap-2">
                                    <input
                                        ref="dateToInput"
                                        :value="dateTo"
                                        @input="emit('update:dateTo', ($event.target as HTMLInputElement).value)"
                                        type="date"
                                        class="grow"
                                        placeholder="Date" />
                                    <span class="iconify lucide--calendar size-4 text-base-content/60" />
                                </label>
                            </div>
                        </div>
                    </div>

                    <!-- Total Range -->
                    <div>
                        <p class="font-medium mb-3">Total Amount Range</p>
                        <div class="space-y-3">
                            <div class="form-control">
                                <label class="label py-1">
                                    <span class="label-text text-sm">Minimum</span>
                                </label>
                                <input
                                    :value="minTotal"
                                    @input="emit('update:minTotal', ($event.target as HTMLInputElement).value)"
                                    type="number"
                                    placeholder="e.g. 100000"
                                    class="input input-bordered" />
                            </div>
                            <div class="form-control">
                                <label class="label py-1">
                                    <span class="label-text text-sm">Maximum</span>
                                </label>
                                <input
                                    :value="maxTotal"
                                    @input="emit('update:maxTotal', ($event.target as HTMLInputElement).value)"
                                    type="number"
                                    placeholder="e.g. 5000000"
                                    class="input input-bordered" />
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Drawer Footer -->
                <div class="sticky bottom-0 bg-base-100 border-t border-base-300 p-5">
                    <div class="flex gap-3">
                        <button @click="emit('clear')" class="btn btn-outline flex-1">
                            <span class="iconify lucide--rotate-ccw size-4" />
                            Reset
                        </button>
                        <label for="orders-filter-drawer" class="btn btn-primary flex-1">
                            <span class="iconify lucide--filter size-4" />
                            Apply
                        </label>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
