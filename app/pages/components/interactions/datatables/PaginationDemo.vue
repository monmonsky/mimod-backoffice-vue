<script lang="ts" setup>
import {
    type ColumnDef,
    type PaginationState,
    getCoreRowModel,
    getPaginationRowModel,
    useVueTable,
} from "@tanstack/vue-table";
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

const data = ref(getTableData().slice(0, 25));

const pagination = ref<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
});

const table = useVueTable({
    data: data.value,
    columns: columns.value,
    state: {
        get pagination() {
            return pagination.value;
        },
    },
    onPaginationChange: (updater) => {
        pagination.value = updater instanceof Function ? updater(pagination.value) : updater;
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
});

const rowCount = computed(() => table.getFilteredRowModel().rows.length);
const pageSize = computed(() => table.getState().pagination.pageSize);
const pageIndex = computed(() => table.getState().pagination.pageIndex);
const start = computed(() => pageIndex.value * pageSize.value + 1);
const end = computed(() => Math.min(start.value + pageSize.value - 1, rowCount.value));
</script>

<template>
    <div>
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
                            <RenderCell :cell="cell" />
                        </td>
                    </tr>
                    <tr v-else>
                        <td :colspan="columns.length" class="h-24 text-center">No results.</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="border-base-200 flex flex-wrap items-center justify-between gap-2 border-t border-dashed p-5">
            <div class="flex items-center gap-2">
                <p class="text-base-content/70 text-sm max-md:hidden">Items per page</p>
                <select
                    class="select select-sm w-16"
                    :value="pagination.pageSize"
                    aria-label="Items per page"
                    @change="
                        (e) => {
                            pagination = {
                                ...pagination,
                                pageSize: parseInt((e.target as HTMLSelectElement).value),
                            };
                        }
                    ">
                    <option v-for="pageSizeOption in [5, 10, 20, 50]" :key="pageSizeOption" :value="pageSizeOption">
                        {{ pageSizeOption }}
                    </option>
                </select>
            </div>
            <p class="text-base-content/70 text-sm max-md:hidden">
                Showing
                <span class="text-base-content font-medium">{{ start }}–{{ end }}</span>
                out of <span class="text-base-content font-medium">{{ rowCount }}</span>
            </p>
            <div class="join">
                <button
                    class="btn btn-square btn-sm btn-outline border-base-300 join-item"
                    aria-label="Pagination controls"
                    :disabled="!table.getCanPreviousPage()"
                    @click="table.previousPage()">
                    <span class="iconify lucide--arrow-left" />
                </button>
                <button
                    v-for="i in table.getPageCount()"
                    :key="i - 1"
                    :class="[
                        'btn btn-square btn-sm btn-outline border-base-300 join-item',
                        pagination.pageIndex === i - 1 ? 'btn-active' : '',
                    ]"
                    @click="pagination = { ...pagination, pageIndex: i - 1 }">
                    {{ i }}
                </button>
                <button
                    class="btn btn-square btn-sm btn-outline border-base-300 join-item"
                    aria-label="Pagination controls"
                    :disabled="!table.getCanNextPage()"
                    @click="table.nextPage()">
                    <span class="iconify lucide--arrow-right" />
                </button>
            </div>
        </div>
    </div>
</template>
