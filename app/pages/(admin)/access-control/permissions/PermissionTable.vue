<script setup lang="ts">
import PermissionTableRow from "./PermissionTableRow.vue";
import type { PermissionFilters } from "~/types/access-control/permissions";
import { extractListData, extractPaginationMeta } from "~/utils/responseHelpers";

const { getPermissions } = usePermissions();
const { getModules } = useModules();

// Fetch modules for filter dropdown
const { data: modulesResponse } = getModules();
const modules = computed(() => {
    const response = modulesResponse.value as any;
    return extractListData(response, "data.data");
});

const searchQuery = ref("");
const moduleFilter = ref("");
const actionFilter = ref("");
const statusFilter = ref<boolean | "">("");
const currentPage = ref(1);
const perPage = ref(15);

const filters = computed<PermissionFilters>(() => ({
    search: searchQuery.value || undefined,
    module: moduleFilter.value || undefined,
    action: actionFilter.value || undefined,
    is_active: statusFilter.value !== "" ? statusFilter.value : undefined,
    page: currentPage.value,
    per_page: perPage.value,
}));

// Fetch permissions with filters
const { data: permissionsResponse, pending, error } = await useAsyncData(
    "permissions",
    () => {
        const query = new URLSearchParams();
        if (filters.value.search) query.append("search", filters.value.search);
        if (filters.value.module) query.append("module", filters.value.module);
        if (filters.value.action) query.append("action", filters.value.action);
        if (filters.value.is_active !== undefined) query.append("is_active", filters.value.is_active.toString());
        if (filters.value.page) query.append("page", filters.value.page.toString());
        if (filters.value.per_page) query.append("per_page", filters.value.per_page.toString());

        const queryString = query.toString();
        const url = `/access-control/permissions${queryString ? `?${queryString}` : ""}`;

        return $fetch(url, {
            baseURL: useRuntimeConfig().public.apiBase,
            headers: {
                Authorization: `Bearer ${useAuthStore().token}`,
            },
        });
    },
    {
        watch: [filters],
    },
);

const permissions = computed(() => {
    const response = permissionsResponse.value as any;
    return extractListData(response, "data.data");
});

const pagination = computed(() => {
    const response = permissionsResponse.value as any;
    return extractPaginationMeta(response, "data");
});

const goToPage = (page: number) => {
    currentPage.value = page;
};
</script>
<template>
    <div>
        <div class="card bg-base-100 shadow">
            <div class="card-body p-0">
                <div class="flex items-center justify-between px-5 pt-5">
                    <div class="inline-flex items-center gap-3">
                        <label class="input input-sm">
                            <span class="iconify lucide--search text-base-content/80 size-3.5" />
                            <input
                                v-model="searchQuery"
                                type="search"
                                class="w-24 sm:w-48"
                                placeholder="Search permissions"
                                aria-label="Search permissions" />
                        </label>
                        <div v-if="modules.length > 0" class="hidden sm:block">
                            <select v-model="moduleFilter" class="select select-sm w-40" aria-label="Module">
                                <option value="">All Modules</option>
                                <option v-for="module in modules" :key="module.id" :value="module.name">
                                    {{ module.display_name }}
                                </option>
                            </select>
                        </div>
                        <div class="hidden sm:block">
                            <select v-model="statusFilter" class="select select-sm w-32" aria-label="Status">
                                <option value="">All Status</option>
                                <option :value="true">Active</option>
                                <option :value="false">Inactive</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div class="mt-4 overflow-auto">
                    <!-- Loading State -->
                    <div v-if="pending" class="flex items-center justify-center py-12">
                        <span class="loading loading-spinner loading-lg"></span>
                    </div>

                    <!-- Error State -->
                    <div v-else-if="error" class="alert alert-error m-4">
                        <span class="iconify lucide--alert-circle size-5" />
                        <span>Failed to load permissions. Please try again.</span>
                    </div>

                    <!-- Empty State -->
                    <div
                        v-else-if="permissions.length === 0"
                        class="flex flex-col items-center justify-center py-12">
                        <span class="iconify lucide--shield text-base-content/30 mb-4 size-16" />
                        <p class="text-base-content/60">No permissions found</p>
                    </div>

                    <!-- Table -->
                    <table v-else class="table">
                        <thead>
                            <tr>
                                <th>Display Name</th>
                                <th>Name</th>
                                <th>Module</th>
                                <th>Action</th>
                                <th>Status</th>
                                <th>Description</th>
                            </tr>
                        </thead>

                        <tbody>
                            <PermissionTableRow
                                v-for="permission in permissions"
                                :key="permission.id"
                                :id="permission.id"
                                :name="permission.name"
                                :display_name="permission.display_name"
                                :description="permission.description"
                                :module="permission.module"
                                :action="permission.action"
                                :is_active="permission.is_active" />
                        </tbody>
                    </table>
                </div>
                <div v-if="pagination" class="flex items-center justify-between p-6">
                    <div class="text-base-content/80 hover:text-base-content flex gap-2 text-sm">
                        <span class="hidden sm:inline">Per page</span>
                        <select v-model="perPage" class="select select-xs w-18" aria-label="Per page">
                            <option :value="10">10</option>
                            <option :value="15">15</option>
                            <option :value="20">20</option>
                            <option :value="50">50</option>
                        </select>
                    </div>
                    <span class="text-base-content/80 hidden text-sm lg:inline">
                        Showing
                        <span class="text-base-content font-medium">{{ pagination.from }} to {{ pagination.to }}</span>
                        of {{ pagination.total }} items
                    </span>
                    <div class="inline-flex items-center gap-1">
                        <button
                            class="btn btn-circle sm:btn-sm btn-xs btn-ghost"
                            aria-label="Prev"
                            :disabled="pagination.current_page === 1"
                            @click="goToPage(pagination.current_page - 1)">
                            <span class="iconify lucide--chevron-left" />
                        </button>
                        <button
                            v-for="page in pagination.last_page"
                            :key="page"
                            class="btn btn-circle sm:btn-sm btn-xs"
                            :class="pagination.current_page === page ? 'btn-primary' : 'btn-ghost'"
                            @click="goToPage(page)">
                            {{ page }}
                        </button>
                        <button
                            class="btn btn-circle sm:btn-sm btn-xs btn-ghost"
                            aria-label="Next"
                            :disabled="pagination.current_page === pagination.last_page"
                            @click="goToPage(pagination.current_page + 1)">
                            <span class="iconify lucide--chevron-right" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
