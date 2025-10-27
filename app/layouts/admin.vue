<script setup lang="ts">
import Footer from "~/components/admin-layout/Footer.vue";
import Rightbar from "~/components/admin-layout/Rightbar.vue";
import Sidebar from "~/components/admin-layout/Sidebar.vue";
import Topbar from "~/components/admin-layout/Topbar.vue";

import type { ISidebarMenuItem } from "~/components/admin-layout/SidebarMenuItem.vue";

// Use order counts store
const orderCountsStore = useOrderCountsStore();

// Use menu access composable
const { finalAccessibleMenu } = useMenuAccess();

// Fetch order counts on mount
onMounted(() => {
    orderCountsStore.fetchOrderCounts();

    // Refresh counts every 2 minutes
    const interval = setInterval(() => {
        orderCountsStore.fetchOrderCounts();
    }, 120000); // 2 minutes

    onUnmounted(() => {
        clearInterval(interval);
    });
});

// Add badges to menu items based on order counts
const menuItemsWithBadges = computed<ISidebarMenuItem[]>(() => {
    return finalAccessibleMenu.value.map((item) => {
        // Add badge to "Action Required" parent menu
        if (item.id === "orders-action-required") {
            const total = orderCountsStore.counts.actionRequired;
            return {
                ...item,
                badges: total > 0 ? [total.toString()] : undefined,
                children: item.children?.map((child) => {
                    // Add badges to child items
                    if (child.id === "orders-unpaid") {
                        const count = orderCountsStore.counts.unpaid;
                        return { ...child, badges: count > 0 ? [count.toString()] : undefined };
                    }
                    if (child.id === "orders-ready-to-ship") {
                        const count = orderCountsStore.counts.readyToShip;
                        return { ...child, badges: count > 0 ? [count.toString()] : undefined };
                    }
                    return child;
                }),
            };
        }

        // Add badge to "Shipped Orders" in Order History
        if (item.id === "orders-history") {
            return {
                ...item,
                children: item.children?.map((child) => {
                    if (child.id === "orders-shipped") {
                        const count = orderCountsStore.counts.shipped;
                        return { ...child, badges: count > 0 ? [count.toString()] : undefined };
                    }
                    return child;
                }),
            };
        }

        return item;
    });
});
</script>

<template>
    <div class="size-full">
        <div class="flex">
            <Sidebar :menu-items="menuItemsWithBadges" />
            <div class="flex h-screen min-w-0 grow flex-col overflow-auto">
                <Topbar />
                <div id="layout-content">
                    <slot />
                </div>
                <Footer />
            </div>
        </div>
        <Rightbar />
    </div>
</template>
