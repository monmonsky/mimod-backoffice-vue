<script lang="ts" setup>
import {
    type ColumnDef,
    type RowSelectionState,
    type SortingState,
    type VisibilityState,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
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
    { accessorKey: "actions", header: "Actions" },
]);
const selectAllRef = ref<HTMLInputElement | null>(null);

const data = ref(getTableData());

const sorting = ref<SortingState>([]);
const globalFilter = ref<string>("");
const columnVisibility = ref<VisibilityState>({});
const rowSelection = ref<RowSelectionState>({});
const pagination = ref({
    pageIndex: 0,
    pageSize: 10,
});

const table = useVueTable({
    data: data.value,
    columns: columns.value,
    state: {
        get sorting() {
            return sorting.value;
        },
        get globalFilter() {
            return globalFilter.value;
        },
        get columnVisibility() {
            return columnVisibility.value;
        },
        get rowSelection() {
            return rowSelection.value;
        },
        get pagination() {
            return pagination.value;
        },
    },
    onSortingChange: (updater) => {
        sorting.value = updater instanceof Function ? updater(sorting.value) : updater;
    },
    onGlobalFilterChange: (updater) => {
        globalFilter.value = updater instanceof Function ? updater(globalFilter.value) : updater;
    },
    onColumnVisibilityChange: (updater) => {
        columnVisibility.value = updater instanceof Function ? updater(columnVisibility.value) : updater;
    },
    onRowSelectionChange: (updater) => {
        rowSelection.value = updater instanceof Function ? updater(rowSelection.value) : updater;
    },
    onPaginationChange: (updater) => {
        pagination.value = updater instanceof Function ? updater(pagination.value) : updater;
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
});

const start = computed(() => pagination.value.pageIndex * pagination.value.pageSize + 1);
const rowCount = computed(() => table.getFilteredRowModel().rows.length);
const end = computed(() => Math.min(start.value + pagination.value.pageSize - 1, rowCount.value));

const selectedCount = computed(() => table.getSelectedRowModel().rows.length);
const totalCount = computed(() => table.getFilteredRowModel().rows.length);

const clearFilters = () => {
    sorting.value = [];
    globalFilter.value = "";
    columnVisibility.value = {};
    rowSelection.value = {};
    pagination.value = { pageIndex: 0, pageSize: 10 };
};

watchEffect(() => {
    if (selectAllRef.value) {
        const checkbox = Array.isArray(selectAllRef.value) ? selectAllRef.value[0] : selectAllRef.value;

        if (checkbox) {
            checkbox.indeterminate = table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected();
        }
    }
});
const viewRow = (id: string) => {
    alert(`View #${id}`);
};

const deleteRow = (id: string) => {
    alert(`Delete #${id}`);
};
</script>

<template>
    <div>
        <div class="border-base-200 flex items-center justify-between border-b border-dashed px-5 py-5">
            <label class="input input-sm w-36 md:w-44">
                <span class="iconify lucide--search text-base-content/70 size-4.5" />
                <input
                    class="text-base placeholder:text-sm"
                    type="search"
                    placeholder="Search by all fields"
                    :value="globalFilter"
                    @input="(e) => (globalFilter = (e.target as HTMLInputElement).value)" />
            </label>
            <div class="text-base-content/70 text-center text-sm max-md:hidden">
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
            <div class="flex items-center gap-2">
                <div class="dropdown dropdown-bottom dropdown-end">
                    <div tabindex="0" role="button" class="btn btn-outline btn-sm border-base-300 max-sm:btn-square">
                        <span class="iconify lucide--columns-3-cog size-4" />
                        <span class="max-sm:hidden">Columns</span>
                    </div>
                    <div tabindex="0" class="dropdown-content bg-base-100 rounded-box w-44 shadow">
                        <ul class="menu w-full">
                            <li
                                v-for="column in table.getAllLeafColumns()"
                                :key="column.id"
                                @click="column.getToggleVisibilityHandler()">
                                <div :data-visible="column.getIsVisible() ? true : undefined" class="group gap-2.5">
                                    <span
                                        class="iconify lucide--check size-4 scale-50 opacity-0 transition-all duration-300 group-data-visible:scale-100 group-data-visible:opacity-100" />
                                    <span class="font-medium">{{ column.columnDef.header as string }}</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="dropdown dropdown-bottom dropdown-end">
                    <div
                        tabindex="0"
                        role="button"
                        class="btn btn-outline btn-sm btn-square border-base-300"
                        aria-label="Actions">
                        <span class="iconify lucide--ellipsis-vertical size-4" />
                    </div>
                    <div tabindex="0" class="dropdown-content bg-base-100 rounded-box w-44 shadow">
                        <ul class="menu w-full">
                            <li>
                                <div>
                                    <span class="iconify lucide--refresh-cw size-4" />
                                    Refresh Data
                                </div>
                            </li>
                            <li>
                                <div>
                                    <span class="iconify lucide--calendar-range size-4" />
                                    Filter by Date
                                </div>
                            </li>
                            <li>
                                <div>
                                    <span class="iconify lucide--download size-4" />
                                    Export Rows
                                </div>
                            </li>
                            <li>
                                <div>
                                    <span class="iconify lucide--pie-chart size-4" />
                                    Report
                                </div>
                            </li>
                            <li>
                                <div>
                                    <span class="iconify lucide--clock size-4" />
                                    Recent Activity
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <div class="overflow-x-auto py-1">
            <table class="table">
                <thead>
                    <tr v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
                        <th>
                            <input
                                ref="selectAllRef"
                                aria-label="Select all rows"
                                type="checkbox"
                                :checked="table.getIsAllPageRowsSelected()"
                                class="checkbox checkbox-sm"
                                @change="() => table.toggleAllPageRowsSelected()" />
                        </th>
                        <th v-for="header in headerGroup.headers" :key="header.id">
                            <div
                                class="group flex cursor-pointer items-center justify-between"
                                :data-sorting="header.column.getIsSorted()"
                                @click="header.column.toggleSorting(header.column.getIsSorted() === 'asc')">
                                <template v-if="!header.isPlaceholder">
                                    {{ flexRender(header.column.columnDef.header, header.getContext()) }}
                                </template>
                                <template v-if="header.column.id !== 'actions'">
                                    <div class="flex flex-col items-center justify-center -space-y-1.5">
                                        <span
                                            class="iconify lucide--chevron-up text-base-content size-3 opacity-40 group-data-[sorting=asc]:opacity-100" />
                                        <span
                                            class="iconify lucide--chevron-down text-base-content size-3 opacity-40 group-data-[sorting=desc]:opacity-100" />
                                    </div>
                                </template>
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
                        <td>
                            <input
                                aria-label="Check"
                                type="checkbox"
                                :checked="row.getIsSelected()"
                                class="checkbox checkbox-sm"
                                @change="() => row.toggleSelected()" />
                        </td>
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
                        <td
                            :colspan="columns.length + 1"
                            class="text-base-content/60 h-40 text-center text-base font-medium">
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
        <div class="border-base-200 flex flex-wrap items-center justify-between gap-3 border-t border-dashed p-5">
            <div class="flex items-center gap-2">
                <p class="text-base-content/70 text-sm max-md:hidden">Items per page</p>
                <select
                    aria-label="Items per page"
                    class="select select-sm w-16"
                    :value="pagination.pageSize"
                    @change="
                        (e) =>
                            (pagination = {
                                ...pagination,
                                pageSize: parseInt((e.target as HTMLSelectElement).value),
                            })
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
                    class="btn btn-sm btn-outline border-base-300 join-item"
                    aria-label="Pagination controls"
                    @click="table.previousPage()">
                    <span class="iconify lucide--arrow-left" />
                    Prev
                </button>
                <input
                    aria-label="Page"
                    min="1"
                    :max="table.getPageCount()"
                    type="number"
                    :value="pagination.pageIndex + 1"
                    class="input input-sm join-item w-10 text-center"
                    @change="
                        (e) =>
                            (pagination = {
                                ...pagination,
                                pageIndex: parseInt((e.target as HTMLInputElement).value) - 1,
                            })
                    " />
                <button
                    class="btn btn-sm btn-outline border-base-300 join-item"
                    aria-label="Pagination controls"
                    :disabled="!table.getCanNextPage()"
                    @click="table.nextPage()">
                    Next
                    <span class="iconify lucide--arrow-right" />
                </button>
            </div>
        </div>
    </div>
</template>
