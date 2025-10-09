<script lang="ts" setup>
import type { Cell } from "@tanstack/vue-table";

import { type ITableData, flexRender } from "./helper";

interface RenderCellProps {
    cell: Cell<ITableData, unknown>;
}

const props = defineProps<RenderCellProps>();

const { cell } = props;
const { avatar, status, customerName, id, dateTime, amount, email } = cell.row.original;

const formattedDate = new Date(dateTime).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "2-digit",
});
const formattedTime = new Date(dateTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
</script>

<template>
    <template v-if="cell.column.id === 'id'">
        <span class="text-base-content/70 font-mono text-xs uppercase">#{{ id }}</span>
    </template>

    <template v-else-if="cell.column.id === 'customerName'">
        <div class="flex items-center gap-2">
            <div class="avatar">
                <div class="mask bg-base-200 mask-squircle h-9 w-9 px-0.5 pt-0.5">
                    <img :src="avatar" alt="Avatar" />
                </div>
            </div>
            <div>
                <p class="leading-none font-medium">{{ customerName }}</p>
                <p class="text-base-content/70 mt-0.5 text-xs/none">{{ email }}</p>
            </div>
        </div>
    </template>

    <template v-else-if="cell.column.id === 'status'">
        <div v-if="status === 'success'" class="badge badge-success badge-sm badge-soft">Success</div>
        <div v-else-if="status === 'processing'" class="badge badge-sm badge-info badge-soft">Processing</div>
        <div v-else-if="status === 'failed'" class="badge badge-error badge-sm badge-soft">Failed</div>
        <div v-else class="badge badge-sm badge-ghost">Pending</div>
    </template>

    <template v-else-if="cell.column.id === 'dateTime'">
        <p class="space-x-1 whitespace-nowrap">
            <span>{{ formattedDate }}</span>
            <span class="text-base-content/60 text-xs">{{ formattedTime }}</span>
        </p>
    </template>

    <template v-else-if="cell.column.id === 'amount'">
        <span class="text-base font-medium">${{ amount }}</span>
    </template>

    <template v-else>
        {{ flexRender(cell.column.columnDef.cell, cell.getContext()) }}
    </template>
</template>
