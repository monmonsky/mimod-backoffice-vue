<script setup lang="ts">
import OrderTableRow from "./OrderTableRow.vue";
import { ordersData } from "./data";
</script>
<template>
    <div class="card bg-base-100 mt-5 shadow">
        <div class="card-body p-0">
            <div class="flex items-center justify-between px-5 pt-5">
                <div class="inline-flex items-center gap-3">
                    <label class="input input-sm">
                        <span class="iconify lucide--search text-base-content/80 size-3.5" />
                        <input
                            type="search"
                            class="w-24 sm:w-36"
                            placeholder="Search along orders"
                            aria-label="Search orders" />
                    </label>
                    <div class="hidden sm:block">
                        <select class="select select-sm w-36" aria-label="Category">
                            <option value="" selected disabled>Select Category</option>
                            <option>Fashion</option>
                            <option>Daily Need</option>
                            <option>Cosmetic</option>
                            <option>Electronics</option>
                            <option>Food</option>
                        </select>
                    </div>
                </div>
                <NuxtLink to="/dashboards/ecommerce" class="btn btn-sm btn-primary">
                    <span class="iconify lucide--monitor-dot size-4" />
                    <span class="hidden sm:inline">Dashboard</span>
                </NuxtLink>
            </div>
            <div class="mt-4 overflow-auto">
                <table class="table">
                    <thead>
                        <tr>
                            <th class="px-6">
                                <input aria-label="Check all" type="checkbox" class="checkbox checkbox-sm" />
                            </th>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Customer</th>
                            <th>Price</th>
                            <th>Payment</th>
                            <th>Status</th>
                            <th>Ordered At</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <OrderTableRow v-for="(order, index) in ordersData" :key="index" v-bind="order" />
                    </tbody>
                </table>
            </div>
            <div class="flex items-center justify-between p-6">
                <div class="text-base-content/80 hover:text-base-content flex gap-2 text-sm">
                    <span class="hidden sm:inline">Per page</span>
                    <select class="select select-xs w-18" aria-label="Per page">
                        <option value="10">10</option>
                        <option value="20" selected>20</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                    </select>
                </div>
                <span class="text-base-content/80 hidden text-sm lg:inline">
                    Showing <span class="text-base-content font-medium">1 to 20</span> of 457 items
                </span>
                <div class="inline-flex items-center gap-1">
                    <button class="btn btn-circle sm:btn-sm btn-xs btn-ghost" aria-label="Prev">
                        <span class="iconify lucide--chevron-left" />
                    </button>
                    <button class="btn btn-primary btn-circle sm:btn-sm btn-xs">1</button>
                    <button class="btn btn-ghost btn-circle sm:btn-sm btn-xs">2</button>
                    <button class="btn btn-ghost btn-circle sm:btn-sm btn-xs">3</button>
                    <button class="btn btn-circle sm:btn-sm btn-xs btn-ghost" aria-label="Next">
                        <span class="iconify lucide--chevron-right" />
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
