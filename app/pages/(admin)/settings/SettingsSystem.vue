<script setup lang="ts">
const { getSettings, updateSettings } = useSettings();
const { success, error: showError } = useToast();

const saving = ref(false);

const { data: settingsResponse, pending } = await getSettings("system");

const settings = computed(() => (settingsResponse.value as any)?.data || {});

const form = ref({
    maintenance_mode: false,
    maintenance_message: "",
    debug_mode: false,
    cache_enabled: true,
    session_lifetime: 120,
    api_rate_limit: 60,
    max_upload_size: 10,
    allowed_file_types: "",
});

watch(
    settings,
    (newSettings) => {
        if (newSettings) {
            form.value = {
                maintenance_mode: newSettings.maintenance_mode || false,
                maintenance_message: newSettings.maintenance_message || "",
                debug_mode: newSettings.debug_mode || false,
                cache_enabled: newSettings.cache_enabled !== false,
                session_lifetime: newSettings.session_lifetime || 120,
                api_rate_limit: newSettings.api_rate_limit || 60,
                max_upload_size: newSettings.max_upload_size || 10,
                allowed_file_types: newSettings.allowed_file_types || "jpg,jpeg,png,gif,pdf,doc,docx",
            };
        }
    },
    { immediate: true },
);

const handleSubmit = async () => {
    try {
        saving.value = true;
        await updateSettings("system", form.value);
        success("System settings updated successfully!");
    } catch (err: any) {
        showError(err?.data?.message || "Failed to update settings");
    } finally {
        saving.value = false;
    }
};
</script>

<template>
    <div>
        <div v-if="pending" class="flex items-center justify-center py-12">
            <span class="loading loading-spinner loading-lg"></span>
        </div>

        <form v-else @submit.prevent="handleSubmit" class="space-y-6">
            <div>
                <h3 class="text-lg font-semibold">System Settings</h3>
                <p class="text-base-content/60 mt-1 text-sm">Configure system behavior and performance</p>
            </div>

            <!-- Maintenance Mode -->
            <div class="space-y-4">
                <h4 class="font-medium">Maintenance Mode</h4>
                <div class="grid grid-cols-1 gap-6">
                    <fieldset class="fieldset">
                        <label class="label cursor-pointer justify-start gap-3">
                            <input
                                v-model="form.maintenance_mode"
                                type="checkbox"
                                class="checkbox checkbox-warning"
                                :disabled="saving" />
                            <div>
                                <span class="label-text font-medium">Enable Maintenance Mode</span>
                                <p class="text-base-content/60 mt-1 text-xs">
                                    When enabled, only administrators can access the site
                                </p>
                            </div>
                        </label>
                    </fieldset>

                    <fieldset v-if="form.maintenance_mode" class="fieldset">
                        <legend class="fieldset-legend">Maintenance Message</legend>
                        <textarea
                            v-model="form.maintenance_message"
                            class="textarea w-full"
                            placeholder="We're performing scheduled maintenance. We'll be back soon!"
                            rows="3"
                            :disabled="saving"></textarea>
                    </fieldset>
                </div>
            </div>

            <!-- Performance Settings -->
            <div class="divider"></div>
            <div class="space-y-4">
                <h4 class="font-medium">Performance</h4>
                <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <fieldset class="fieldset">
                        <label class="label cursor-pointer justify-start gap-3">
                            <input v-model="form.cache_enabled" type="checkbox" class="checkbox" :disabled="saving" />
                            <div>
                                <span class="label-text">Enable Caching</span>
                                <p class="text-base-content/60 mt-1 text-xs">Improves performance</p>
                            </div>
                        </label>
                    </fieldset>

                    <fieldset class="fieldset">
                        <label class="label cursor-pointer justify-start gap-3">
                            <input
                                v-model="form.debug_mode"
                                type="checkbox"
                                class="checkbox checkbox-error"
                                :disabled="saving" />
                            <div>
                                <span class="label-text">Debug Mode</span>
                                <p class="text-base-content/60 mt-1 text-xs">Disable in production</p>
                            </div>
                        </label>
                    </fieldset>

                    <fieldset class="fieldset">
                        <legend class="fieldset-legend">Session Lifetime (minutes)</legend>
                        <input
                            v-model.number="form.session_lifetime"
                            type="number"
                            class="input w-full"
                            min="1"
                            :disabled="saving" />
                    </fieldset>

                    <fieldset class="fieldset">
                        <legend class="fieldset-legend">API Rate Limit (per minute)</legend>
                        <input
                            v-model.number="form.api_rate_limit"
                            type="number"
                            class="input w-full"
                            min="1"
                            :disabled="saving" />
                    </fieldset>
                </div>
            </div>

            <!-- File Upload Settings -->
            <div class="divider"></div>
            <div class="space-y-4">
                <h4 class="font-medium">File Uploads</h4>
                <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <fieldset class="fieldset">
                        <legend class="fieldset-legend">Max Upload Size (MB)</legend>
                        <input
                            v-model.number="form.max_upload_size"
                            type="number"
                            class="input w-full"
                            min="1"
                            max="100"
                            :disabled="saving" />
                    </fieldset>

                    <fieldset class="fieldset md:col-span-2">
                        <legend class="fieldset-legend">Allowed File Types</legend>
                        <input
                            v-model="form.allowed_file_types"
                            type="text"
                            class="input w-full"
                            placeholder="jpg,jpeg,png,gif,pdf,doc,docx"
                            :disabled="saving" />
                        <p class="text-base-content/60 mt-1 text-xs">Comma-separated list of allowed file extensions</p>
                    </fieldset>
                </div>
            </div>

            <div class="flex justify-end gap-3">
                <button type="button" class="btn btn-ghost" :disabled="saving">Cancel</button>
                <button type="submit" class="btn btn-primary" :disabled="saving">
                    <span v-if="saving" class="loading loading-spinner loading-sm"></span>
                    <span v-else class="iconify lucide--save size-4" />
                    {{ saving ? "Saving..." : "Save Changes" }}
                </button>
            </div>
        </form>
    </div>
</template>
