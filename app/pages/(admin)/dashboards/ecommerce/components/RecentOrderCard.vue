<script setup lang="ts">
import RecentOrderTableRow, { type IRecentOrderTableRow } from "./RecentOrderTableRow.vue";

const recentOrders: IRecentOrderTableRow[] = [
    {
        image: "/images/apps/ecommerce/products/1.jpg",
        name: "Men's tracking shoes",
        price: 99,
        date: "25 Jun 2024",
        status: "delivered",
    },
    {
        image: "/images/apps/ecommerce/products/2.jpg",
        name: "Cocooil body oil",
        price: 75,
        date: "22 Jun 2024",
        status: "on_going",
    },
    {
        image: "/images/apps/ecommerce/products/3.jpg",
        name: "Freeze Air",
        price: 47,
        date: "17 Jun 2024",
        status: "confirmed",
    },
    {
        image: "/images/apps/ecommerce/products/4.jpg",
        name: "Ladies's shoes",
        price: 52,
        date: "23 Jun 2024",
        status: "canceled",
    },
    {
        image: "/images/apps/ecommerce/products/10.jpg",
        name: "Choco's cookie",
        price: 24,
        date: "21 Jun 2024",
        status: "waiting",
    },
];
</script>
<template>
    <div aria-label="Card" class="card bg-base-100 shadow">
        <div class="card-body p-0">
            <div class="flex items-center gap-3 px-5 pt-5">
                <span class="iconify lucide--shopping-bag size-4.5" />
                <span class="font-medium">Recent Orders</span>
                <button class="btn btn-outline border-base-300 btn-sm ms-auto">
                    <span class="iconify lucide--download size-3.5" />
                    Report
                </button>
            </div>
            <div class="mt-2 overflow-auto">
                <table class="table *:text-nowrap">
                    <thead>
                        <tr>
                            <th>
                                <input aria-label="checked-all-order" type="checkbox" class="checkbox checkbox-sm" />
                            </th>
                            <th>Product</th>
                            <th>Price</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <RecentOrderTableRow
                            v-for="(recentOrder, index) in recentOrders"
                            :key="index"
                            v-bind="recentOrder" />
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
