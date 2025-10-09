<script lang="ts" setup>
import {
    type ColumnDef,
    type VisibilityState,
    getCoreRowModel,
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

const columnVisibility = ref<VisibilityState>({});

const table = useVueTable({
    data: data.value,
    columns: columns.value,
    state: {
        get columnVisibility() {
            return columnVisibility.value;
        },
    },
    onColumnVisibilityChange: (updater) => {
        columnVisibility.value = updater instanceof Function ? updater(columnVisibility.value) : updater;
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
});
</script>

<template>
    <div>
        <div class="border-base-200 flex justify-end border-b border-dashed p-5">
            <div class="dropdown dropdown-bottom dropdown-end">
                <div tabindex="0" role="button" class="btn btn-outline btn-sm border-base-300">
                    <span class="iconify lucide--columns-3-cog size-4" />
                    Columns
                </div>
                <div tabindex="0" class="dropdown-content bg-base-100 rounded-box w-44 shadow">
                    <ul class="menu w-full">
                        <li
                            v-for="column in table.getAllLeafColumns()"
                            :key="column.id"
                            @click="column.toggleVisibility()">
                            <div :data-visible="column.getIsVisible() ? true : undefined" class="group gap-2.5">
                                <span
                                    class="iconify lucide--check size-4 scale-50 opacity-0 transition-all duration-300 group-data-visible:scale-100 group-data-visible:opacity-100" />
                                <span class="font-medium">{{ column.columnDef.header as string }}</span>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
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
                        <td :colspan="columns.length" class="h-24 text-center">No results.</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
