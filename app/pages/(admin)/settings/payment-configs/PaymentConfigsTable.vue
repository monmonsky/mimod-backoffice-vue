<script setup lang="ts">
import { getPaymentProviderBadgeClass } from "~/utils/badgeHelpers";

// Permission checks
const { canUpdate, canShow } = usePermissionCheck();

// Filters
const search = ref("");
const page = ref(1);
const per_page = ref(15);

// Build params reactively
const params = computed(() => ({
    page: page.value,
    per_page: per_page.value,
    ...(search.value && { search: search.value }),
}));

// Fetch payment configs
const { data: configsResponse, pending, refresh, error: fetchError } = await useAsyncData(
    "payment-configs",
    () =>
        $fetch("/payment-method-configs", {
            baseURL: useRuntimeConfig().public.apiBase,
            headers: {
                Authorization: `Bearer ${useAuthStore().token}`,
            },
            params: params.value,
        }),
    {
        watch: [params],
    }
);

const configs = computed(() => {
    const response = configsResponse.value as any;
    // Response structure: { status, data: [...] }
    if (Array.isArray(response?.data)) {
        return response.data;
    }
    return response?.data?.data || [];
});

const pagination = computed(() => {
    const response = configsResponse.value as any;

    // If response.data is array (not paginated), create manual pagination
    if (Array.isArray(response?.data)) {
        const total = response.data.length;
        return {
            current_page: 1,
            last_page: 1,
            per_page: total,
            total: total,
            from: total > 0 ? 1 : 0,
            to: total,
        };
    }

    // If paginated response
    const paginationData = response?.data?.pagination;
    return {
        current_page: paginationData?.current_page || 1,
        last_page: paginationData?.last_page || 1,
        per_page: paginationData?.per_page || 15,
        total: paginationData?.total || 0,
        from: paginationData?.from || 0,
        to: paginationData?.to || 0,
    };
});

// Pagination
const goToPage = (pageNum: number) => {
    page.value = pageNum;
};

// Watch search with debounce
const { debouncedValue: debouncedSearch } = useSearchDebounce(search);
watch(debouncedSearch, () => {
    page.value = 1;
});

// Watch filters - reset to page 1
watch([per_page], () => {
    page.value = 1;
});

// Use global badge helpers (imported from ~/utils/badgeHelpers)
</script>

<template>
    <div>
        <div class="card bg-base-100 shadow">
            <div class="card-body p-0">
                <!-- Filters -->
                <div class="flex items-center justify-between px-5 pt-5">
                    <div class="inline-flex items-center gap-3">
                        <label class="input input-sm">
                            <span class="iconify lucide--search text-base-content/80 size-3.5" />
                            <input
                                v-model="search"
                                type="search"
                                class="w-24 sm:w-48"
                                placeholder="Search configs..."
                                aria-label="Search payment configs" />
                        </label>
                    </div>
                </div>

                <!-- Table -->
                <div class="mt-4 overflow-auto">
                    <!-- Loading State -->
                    <div v-if="pending" class="flex items-center justify-center py-12">
                        <span class="loading loading-spinner loading-lg"></span>
                    </div>

                    <!-- Empty State -->
                    <div v-else-if="configs.length === 0" class="flex flex-col items-center justify-center py-12">
                        <span class="iconify lucide--settings text-base-content/30 mb-4 size-16" />
                        <p class="text-base-content/60">No payment configs found</p>
                    </div>

                    <!-- Table -->
                    <table v-else class="table">
                        <thead>
                            <tr>
                                <th>Config Name</th>
                                <th>Provider</th>
                                <th>Methods</th>
                                <th>Description</th>
                                <th class="text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="config in configs" :key="config.id">
                                <td>
                                    <div class="font-bold">{{ config.name }}</div>
                                </td>
                                <td>
                                    <span :class="['badge badge-sm badge-outline', getPaymentProviderBadgeClass(config.provider)]">
                                        {{ config.provider }}
                                    </span>
                                </td>
                                <td>
                                    <span class="badge badge-sm badge-info">
                                        {{ config.method_count || 0 }} methods
                                    </span>
                                </td>
                                <td>
                                    <p class="text-sm text-base-content/80 line-clamp-2">
                                        {{ config.description || '-' }}
                                    </p>
                                </td>
                                <td>
                                    <div class="flex justify-end gap-2">
                                        <NuxtLink
                                            v-if="canShow('payment-configs')"
                                            :to="`/settings/payment-configs/${config.id}/show`"
                                            class="btn btn-ghost btn-xs"
                                            aria-label="View">
                                            <span class="iconify lucide--eye size-4" />
                                        </NuxtLink>
                                        <NuxtLink
                                            v-if="canUpdate('payment-configs')"
                                            :to="`/settings/payment-configs/${config.id}/edit`"
                                            class="btn btn-ghost btn-xs"
                                            aria-label="Edit">
                                            <span class="iconify lucide--pencil size-4" />
                                        </NuxtLink>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Pagination -->
                <div v-if="pagination && configs.length > 0" class="flex items-center justify-between p-6">
                    <div class="text-base-content/80 hover:text-base-content flex gap-2 text-sm">
                        <span class="hidden sm:inline">Per page</span>
                        <select v-model="per_page" class="select select-xs w-18" aria-label="Per page">
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
