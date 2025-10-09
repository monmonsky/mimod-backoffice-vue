<script setup lang="ts">
import CustomerDealTableRow, { type ICustomerDealTableRow } from "./CustomerDealTableRow.vue";

const customerDealItems: ICustomerDealTableRow[] = [
    {
        image: "/images/avatars/1.png",
        name: "John Doe",
        date: "16 Dec",
        status: "completed",
        value: "50,000",
    },
    {
        image: "/images/avatars/2.png",
        name: "Jane Smith",
        date: "21 June",
        status: "pending",
        value: "12,240",
    },
    {
        image: "/images/avatars/3.png",
        name: "Rahul Kumar",
        date: "15 Aug",
        status: "completed",
        value: "87,452",
    },
    {
        image: "/images/avatars/4.png",
        name: "Emily Davis",
        date: "17 Nov",
        status: "completed",
        value: "65,357",
    },
    {
        image: "/images/avatars/5.png",
        name: "Akash Singh",
        date: "30 Jan",
        status: "canceled",
        value: "35,769",
    },
];
</script>
<template>
    <div aria-label="Card" class="card bg-base-100 shadow">
        <div class="card-body p-0">
            <div class="flex items-center justify-between gap-2 px-5 pt-5">
                <span class="iconify lucide--handshake text-base-content/80 size-4.5" />
                <span class="grow font-medium">Customer Deals</span>
                <button class="btn btn-outline border-base-300 btn-sm">
                    <span class="iconify lucide--plus size-3.5" />
                    Make a Deal
                </button>
            </div>
            <div class="mt-1 overflow-auto">
                <table class="table *:text-nowrap">
                    <thead>
                        <tr>
                            <th>Customer</th>
                            <th>Value</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <CustomerDealTableRow
                            v-for="(deal, index) in customerDealItems"
                            :key="index"
                            :image="deal.image"
                            :name="deal.name"
                            :date="deal.date"
                            :status="deal.status"
                            :value="deal.value" />
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
