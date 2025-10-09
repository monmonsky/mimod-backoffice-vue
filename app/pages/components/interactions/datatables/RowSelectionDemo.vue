<script lang="ts" setup>
import { type ColumnDef, getCoreRowModel, getPaginationRowModel, useVueTable } from "@tanstack/vue-table";
import { computed, ref } from "vue";

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

const rowSelection = ref<Record<string, boolean>>({});

const table = useVueTable({
    data: data.value,
    columns: columns.value,
    state: {
        get rowSelection() {
            return rowSelection.value;
        },
    },
    onRowSelectionChange: (updater) => {
        rowSelection.value = updater instanceof Function ? updater(rowSelection.value) : updater;
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
});

const selectedCount = computed(() => table.getSelectedRowModel().rows.length);
const totalCount = computed(() => table.getFilteredRowModel().rows.length);

const selectAllRef = ref<HTMLInputElement | null>(null);

watchEffect(() => {
    if (selectAllRef.value) {
        const checkbox = Array.isArray(selectAllRef.value) ? selectAllRef.value[0] : selectAllRef.value;

        if (checkbox) {
            checkbox.indeterminate = table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected();
        }
    }
});
</script>

<template>
    <div>
        <div class="border-base-200 border-b border-dashed p-5">
            <div class="text-base-content/70 text-center text-sm">
                <template v-if="selectedCount > 0">
                    <p>
                        <span class="text-base-content font-medium">{{ selectedCount }}</span> row
                        {{ selectedCount > 1 ? "s" : "" }} selected out of
                        <span class="text-base-content font-medium">{{ totalCount }}</span>
                    </p>
                </template>
                <template v-else>
                    <span class="font-medium">Select a row</span>
                </template>
            </div>
        </div>
        <div class="overflow-x-auto py-1">
            <table class="table">
                <thead>
                    <tr v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
                        <th>
                            <input
                                ref="selectAllRef"
                                aria-label="Select all"
                                type="checkbox"
                                :checked="table.getIsAllPageRowsSelected()"
                                class="checkbox checkbox-sm"
                                @change="() => table.toggleAllPageRowsSelected()" />
                        </th>
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
                        <td>
                            <input
                                aria-label="Select row"
                                type="checkbox"
                                :checked="row.getIsSelected()"
                                class="checkbox checkbox-sm"
                                @change="() => row.toggleSelected()" />
                        </td>
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
