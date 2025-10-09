<script lang="ts" setup>
import {
    type ColumnDef,
    type ColumnFiltersState,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
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

const columnFilters = ref<ColumnFiltersState>([]);

const table = useVueTable({
    data: data.value,
    columns: columns.value,
    state: {
        get columnFilters() {
            return columnFilters.value;
        },
    },
    onColumnFiltersChange: (updater) => {
        columnFilters.value = updater instanceof Function ? updater(columnFilters.value) : updater;
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
});

const clearFilters = () => {
    columnFilters.value = [];
};
</script>

<template>
    <div>
        <div class="border-base-200 border-b border-dashed p-5">
            <label class="input input-sm flex w-56 items-center gap-2">
                <span class="iconify lucide--search text-base-content/70 size-4.5" />
                <input
                    class="flex-grow text-base placeholder:text-sm"
                    type="search"
                    placeholder="Search by customer"
                    :value="table.getColumn('customerName')?.getFilterValue() ?? ''"
                    @input="
                        (event) =>
                            table.getColumn('customerName')?.setFilterValue((event.target as HTMLInputElement).value)
                    " />
            </label>
        </div>
        <div class="overflow-x-auto py-1">
            <table class="table">
                <thead>
                    <tr v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
                        <th v-for="header in headerGroup.headers" :key="header.id">
                            <template v-if="!header.isPlaceholder">
                                {{ flexRender(header.column.columnDef.header, header.getContext()) }}
                            </template>
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
                        <td
                            :colspan="columns.length"
                            class="text-base-content/60 h-32 text-center text-base font-medium">
                            <p class="text-sm text-gray-600">
                                No results found.
                                <span class="text-primary cursor-pointer hover:underline" @click="clearFilters"
                                    >Clear filters</span
                                >
                            </p>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
