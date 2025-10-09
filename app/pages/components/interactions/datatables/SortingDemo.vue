<script lang="ts" setup>
import {
    type ColumnDef,
    type SortingState,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useVueTable,
} from "@tanstack/vue-table";
import { ref } from "vue";

import RenderCell from "./RenderCell.vue";
import { type ITableData, flexRender } from "./helper";
import { getTableData } from "./helper";

const columns = ref<ColumnDef<ITableData>[]>([
    { accessorKey: "id", header: "ID" },
    { accessorKey: "customerName", header: "Customer" },
    { accessorKey: "status", header: "Status" },
    { accessorKey: "amount", header: "Amount" },
    { accessorKey: "dateTime", header: "Order At" },
]);

const data = ref(getTableData().slice(0, 5));

const sorting = ref<SortingState>([]);

const table = useVueTable({
    data: data.value,
    columns: columns.value,
    state: {
        get sorting() {
            return sorting.value;
        },
    },
    onSortingChange: (updater) => {
        sorting.value = updater instanceof Function ? updater(sorting.value) : updater;
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
});
</script>

<template>
    <div class="overflow-x-auto">
        <table class="table">
            <thead>
                <tr v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
                    <th v-for="header in headerGroup.headers" :key="header.id">
                        <div
                            class="group flex cursor-pointer items-center justify-between"
                            :data-sorting="header.column.getIsSorted()"
                            @click="header.column.toggleSorting(header.column.getIsSorted() === 'asc')">
                            <template v-if="!header.isPlaceholder">
                                {{ flexRender(header.column.columnDef.header, header.getContext()) }}
                            </template>
                            <div class="flex flex-col items-center justify-center -space-y-1.5">
                                <span
                                    class="iconify lucide--chevron-up text-base-content size-3.5 opacity-40 group-data-[sorting=asc]:opacity-100" />
                                <span
                                    class="iconify lucide--chevron-down text-base-content size-3.5 opacity-40 group-data-[sorting=desc]:opacity-100" />
                            </div>
                        </div>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr
                    v-for="row in table.getRowModel().rows"
                    v-if="table.getRowModel().rows?.length"
                    :key="row.id"
                    :data-state="row.getIsSelected() ? 'selected' : null">
                    <td v-for="cell in row.getVisibleCells()" :key="cell.id">
                        <RenderCell :cell="cell" />
                    </td>
                </tr>
                <tr v-else>
                    <td :colspan="columns.length" class="h-24 text-center">No results.</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
