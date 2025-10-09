<script lang="ts" setup>
import { type ColumnDef, getCoreRowModel, getPaginationRowModel, useVueTable } from "@tanstack/vue-table";
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
    { accessorKey: "actions", header: "Actions" },
]);

const data = ref(getTableData().slice(0, 5));

const table = useVueTable({
    data: data.value,
    columns: columns.value,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
});

const viewRow = (id: string) => {
    alert(`View #${id}`);
};

const deleteRow = (id: string) => {
    alert(`Delete #${id}`);
};
</script>

<template>
    <div class="overflow-x-auto">
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
                        <template v-if="cell.column.id === 'actions'">
                            <div class="flex items-center gap-1.5">
                                <button
                                    class="btn btn-soft btn-xs btn-square"
                                    aria-label="Show"
                                    @click="() => viewRow(cell.row.original.id)">
                                    <span class="iconify lucide--eye size-3.5" />
                                </button>
                                <button
                                    class="btn btn-soft btn-error btn-xs btn-square"
                                    aria-label="Delete"
                                    @click="() => deleteRow(cell.row.original.id)">
                                    <span class="iconify lucide--trash-2 size-3.5" />
                                </button>
                            </div>
                        </template>
                        <template v-else>
                            <RenderCell :cell="cell" />
                        </template>
                    </td>
                </tr>
                <tr v-else>
                    <td :colspan="columns.length" class="h-24 text-center">No results.</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
