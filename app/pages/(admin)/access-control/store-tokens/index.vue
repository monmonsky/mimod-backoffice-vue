<script setup lang="ts">
import StoreTokensGenerateTokenModal from "./GenerateTokenModal.vue";

definePageMeta({
    layout: "admin",
    middleware: "auth",
});

const { getTokens, getTokenStats, revokeToken } = useStoreTokens();
const { success, error: showError } = useToast();

const { data: statsResponse, pending: loadingStats, refresh: refreshStats } = await getTokenStats();
const stats = computed(() => (statsResponse.value as any)?.data || {});

const { data: tokensResponse, pending: loadingTokens, refresh: refreshTokens } = await getTokens();
const tokens = computed(() => (tokensResponse.value as any)?.data?.tokens || []);
const totalTokens = computed(() => (tokensResponse.value as any)?.data?.total || 0);

const showGenerateModal = ref(false);
const showTokenModal = ref(false);
const generatedToken = ref("");
const deletingId = ref<number | null>(null);

const handleGenerateSuccess = (token: string) => {
    generatedToken.value = token;
    showGenerateModal.value = false;
    showTokenModal.value = true;
    refreshTokens();
    refreshStats();
};

const handleRevokeToken = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to revoke token "${name}"?`)) return;

    try {
        deletingId.value = id;
        await revokeToken(id);
        success("Token revoked successfully");
        await refreshTokens();
        await refreshStats();
    } catch (err: any) {
        showError(err?.data?.message || "Failed to revoke token");
    } finally {
        deletingId.value = null;
    }
};

const copyToken = () => {
    navigator.clipboard.writeText(generatedToken.value);
    success("Token copied to clipboard");
};

const closeTokenModal = () => {
    showTokenModal.value = false;
    generatedToken.value = "";
};

const formatDate = (date: string | null) => {
    if (!date) return "-";
    return new Date(date).toLocaleString("id-ID", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

</script>

<template>
    <div class="space-y-6 p-6">
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-2xl font-bold">Store API Tokens</h1>
                <p class="text-base-content/60 mt-1 text-sm">Manage API tokens for store frontend access</p>
            </div>
            <button class="btn btn-primary gap-2" @click="showGenerateModal = true">
                <span class="iconify lucide--plus size-4" />
                Generate Token
            </button>
        </div>

        <!-- Statistics Cards -->
        <div v-if="loadingStats" class="flex items-center justify-center py-12">
            <span class="loading loading-spinner loading-lg"></span>
        </div>
        <div v-else class="grid grid-cols-1 gap-6 md:grid-cols-5">
            <div class="card bg-base-100 shadow">
                <div class="card-body">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-base-content/60 text-sm">Total Tokens</p>
                            <p class="text-2xl font-bold">{{ stats.total_tokens || 0 }}</p>
                        </div>
                        <span class="iconify lucide--key size-8 text-primary" />
                    </div>
                </div>
            </div>

            <div class="card bg-base-100 shadow">
                <div class="card-body">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-base-content/60 text-sm">Active</p>
                            <p class="text-2xl font-bold text-success">{{ stats.active_tokens || 0 }}</p>
                        </div>
                        <span class="iconify lucide--check-circle size-8 text-success" />
                    </div>
                </div>
            </div>

            <div class="card bg-base-100 shadow">
                <div class="card-body">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-base-content/60 text-sm">Expired</p>
                            <p class="text-2xl font-bold text-error">{{ stats.expired_tokens || 0 }}</p>
                        </div>
                        <span class="iconify lucide--x-circle size-8 text-error" />
                    </div>
                </div>
            </div>

            <div class="card bg-base-100 shadow">
                <div class="card-body">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-base-content/60 text-sm">Recently Used</p>
                            <p class="text-2xl font-bold text-info">{{ stats.recently_used || 0 }}</p>
                        </div>
                        <span class="iconify lucide--activity size-8 text-info" />
                    </div>
                </div>
            </div>

            <div class="card bg-base-100 shadow">
                <div class="card-body">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-base-content/60 text-sm">Never Used</p>
                            <p class="text-2xl font-bold text-warning">{{ stats.never_used || 0 }}</p>
                        </div>
                        <span class="iconify lucide--alert-circle size-8 text-warning" />
                    </div>
                </div>
            </div>
        </div>

        <!-- Tokens Table -->
        <div class="card bg-base-100 shadow">
            <div class="card-body">
                <div v-if="loadingTokens" class="flex items-center justify-center py-12">
                    <span class="loading loading-spinner loading-lg"></span>
                </div>

                <div v-else-if="tokens.length === 0" class="py-12 text-center">
                    <span class="iconify lucide--key mb-4 size-12 text-base-content/20" />
                    <p class="text-base-content/60">No API tokens found</p>
                    <button class="btn btn-primary btn-sm mt-4" @click="showGenerateModal = true">Generate First Token</button>
                </div>

                <div v-else class="overflow-x-auto">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Abilities</th>
                                <th>Last Used</th>
                                <th>Expires At</th>
                                <th>Created At</th>
                                <th class="text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="token in tokens" :key="token.id">
                                <td>
                                    <div class="flex items-center gap-2">
                                        <span class="iconify lucide--key size-4 text-primary" />
                                        <span class="font-medium">{{ token.name }}</span>
                                    </div>
                                </td>
                                <td>
                                    <div class="flex flex-wrap gap-1">
                                        <span
                                            v-for="ability in (token.abilities || []).slice(0, 3)"
                                            :key="ability"
                                            class="badge badge-sm badge-outline">
                                            {{ ability }}
                                        </span>
                                        <span v-if="(token.abilities || []).length > 3" class="badge badge-sm badge-ghost">
                                            +{{ (token.abilities || []).length - 3 }} more
                                        </span>
                                    </div>
                                </td>
                                <td>
                                    <span v-if="token.last_used_at" class="text-sm">
                                        {{ formatDate(token.last_used_at) }}
                                    </span>
                                    <span v-else class="badge badge-sm badge-warning">Never used</span>
                                </td>
                                <td>
                                    <span v-if="token.expires_at" class="text-sm">
                                        {{ formatDate(token.expires_at) }}
                                    </span>
                                    <span v-else class="badge badge-sm badge-success">No expiration</span>
                                </td>
                                <td class="text-sm">{{ formatDate(token.created_at) }}</td>
                                <td>
                                    <div class="flex justify-end gap-2">
                                        <button
                                            class="btn btn-ghost btn-sm"
                                            :disabled="deletingId === token.id"
                                            @click="handleRevokeToken(token.id, token.name)">
                                            <span v-if="deletingId === token.id" class="loading loading-spinner loading-xs"></span>
                                            <span v-else class="iconify lucide--trash-2 size-4 text-error" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Generate Token Modal -->
        <StoreTokensGenerateTokenModal
            v-if="showGenerateModal"
            @close="showGenerateModal = false"
            @success="handleGenerateSuccess" />

        <!-- Show Token Modal -->
        <dialog v-if="showTokenModal" class="modal modal-open">
            <div class="modal-box max-w-2xl">
                <h3 class="flex items-center gap-2 text-lg font-bold">
                    <span class="iconify lucide--shield-check size-5 text-success" />
                    Token Generated Successfully
                </h3>

                <div class="alert alert-warning mt-4">
                    <span class="iconify lucide--alert-triangle size-5" />
                    <div>
                        <p class="font-semibold">Important: Save this token now!</p>
                        <p class="text-sm">This token will only be displayed once and cannot be recovered.</p>
                    </div>
                </div>

                <div class="mt-4">
                    <label class="label">
                        <span class="label-text font-medium">Your API Token</span>
                    </label>
                    <div class="flex gap-2">
                        <input
                            :value="generatedToken"
                            type="text"
                            class="input input-bordered w-full font-mono text-sm"
                            readonly />
                        <button class="btn btn-square btn-primary" @click="copyToken">
                            <span class="iconify lucide--copy size-5" />
                        </button>
                    </div>
                </div>

                <div class="modal-action">
                    <button class="btn btn-primary" @click="closeTokenModal">I've Saved the Token</button>
                </div>
            </div>
            <div class="modal-backdrop" @click="closeTokenModal"></div>
        </dialog>
    </div>
</template>
