<script setup lang="ts">
import PageTitle from "~/components/PageTitle.vue";

definePageMeta({
    layout: "admin",
});

const route = useRoute();
const router = useRouter();
const configId = parseInt(route.params.id as string);
const { getShippingConfig, updateShippingConfig } = useShippingConfigs();
const { success, error: showError } = useToast();

// Set page title
const { setPageTitleFromMenu } = useAdminMenu();
setPageTitleFromMenu();

// Fetch shipping config
const { data: configResponse, pending } = await useAsyncData(
    `shipping-config-${configId}`,
    async () => {
        return await getShippingConfig(configId);
    }
);

// Form state
const form = ref({
    name: "",
    provider: "jne",
    description: "",
    configs: [] as Array<{ key: string; value: string; is_encrypted: boolean }>,
});

// Populate form when data is loaded
watch(
    configResponse,
    (response) => {
        if (response) {
            const data = (response as any)?.data;
            if (data) {
                form.value = {
                    name: data.name || "",
                    provider: data.provider || "jne",
                    description: data.description || "",
                    configs: Object.entries(data.configs || {}).map(([key, value]) => ({
                        key,
                        value: value as string,
                        is_encrypted: false,
                    })),
                };
            }
        }
    },
    { immediate: true }
);

// Add new config item
const addConfigItem = () => {
    form.value.configs.push({
        key: "",
        value: "",
        is_encrypted: false,
    });
};

// Convert configs array to object for API submission
const prepareFormData = () => {
    const configsObject = form.value.configs.reduce((acc, item) => {
        if (item.key && item.value) {
            acc[item.key] = item.value;
        }
        return acc;
    }, {} as Record<string, string>);

    return {
        name: form.value.name,
        provider: form.value.provider,
        description: form.value.description,
        configs: configsObject,
    };
};

const saving = ref(false);

const handleSubmit = async () => {
    // Validate that all config items have keys and values
    const invalidConfigs = form.value.configs.filter(c => !c.key || !c.value);
    if (invalidConfigs.length > 0) {
        showError("Please fill in all config key-value pairs");
        return;
    }

    try {
        saving.value = true;
        await updateShippingConfig(configId, prepareFormData());
        success("Shipping config updated successfully");
        router.push("/settings/shipping-configs");
    } catch (err: any) {
        showError(err?.data?.message || "Failed to update shipping config");
    } finally {
        saving.value = false;
    }
};
</script>

<template>
    <div>
        <PageTitle
            :title="'Edit Shipping Config'"
            :items="[
                { label: 'Settings' },
                { label: 'Shipping' },
                { label: 'Shipping Configs', path: '/settings/shipping-configs' },
                { label: 'Edit', active: true },
            ]" />

        <!-- Loading State -->
        <div v-if="pending" class="flex items-center justify-center py-12">
            <span class="loading loading-spinner loading-lg"></span>
        </div>

        <!-- Form -->
        <form v-else class="mt-6" @submit.prevent="handleSubmit">
            <div class="grid grid-cols-1 gap-5">
                <!-- Basic Information -->
                <div class="card bg-base-100 shadow">
                    <div class="card-body">
                        <div class="card-title">Basic Information</div>
                        <div class="fieldset mt-2 grid grid-cols-1 gap-4 lg:grid-cols-2">
                            <div class="space-y-2">
                                <label class="fieldset-label" for="name">
                                    Config Name <span class="text-error">*</span>
                                </label>
                                <input
                                    id="name"
                                    v-model="form.name"
                                    type="text"
                                    class="input w-full"
                                    placeholder="e.g., JNE Production"
                                    required />
                            </div>

                            <div class="space-y-2">
                                <label class="fieldset-label" for="provider">
                                    Provider <span class="text-error">*</span>
                                </label>
                                <select id="provider" v-model="form.provider" class="select w-full" required>
                                    <option value="jne">JNE</option>
                                    <option value="jnt">J&T</option>
                                    <option value="sicepat">SiCepat</option>
                                    <option value="pos">POS Indonesia</option>
                                    <option value="gosend">GoSend</option>
                                    <option value="grab">Grab</option>
                                    <option value="custom">Custom</option>
                                    <option value="rajaongkir">RajaOngkir</option>
                                </select>
                            </div>

                            <div class="space-y-2 lg:col-span-2">
                                <label class="fieldset-label" for="description">Description</label>
                                <textarea
                                    id="description"
                                    v-model="form.description"
                                    class="textarea textarea-bordered w-full"
                                    rows="3"
                                    placeholder="Brief description of this configuration"></textarea>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Configuration Items -->
                <div class="card bg-base-100 shadow">
                    <div class="card-body gap-0">
                        <div class="flex items-center justify-between">
                            <div class="card-title">Configuration Items</div>
                            <button
                                type="button"
                                @click="addConfigItem"
                                class="btn btn-sm btn-ghost">
                                <span class="iconify lucide--plus size-4" />
                                Add Item
                            </button>
                        </div>
                        <p class="text-base-content/60 mb-4 text-sm">Manage key-value pairs for your shipping provider configuration</p>

                        <div class="fieldset space-y-4">
                            <div
                                v-for="(config, index) in form.configs"
                                :key="index"
                                class="grid grid-cols-1 gap-4 lg:grid-cols-12 items-start border-b border-base-300 pb-4 last:border-0">
                                <div class="space-y-2 lg:col-span-5">
                                    <label class="fieldset-label" :for="`key-${index}`">
                                        Key <span class="text-error">*</span>
                                    </label>
                                    <input
                                        :id="`key-${index}`"
                                        v-model="config.key"
                                        type="text"
                                        class="input w-full input-sm"
                                        placeholder="e.g., api_key"
                                        required />
                                </div>

                                <div class="space-y-2 lg:col-span-5">
                                    <label class="fieldset-label" :for="`value-${index}`">
                                        Value <span class="text-error">*</span>
                                    </label>
                                    <input
                                        :id="`value-${index}`"
                                        v-model="config.value"
                                        :type="config.is_encrypted ? 'password' : 'text'"
                                        class="input w-full input-sm"
                                        placeholder="Enter value"
                                        required />
                                </div>

                                <div class="space-y-2 lg:col-span-2 flex items-end">
                                    <label class="label cursor-pointer flex-col gap-1">
                                        <span class="label-text text-xs">Encrypt</span>
                                        <input
                                            v-model="config.is_encrypted"
                                            type="checkbox"
                                            class="toggle toggle-sm toggle-primary" />
                                    </label>
                                </div>
                            </div>

                            <div v-if="form.configs.length === 0" class="text-center py-8">
                                <p class="text-base-content/60 text-sm">No config items yet</p>
                                <button
                                    type="button"
                                    @click="addConfigItem"
                                    class="btn btn-sm btn-primary mt-2">
                                    <span class="iconify lucide--plus size-4" />
                                    Add First Item
                                </button>
                            </div>
                        </div>

                        <div class="alert alert-info mt-4">
                            <span class="iconify lucide--info size-5" />
                            <div class="text-sm">
                                <p class="font-semibold">Tips:</p>
                                <ul class="list-disc list-inside mt-1">
                                    <li>Check "Encrypt" for sensitive values like API keys and secrets</li>
                                    <li>Encrypted values will be securely stored and masked in display</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Actions -->
            <div class="mt-6 flex justify-end gap-3">
                <NuxtLink class="btn btn-sm btn-ghost" to="/settings/shipping-configs">
                    <span class="iconify lucide--x size-4" />
                    Cancel
                </NuxtLink>
                <button type="submit" class="btn btn-sm btn-primary" :disabled="saving">
                    <span v-if="saving" class="loading loading-spinner loading-xs"></span>
                    <span v-else class="iconify lucide--save size-4" />
                    {{ saving ? 'Updating...' : 'Update Config' }}
                </button>
            </div>
        </form>
    </div>
</template>
