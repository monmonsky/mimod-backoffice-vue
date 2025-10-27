<script lang="ts" setup>
import { ref } from "vue";

const step = ref(1);
const orderCountsStore = useOrderCountsStore();

const closeMenu = () => {
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
};

// Get total notifications count
const totalNotifications = computed(() => {
    return orderCountsStore.counts.actionRequired;
});

// Check if there are any notifications
const hasNotifications = computed(() => totalNotifications.value > 0);
</script>

<template>
    <div class="dropdown dropdown-bottom sm:dropdown-end dropdown-center">
        <div tabindex="0" role="button" class="btn btn-circle btn-ghost btn-sm relative" aria-label="Notifications">
            <span class="iconify lucide--bell motion-preset-seesaw size-4.5" />
            <div v-if="hasNotifications" class="status status-error status-sm absolute end-1 top-1" />
        </div>
        <div
            tabindex="0"
            class="dropdown-content bg-base-100 rounded-box mt-1 w-84 shadow-md duration-1000 hover:shadow-lg">
            <div class="bg-base-200/30 rounded-t-box border-base-200 border-b ps-4 pe-2 pt-3">
                <div class="flex items-center justify-between">
                    <p class="font-medium">Notifications</p>
                    <button class="btn btn-xs btn-circle btn-ghost" aria-label="Close" @click="closeMenu">
                        <span class="iconify lucide--x size-4" />
                    </button>
                </div>
                <div class="-ms-2 mt-2 -mb-px flex items-center justify-between">
                    <div role="tablist" class="tabs tabs-sm tabs-border">
                        <div
                            role="tab"
                            :class="['tab gap-2 px-3', step === 1 ? 'tab-active font-medium' : '']"
                            @click="step = 1">
                            <span>Orders</span>
                            <div v-if="totalNotifications > 0" class="badge badge-sm badge-error">{{ totalNotifications }}</div>
                        </div>
                        <div
                            role="tab"
                            :class="['tab gap-2 px-3', step === 2 ? 'tab-active font-medium' : '']"
                            @click="step = 2">
                            <span>System</span>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Orders Tab Content -->
            <div v-if="step === 1">
                <!-- Unpaid Orders Notification -->
                <NuxtLink
                    v-if="orderCountsStore.counts.unpaid > 0"
                    to="/orders/unpaid"
                    class="hover:bg-base-200/20 relative flex items-start gap-3 p-4 transition-all"
                    @click="closeMenu">
                    <div class="bg-error/10 rounded-box flex size-12 items-center justify-center">
                        <span class="iconify lucide--credit-card text-error size-6" />
                    </div>

                    <div class="grow">
                        <p class="text-sm font-medium leading-tight">Unpaid Orders</p>
                        <p class="text-base-content/60 text-xs mt-0.5">
                            {{ orderCountsStore.counts.unpaid }} {{ orderCountsStore.counts.unpaid === 1 ? 'order' : 'orders' }} waiting for payment
                        </p>
                        <div class="mt-2">
                            <button class="btn btn-xs btn-error">
                                View Orders
                                <span class="iconify lucide--arrow-right size-3" />
                            </button>
                        </div>
                    </div>
                    <div class="status status-error absolute end-4 top-4 size-1.5" />
                </NuxtLink>

                <hr v-if="orderCountsStore.counts.unpaid > 0 && orderCountsStore.counts.readyToShip > 0" class="border-base-300 border-dashed" />

                <!-- Ready to Ship Notification -->
                <NuxtLink
                    v-if="orderCountsStore.counts.readyToShip > 0"
                    to="/orders/ready-to-ship"
                    class="hover:bg-base-200/20 relative flex items-start gap-3 p-4 transition-all"
                    @click="closeMenu">
                    <div class="bg-warning/10 rounded-box flex size-12 items-center justify-center">
                        <span class="iconify lucide--package text-warning size-6" />
                    </div>

                    <div class="grow">
                        <p class="text-sm font-medium leading-tight">Ready to Ship</p>
                        <p class="text-base-content/60 text-xs mt-0.5">
                            {{ orderCountsStore.counts.readyToShip }} {{ orderCountsStore.counts.readyToShip === 1 ? 'order' : 'orders' }} ready for shipping
                        </p>
                        <div class="mt-2">
                            <button class="btn btn-xs btn-warning">
                                Process Orders
                                <span class="iconify lucide--arrow-right size-3" />
                            </button>
                        </div>
                    </div>
                    <div class="status status-warning absolute end-4 top-4 size-1.5" />
                </NuxtLink>

                <!-- No notifications -->
                <div v-if="!hasNotifications" class="flex flex-col items-center justify-center py-12 px-4">
                    <span class="iconify lucide--check-circle text-success size-16 mb-3" />
                    <p class="text-sm font-medium">All caught up!</p>
                    <p class="text-base-content/60 text-xs mt-1">No pending orders at the moment</p>
                </div>
            </div>

            <!-- System Tab Content -->
            <div v-if="step === 2">
                <div class="flex flex-col items-center justify-center py-12 px-4">
                    <span class="iconify lucide--bell-off size-16 mb-3 text-base-content/40" />
                    <p class="text-sm font-medium">No system notifications</p>
                    <p class="text-base-content/60 text-xs mt-1">You're all set</p>
                </div>
            </div>
            <hr v-if="step === 1 && hasNotifications" class="border-base-200" />
            <div v-if="step === 1 && hasNotifications" class="flex items-center justify-between px-2 py-2">
                <NuxtLink to="/orders" class="btn btn-sm btn-soft btn-primary" @click="closeMenu">
                    View All Orders
                </NuxtLink>

                <div class="flex items-center gap-1">
                    <button class="btn btn-sm btn-square btn-ghost" title="Refresh">
                        <span class="iconify lucide--refresh-cw size-4" @click="orderCountsStore.fetchOrderCounts()" />
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
