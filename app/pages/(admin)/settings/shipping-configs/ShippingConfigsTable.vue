<script setup lang="ts">
import { getShippingProviderBadgeClass } from "~/utils/badgeHelpers";

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

// Fetch shipping configs
const { data: configsResponse, pending, refresh, error: fetchError } = await useAsyncData(
    "shipping-configs",
    () =>
        $fetch("/shipping-method-configs", {
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

// Test connection for RajaOngkir
const testingConnection = ref<number | null>(null);
const testResult = ref<any>(null);

const testConnection = async (configId: number) => {
    try {
        testingConnection.value = configId;
        testResult.value = null;

        const response = await $fetch('/rajaongkir/test-connection', {
            baseURL: useRuntimeConfig().public.apiBase,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${useAuthStore().token}`,
                Accept: 'application/json',
            },
        });

        testResult.value = {
            configId,
            success: true,
            data: response,
        };
    } catch (error: any) {
        console.error('Test connection failed:', error);
        testResult.value = {
            configId,
            success: false,
            error: error?.data || error,
        };
    } finally {
        testingConnection.value = null;
    }
};

// Use global badge helpers (imported from ~/utils/badgeHelpers)
</script>

<template>
    <div class="space-y-6">
        <!-- Test Connection Result -->
        <div v-if="testResult" class="card bg-base-100 shadow">
            <div class="card-body">
                <!-- Success Result -->
                <div v-if="testResult.success" class="space-y-4">
                    <div class="flex items-start gap-3">
                        <span class="iconify lucide--circle-check-big text-success size-6 mt-1" />
                        <div class="flex-1">
                            <h3 class="font-semibold text-lg text-success">Connection Test Successful</h3>
                            <p class="text-sm text-base-content/70 mt-1">
                                RajaOngkir API is reachable and authentication is valid.
                            </p>
                        </div>
                        <button
                            type="button"
                            @click="testResult = null"
                            class="btn btn-ghost btn-sm btn-circle">
                            <span class="iconify lucide--x size-4" />
                        </button>
                    </div>

                    <div class="divider my-2"></div>

                    <!-- Connection Details -->
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div v-if="testResult.data.account_type" class="border border-base-300 rounded-lg p-3 bg-base-50">
                            <label class="text-xs text-base-content/60 font-medium">Account Type</label>
                            <p class="font-semibold mt-1">{{ testResult.data.account_type }}</p>
                        </div>
                        <div v-if="testResult.data.province_count" class="border border-base-300 rounded-lg p-3 bg-base-50">
                            <label class="text-xs text-base-content/60 font-medium">Province Count</label>
                            <p class="font-semibold mt-1">{{ testResult.data.province_count }}</p>
                        </div>
                        <div v-if="testResult.data.http_status" class="border border-base-300 rounded-lg p-3 bg-base-50">
                            <label class="text-xs text-base-content/60 font-medium">HTTP Status</label>
                            <p class="font-semibold mt-1">{{ testResult.data.http_status }}</p>
                        </div>
                        <div v-if="testResult.data.response_time" class="border border-base-300 rounded-lg p-3 bg-base-50">
                            <label class="text-xs text-base-content/60 font-medium">Response Time</label>
                            <p class="font-semibold mt-1">{{ testResult.data.response_time }}</p>
                        </div>
                    </div>

                    <!-- Request/Response Details (Collapsible) -->
                    <details class="collapse collapse-arrow border border-base-300 bg-base-50">
                        <summary class="collapse-title text-sm font-medium">
                            Request & Response Details
                        </summary>
                        <div class="collapse-content space-y-3">
                            <!-- Request -->
                            <div v-if="testResult.data.request">
                                <label class="text-xs text-base-content/60 font-medium">Request</label>
                                <div class="mt-1 bg-base-200 rounded-lg p-3">
                                    <div class="text-xs space-y-1">
                                        <div v-if="testResult.data.request.method">
                                            <span class="font-semibold">Method:</span> {{ testResult.data.request.method }}
                                        </div>
                                        <div v-if="testResult.data.request.url">
                                            <span class="font-semibold">URL:</span>
                                            <code class="text-xs">{{ testResult.data.request.url }}</code>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Response -->
                            <div v-if="testResult.data.response">
                                <label class="text-xs text-base-content/60 font-medium">Response Body</label>
                                <pre class="mt-1 bg-base-200 rounded-lg p-3 text-xs overflow-x-auto">{{ JSON.stringify(testResult.data.response, null, 2) }}</pre>
                            </div>
                        </div>
                    </details>
                </div>

                <!-- Error Result -->
                <div v-else class="space-y-4">
                    <div class="flex items-start gap-3">
                        <span class="iconify lucide--circle-x text-error size-6 mt-1" />
                        <div class="flex-1">
                            <h3 class="font-semibold text-lg text-error">Connection Test Failed</h3>
                            <p class="text-sm text-base-content/70 mt-1">
                                {{ testResult.error?.message || 'Unable to connect to RajaOngkir API' }}
                            </p>
                        </div>
                        <button
                            type="button"
                            @click="testResult = null"
                            class="btn btn-ghost btn-sm btn-circle">
                            <span class="iconify lucide--x size-4" />
                        </button>
                    </div>

                    <!-- Error Details -->
                    <div v-if="testResult.error" class="border border-error/30 rounded-lg p-4 bg-error/5">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div v-if="testResult.error.http_status">
                                <label class="text-xs text-base-content/60 font-medium">HTTP Status</label>
                                <p class="font-semibold mt-1 text-error">{{ testResult.error.http_status }}</p>
                            </div>
                            <div v-if="testResult.error.error_code">
                                <label class="text-xs text-base-content/60 font-medium">Error Code</label>
                                <p class="font-semibold mt-1">{{ testResult.error.error_code }}</p>
                            </div>
                        </div>

                        <!-- Full Error Response -->
                        <details v-if="testResult.error" class="mt-3">
                            <summary class="text-xs font-medium cursor-pointer text-base-content/70 hover:text-base-content">
                                Show full error details
                            </summary>
                            <pre class="mt-2 bg-base-200 rounded-lg p-3 text-xs overflow-x-auto">{{ JSON.stringify(testResult.error, null, 2) }}</pre>
                        </details>
                    </div>

                    <div class="alert alert-warning">
                        <span class="iconify lucide--info size-5" />
                        <div class="text-sm">
                            <p class="font-semibold">Troubleshooting Tips:</p>
                            <ul class="list-disc list-inside mt-1 text-xs space-y-1">
                                <li>Check if your API key is correct in the configuration</li>
                                <li>Verify your account status with RajaOngkir</li>
                                <li>Ensure your server can reach external APIs</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>

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
                                aria-label="Search shipping configs" />
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
                        <p class="text-base-content/60">No shipping configs found</p>
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
                                    <span :class="['badge badge-sm badge-outline', getShippingProviderBadgeClass(config.provider)]">
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
                                        <!-- Test Connection Button (RajaOngkir only) -->
                                        <button
                                            v-if="config.provider === 'rajaongkir'"
                                            type="button"
                                            @click="testConnection(config.id)"
                                            :disabled="testingConnection === config.id"
                                            class="btn btn-ghost btn-xs"
                                            :class="{ 'btn-success': testResult?.configId === config.id && testResult.success, 'btn-error': testResult?.configId === config.id && !testResult.success }"
                                            aria-label="Test Connection">
                                            <span v-if="testingConnection === config.id" class="loading loading-spinner loading-xs"></span>
                                            <span v-else class="iconify lucide--plug-zap size-4" />
                                        </button>
                                        <NuxtLink
                                            :to="`/settings/shipping-configs/${config.id}/show`"
                                            class="btn btn-ghost btn-xs"
                                            aria-label="View">
                                            <span class="iconify lucide--eye size-4" />
                                        </NuxtLink>
                                        <NuxtLink
                                            :to="`/settings/shipping-configs/${config.id}/edit`"
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
