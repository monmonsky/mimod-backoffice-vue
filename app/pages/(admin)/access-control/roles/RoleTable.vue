<script setup lang="ts">
import RoleTableRow from "./RoleTableRow.vue";
import { extractListData, extractPaginationMeta } from "~/utils/responseHelpers";

const { getRoles } = useRoles();

// Permission checks
const { canCreate } = usePermissionCheck();

const searchQuery = ref("");
const statusFilter = ref<boolean | "">("");
const typeFilter = ref<boolean | "">("");
const currentPage = ref(1);
const perPage = ref(15);

const filters = computed(() => ({
    search: searchQuery.value || undefined,
    is_active: statusFilter.value !== "" ? statusFilter.value : undefined,
    is_system: typeFilter.value !== "" ? typeFilter.value : undefined,
    page: currentPage.value,
    per_page: perPage.value,
}));

// Fetch roles with filters
const { data: rolesResponse, pending, error } = await useAsyncData(
    "roles",
    () => {
        const query = new URLSearchParams();
        if (filters.value.search) query.append("search", filters.value.search);
        if (filters.value.is_active !== undefined) query.append("is_active", filters.value.is_active.toString());
        if (filters.value.is_system !== undefined) query.append("is_system", filters.value.is_system.toString());
        if (filters.value.page) query.append("page", filters.value.page.toString());
        if (filters.value.per_page) query.append("per_page", filters.value.per_page.toString());

        const queryString = query.toString();
        const url = `/access-control/roles${queryString ? `?${queryString}` : ""}`;

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

const roles = computed(() => {
    const response = rolesResponse.value as any;
    return extractListData(response, "data.data");
});

const pagination = computed(() => {
    const response = rolesResponse.value as any;
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
                                placeholder="Search roles"
                                aria-label="Search roles" />
                        </label>
                        <div class="hidden sm:block">
                            <select v-model="statusFilter" class="select select-sm w-40" aria-label="Status">
                                <option value="">All Status</option>
                                <option :value="true">Active</option>
                                <option :value="false">Inactive</option>
                            </select>
                        </div>
                        <div class="hidden sm:block">
                            <select v-model="typeFilter" class="select select-sm w-40" aria-label="Type">
                                <option value="">All Types</option>
                                <option :value="true">System</option>
                                <option :value="false">Custom</option>
                            </select>
                        </div>
                    </div>
                    <div class="inline-flex items-center gap-3">
                        <NuxtLink
                            v-if="canCreate('roles')"
                            to="/access-control/roles/create"
                            aria-label="Create role link"
                            class="btn btn-primary btn-sm max-sm:btn-square">
                            <span class="iconify lucide--plus size-4" />
                            <span class="hidden sm:inline">New Role</span>
                        </NuxtLink>
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
                        <span>Failed to load roles. Please try again.</span>
                    </div>

                    <!-- Empty State -->
                    <div v-else-if="roles.length === 0" class="flex flex-col items-center justify-center py-12">
                        <span class="iconify lucide--shield text-base-content/30 mb-4 size-16" />
                        <p class="text-base-content/60">No roles found</p>
                    </div>

                    <!-- Table -->
                    <table v-else class="table">
                        <thead>
                            <tr>
                                <th>Role Name</th>
                                <th>Display Name</th>
                                <th>Description</th>
                                <th>Priority</th>
                                <th>Type</th>
                                <th>Status</th>
                                <th>Created At</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            <RoleTableRow v-for="role in roles" :key="role.id" v-bind="role" />
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
        <dialog id="access-control-role-delete" class="modal">
            <div class="modal-box">
                <div class="flex items-center justify-between text-lg font-medium">
                    Confirm Delete
                    <form method="dialog">
                        <button class="btn btn-sm btn-ghost btn-circle" aria-label="Close modal">
                            <span class="iconify lucide--x size-4" />
                        </button>
                    </form>
                </div>
                <p class="py-4">You are about to delete this role. Would you like to proceed further ?</p>
                <div class="modal-action">
                    <form method="dialog">
                        <button class="btn btn-ghost btn-sm">No</button>
                    </form>
                    <form method="dialog">
                        <button class="btn btn-sm btn-error">Yes, delete it</button>
                    </form>
                </div>
            </div>
            <form method="dialog" class="modal-backdrop">
                <button>close</button>
            </form>
        </dialog>
    </div>
</template>
