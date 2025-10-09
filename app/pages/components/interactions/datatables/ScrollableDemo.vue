<script lang="ts" setup>
import { type ColumnDef, getCoreRowModel, useVueTable } from "@tanstack/vue-table";
import { ref } from "vue";

import RenderCell from "./RenderCell.vue";
import { type ITableData, flexRender } from "./helper";
import { getTableData } from "./helper";

const columns = ref<ColumnDef<ITableData>[]>([
    {
        accessorKey: "id",
        header: "ID",
    },
    {
        accessorKey: "customerName",
        header: "Customer",
    },
    {
        accessorKey: "status",
        header: "Status",
    },
    {
        accessorKey: "amount",
        header: "Amount",
    },
    {
        accessorKey: "dateTime",
        header: "Order At",
    },
]);

const data = ref(getTableData().slice(0, 25));

const table = useVueTable({
    data: data.value,
    columns: columns.value,
    getCoreRowModel: getCoreRowModel(),
});
</script>

<template>
    <div class="mt-1 h-100 overflow-auto pb-1">
        <table class="isolate table">
            <thead class="bg-base-100 sticky top-0 z-1">
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
</template>
