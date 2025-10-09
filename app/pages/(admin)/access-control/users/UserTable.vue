<script setup lang="ts">
import UserTableRow from "./UserTableRow.vue";
import type { UserFilters } from "~/types/access-control/users";

const { getUsers } = useUsers();
const { getRoles } = useRoles();

// Fetch roles for filter dropdown
const { data: rolesResponse } = getRoles();
const roles = computed(() => {
    if (!rolesResponse.value?.data) return [];
    return rolesResponse.value.data.data;
});

const searchQuery = ref("");
const statusFilter = ref<"" | "active" | "suspended" | "deleted">("");
const roleFilter = ref<number | "">("");
const currentPage = ref(1);
const perPage = ref(15);

const filters = computed<UserFilters>(() => ({
    search: searchQuery.value || undefined,
    status: statusFilter.value || undefined,
    role_id: roleFilter.value || undefined,
    page: currentPage.value,
    per_page: perPage.value,
}));

// Use computed filters directly
const { data: usersResponse, pending, error } = await useAsyncData(
    "users",
    () => {
        const query = new URLSearchParams();
        if (filters.value.search) query.append("search", filters.value.search);
        if (filters.value.status) query.append("status", filters.value.status);
        if (filters.value.role_id) query.append("role_id", filters.value.role_id.toString());
        if (filters.value.page) query.append("page", filters.value.page.toString());
        if (filters.value.per_page) query.append("per_page", filters.value.per_page.toString());

        const queryString = query.toString();
        const url = `/access-control/users${queryString ? `?${queryString}` : ""}`;

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

const users = computed(() => usersResponse.value?.data?.data || []);
const pagination = computed(() => {
    if (!usersResponse.value?.data) return null;
    return {
        current_page: usersResponse.value.data.current_page,
        last_page: usersResponse.value.data.last_page,
        total: usersResponse.value.data.total,
        from: usersResponse.value.data.from,
        to: usersResponse.value.data.to,
        per_page: usersResponse.value.data.per_page,
    };
});

const goToPage = (page: number) => {
    currentPage.value = page;
};

const handleRefresh = () => {
    // Trigger re-fetch by changing a filter value slightly
    currentPage.value = currentPage.value;
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
                                placeholder="Search along users"
                                aria-label="Search along users" />
                        </label>
                        <div class="hidden sm:block">
                            <select v-model="statusFilter" class="select select-sm w-40" aria-label="Status">
                                <option value="">All Status</option>
                                <option value="active">Active</option>
                                <option value="suspended">Suspended</option>
                                <option value="deleted">Deleted</option>
                            </select>
                        </div>
                        <div class="hidden sm:block">
                            <select v-model.number="roleFilter" class="select select-sm w-40" aria-label="Role">
                                <option value="">All Roles</option>
                                <template v-if="roles.length > 0">
                                    <option v-for="role in roles" :key="role.id" :value="role.id">
                                        {{ role.display_name }}
                                    </option>
                                </template>
                            </select>
                        </div>
                    </div>
                    <div class="inline-flex items-center gap-3">
                        <NuxtLink
                            to="/access-control/users/create"
                            aria-label="Create user link"
                            class="btn btn-primary btn-sm max-sm:btn-square">
                            <span class="iconify lucide--plus size-4" />
                            <span class="hidden sm:inline">New User</span>
                        </NuxtLink>
                        <div class="dropdown dropdown-bottom dropdown-end">
                            <div
                                tabindex="0"
                                role="button"
                                class="btn btn-ghost border-base-300 btn-sm btn-square"
                                aria-label="More option">
                                <span class="iconify lucide--settings-2 size-4" />
                            </div>
                            <div tabindex="0" class="dropdown-content bg-base-100 rounded-box z-1 w-52 shadow">
                                <ul class="menu w-full p-2">
                                    <li>
                                        <div>
                                            <span class="iconify lucide--wand size-4" />
                                            Bulk Actions
                                        </div>
                                    </li>
                                </ul>
                                <hr class="border-base-300" />
                                <ul class="menu w-full p-2">
                                    <li>
                                        <div>
                                            <span class="iconify lucide--download-cloud size-4" />
                                            Import Users
                                        </div>
                                    </li>
                                    <li>
                                        <div>
                                            <span class="iconify lucide--upload-cloud size-4" />
                                            Export Users
                                        </div>
                                    </li>
                                </ul>
                            </div>
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
                        <span>Failed to load users. Please try again.</span>
                    </div>

                    <!-- Empty State -->
                    <div v-else-if="users.length === 0" class="flex flex-col items-center justify-center py-12">
                        <span class="iconify lucide--users text-base-content/30 mb-4 size-16" />
                        <p class="text-base-content/60">No users found</p>
                    </div>

                    <!-- Table -->
                    <table v-else class="table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Last Login</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            <UserTableRow
                                v-for="user in users"
                                :key="user.id"
                                :id="user.id"
                                :name="user.name"
                                :email="user.email"
                                :image="`/images/avatars/${(user.id % 10) + 1}.png`"
                                :role="user.role_display_name || user.role_name || 'N/A'"
                                :status="user.status"
                                :last-login="user.last_login_at || 'Never'"
                                @refresh="handleRefresh" />
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
                            v-for="page in Math.min(pagination.last_page, 5)"
                            :key="page"
                            :class="[
                                'btn btn-circle sm:btn-sm btn-xs',
                                page === pagination.current_page ? 'btn-primary' : 'btn-ghost',
                            ]"
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
