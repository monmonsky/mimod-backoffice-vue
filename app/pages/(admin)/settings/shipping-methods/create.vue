<script setup lang="ts">
import PageTitle from "~/components/PageTitle.vue";
import RichTextEditor from "~/components/RichTextEditor.vue";

definePageMeta({
    layout: "admin",
});

const router = useRouter();
const { createShippingMethod } = useShippingMethods();
const { success, error: showError } = useToast();

// Set page title
const { setPageTitleFromMenu } = useAdminMenu();
setPageTitleFromMenu();

// Form state
const form = ref({
    code: "",
    name: "",
    type: "manual",
    provider: "jne",
    logo_url: "",
    description: "",
    instructions: "",
    base_cost: 0,
    cost_per_kg: 0,
    min_weight: null as number | null,
    max_weight: null as number | null,
    estimated_delivery: "2-3 hari",
    is_active: true,
    sort_order: 0,
});

// Auto-generate code from name (slug format)
watch(() => form.value.name, (newName) => {
    if (newName) {
        // Convert to lowercase, replace spaces with underscores, remove special chars
        form.value.code = newName
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '_')
            .replace(/[^a-z0-9_]/g, '');
    }
});

const saving = ref(false);

const handleSubmit = async () => {
    try {
        saving.value = true;
        await createShippingMethod(form.value);
        success("Shipping method created successfully");
        router.push("/settings/shipping-methods");
    } catch (err: any) {
        showError(err?.data?.message || "Failed to create shipping method");
    } finally {
        saving.value = false;
    }
};
</script>

<template>
    <div>
        <PageTitle
            :title="'Create Shipping Method'"
            :items="[
                { label: 'Settings' },
                { label: 'Shipping Methods', path: '/settings/shipping-methods' },
                { label: 'Create', active: true },
            ]" />

        <!-- Form -->
        <form class="mt-6" @submit.prevent="handleSubmit">
            <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
                <!-- Basic Information -->
                <div class="card bg-base-100 shadow">
                    <div class="card-body">
                        <div class="card-title">Basic Information</div>
                        <div class="fieldset mt-2 grid grid-cols-1 gap-4">
                            <div class="space-y-2">
                                <label class="fieldset-label" for="name">
                                    Name <span class="text-error">*</span>
                                </label>
                                <input
                                    id="name"
                                    v-model="form.name"
                                    type="text"
                                    class="input w-full"
                                    placeholder="e.g., JNE Regular"
                                    required />
                            </div>

                            <div class="space-y-2">
                                <label class="fieldset-label" for="code">Code</label>
                                <input
                                    id="code"
                                    v-model="form.code"
                                    type="text"
                                    class="input w-full bg-base-200"
                                    placeholder="Auto-generated from name"
                                    readonly />
                                <p class="text-base-content/60 text-xs flex items-center gap-1">
                                    <span class="iconify lucide--info size-3" />
                                    Auto-generated from shipping method name
                                </p>
                            </div>

                            <div class="space-y-2">
                                <label class="fieldset-label" for="type">
                                    Type <span class="text-error">*</span>
                                </label>
                                <select id="type" v-model="form.type" class="select w-full" required>
                                    <option value="manual">Manual</option>
                                    <option value="custom">Custom</option>
                                    <option value="rajaongkir">RajaOngkir</option>
                                </select>
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

                            <div class="space-y-2">
                                <label class="fieldset-label" for="logo_url">Logo URL</label>
                                <input
                                    id="logo_url"
                                    v-model="form.logo_url"
                                    type="text"
                                    class="input w-full"
                                    placeholder="https://example.com/logo.png" />
                            </div>

                            <div class="space-y-2">
                                <label class="fieldset-label" for="description">Description</label>
                                <textarea
                                    id="description"
                                    v-model="form.description"
                                    class="textarea textarea-bordered w-full"
                                    rows="3"
                                    placeholder="Brief description of this shipping method"></textarea>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Cost & Limits -->
                <div class="card bg-base-100 shadow">
                    <div class="card-body">
                        <div class="card-title">Cost & Limits</div>
                        <div class="fieldset mt-2 grid grid-cols-1 gap-4">
                            <div class="space-y-2">
                                <label class="fieldset-label" for="base_cost">Base Cost (Rp)</label>
                                <input
                                    id="base_cost"
                                    v-model.number="form.base_cost"
                                    type="number"
                                    min="0"
                                    class="input w-full" />
                            </div>

                            <div class="space-y-2">
                                <label class="fieldset-label" for="cost_per_kg">Cost per KG (Rp)</label>
                                <input
                                    id="cost_per_kg"
                                    v-model.number="form.cost_per_kg"
                                    type="number"
                                    min="0"
                                    class="input w-full" />
                            </div>

                            <div class="space-y-2">
                                <label class="fieldset-label" for="min_weight">Minimum Weight (kg)</label>
                                <input
                                    id="min_weight"
                                    v-model.number="form.min_weight"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    class="input w-full"
                                    placeholder="No minimum" />
                            </div>

                            <div class="space-y-2">
                                <label class="fieldset-label" for="max_weight">Maximum Weight (kg)</label>
                                <input
                                    id="max_weight"
                                    v-model.number="form.max_weight"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    class="input w-full"
                                    placeholder="No maximum" />
                            </div>

                            <div class="space-y-2">
                                <label class="fieldset-label" for="estimated_delivery">Estimated Delivery</label>
                                <input
                                    id="estimated_delivery"
                                    v-model="form.estimated_delivery"
                                    type="text"
                                    class="input w-full"
                                    placeholder="e.g., 2-3 hari" />
                                <p class="text-base-content/60 text-xs">Example: 2-3 hari, 1 hari, Hari ini</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Shipping Instructions -->
                <div class="card bg-base-100 shadow md:col-span-2">
                    <div class="card-body gap-0">
                        <div class="card-title">Shipping Instructions</div>
                        <p class="text-base-content/60 mb-4 text-sm">Additional information for customers</p>
                        <div class="fieldset">
                            <div class="space-y-2">
                                <label class="fieldset-label" for="instructions">Instructions</label>
                                <RichTextEditor
                                    v-model="form.instructions"
                                    placeholder="Enter shipping instructions or additional information..." />
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Other Settings -->
                <div class="card bg-base-100 shadow md:col-span-2">
                    <div class="card-body gap-0">
                        <div class="card-title">Other Settings</div>
                        <div class="fieldset mt-4 grid grid-cols-1 gap-5 lg:grid-cols-2">
                            <div class="space-y-2">
                                <label class="fieldset-label" for="sort_order">Sort Order</label>
                                <input
                                    id="sort_order"
                                    v-model.number="form.sort_order"
                                    type="number"
                                    min="0"
                                    class="input w-full" />
                                <p class="text-base-content/60 text-xs">Lower numbers appear first</p>
                            </div>

                            <div class="space-y-2">
                                <label class="fieldset-label">Status</label>
                                <label class="label cursor-pointer justify-start gap-4">
                                    <input v-model="form.is_active" type="checkbox" class="toggle toggle-primary" />
                                    <span class="label-text">Active</span>
                                </label>
                                <p class="text-base-content/60 text-xs">Enable this shipping method for customers</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Actions -->
            <div class="mt-6 flex justify-end gap-3">
                <NuxtLink class="btn btn-sm btn-ghost" to="/settings/shipping-methods">
                    <span class="iconify lucide--x size-4" />
                    Cancel
                </NuxtLink>
                <button type="submit" class="btn btn-sm btn-primary" :disabled="saving">
                    <span v-if="saving" class="loading loading-spinner loading-xs"></span>
                    <span v-else class="iconify lucide--plus size-4" />
                    {{ saving ? 'Creating...' : 'Create Shipping Method' }}
                </button>
            </div>
        </form>
    </div>
</template>
