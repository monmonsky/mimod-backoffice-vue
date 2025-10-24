<script setup lang="ts">
const searchQuery = ref("");
const dateFilter = ref("");
const actionFilter = ref("");
const perPage = ref(10);

const filters = computed(() => ({
    search: searchQuery.value || undefined,
    date: dateFilter.value || undefined,
    action: actionFilter.value || undefined,
}));

// Fetch user activity data
const currentPage = ref(1);
const { data: activityResponse, pending, error, refresh } = await useAsyncData(
    "user-activities",
    () => {
        const query = new URLSearchParams();
        query.append("page", currentPage.value.toString());
        if (filters.value.search) query.append("search", filters.value.search);
        if (filters.value.date) query.append("date", filters.value.date);
        if (filters.value.action) query.append("action", filters.value.action);

        return $fetch(`/access-control/user-activities?${query.toString()}`, {
            baseURL: useRuntimeConfig().public.apiBase,
            headers: {
                Authorization: `Bearer ${useAuthStore().token}`,
            },
        });
    },
    {
        watch: [filters, currentPage],
    },
);

const activities = computed(() => {
    const response = activityResponse.value as any;
    return response?.data?.data || [];
});

const pagination = computed(() => {
    const response = activityResponse.value as any;
    const data = response?.data;
    const currentPage = data?.current_page || 1;
    const perPageValue = data?.per_page || 10;
    const total = data?.total || 0;
    return {
        current_page: currentPage,
        last_page: data?.last_page || 1,
        per_page: perPageValue,
        total: total,
        from: (currentPage - 1) * perPageValue + 1,
        to: Math.min(currentPage * perPageValue, total),
    };
});

const goToPage = (page: number) => {
    currentPage.value = page;
};

const getActionBadgeClass = (action: string) => {
    const actionLower = action.toLowerCase();
    if (actionLower.includes("create") || actionLower.includes("add")) return "badge-success";
    if (actionLower.includes("update") || actionLower.includes("edit")) return "badge-info";
    if (actionLower.includes("delete") || actionLower.includes("remove")) return "badge-error";
    if (actionLower.includes("login")) return "badge-primary";
    if (actionLower.includes("logout")) return "badge-warning";
    return "badge-ghost";
};

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
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
                                placeholder="Search activity"
                                aria-label="Search activity" />
                        </label>
                        <div class="hidden sm:block">
                            <input
                                v-model="dateFilter"
                                type="date"
                                class="input input-sm w-40"
                                aria-label="Filter by date" />
                        </div>
                        <div class="hidden sm:block">
                            <select v-model="actionFilter" class="select select-sm w-40" aria-label="Filter by action">
                                <option value="">All Actions</option>
                                <option value="login">Login</option>
                                <option value="logout">Logout</option>
                                <option value="create">Create</option>
                                <option value="update">Update</option>
                                <option value="delete">Delete</option>
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
                        <span>Failed to load user activity. Please try again.</span>
                    </div>

                    <!-- Empty State -->
                    <div v-else-if="activities.length === 0" class="flex flex-col items-center justify-center py-12">
                        <span class="iconify lucide--activity text-base-content/30 mb-4 size-16" />
                        <p class="text-base-content/60">No activity found</p>
                    </div>

                    <!-- Table -->
                    <table v-else class="table">
                        <thead class="bg-base-200/50">
                            <tr>
                                <th class="w-12">#</th>
                                <th>User</th>
                                <th>Action</th>
                                <th>Subject</th>
                                <th>Description</th>
                                <th>IP Address</th>
                                <th>Date & Time</th>
                                <th class="w-12">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(activity, index) in activities" :key="activity.id" class="hover">
                                <td>{{ (pagination.current_page - 1) * pagination.per_page + index + 1 }}</td>
                                <td>
                                    <div class="flex items-center gap-3">
                                        <div class="avatar placeholder">
                                            <div class="bg-primary text-primary-content w-10 rounded-full">
                                                <span class="text-xs">{{ activity.user_name?.charAt(0) || "U" }}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <div class="font-semibold">{{ activity.user_name || "Unknown" }}</div>
                                            <div class="text-base-content/60 text-xs">{{ activity.user_email || "-" }}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <span class="badge badge-sm" :class="getActionBadgeClass(activity.action)">
                                        {{ activity.action }}
                                    </span>
                                </td>
                                <td>
                                    <div v-if="activity.subject_type" class="flex flex-col gap-1">
                                        <span class="font-medium">{{ activity.subject_type }}</span>
                                        <span class="text-base-content/60 text-xs">ID: {{ activity.subject_id }}</span>
                                    </div>
                                    <span v-else class="text-base-content/40">-</span>
                                </td>
                                <td>
                                    <div class="max-w-md truncate" :title="activity.description">
                                        {{ activity.description || "-" }}
                                    </div>
                                </td>
                                <td>
                                    <code class="text-xs">{{ activity.ip_address || "-" }}</code>
                                </td>
                                <td>
                                    <div class="text-sm">{{ formatDate(activity.created_at) }}</div>
                                </td>
                                <td>
                                    <NuxtLink
                                        :href="`/access-control/user-activity/${activity.id}/show`"
                                        class="btn btn-ghost btn-sm btn-square"
                                        aria-label="View detail">
                                        <span class="iconify lucide--eye size-4" />
                                    </NuxtLink>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Pagination -->
                <div v-if="pagination" class="flex items-center justify-between p-6">
                    <div class="text-base-content/80 hover:text-base-content flex gap-2 text-sm">
                        <span class="hidden sm:inline">Per page</span>
                        <select v-model="perPage" class="select select-xs w-18" aria-label="Per page">
                            <option :value="10">10</option>
                            <option :value="20">20</option>
                            <option :value="50">50</option>
                            <option :value="100">100</option>
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
                            v-for="pageNum in Math.min(pagination.last_page, 5)"
                            :key="pageNum"
                            :class="[
                                'btn btn-circle sm:btn-sm btn-xs',
                                pageNum === pagination.current_page ? 'btn-primary' : 'btn-ghost',
                            ]"
                            @click="goToPage(pageNum)">
                            {{ pageNum }}
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
