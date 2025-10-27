<script setup lang="ts">
import { getErrorMessage } from "~/utils/errorHandlers";
const { getSettings, updateSettings } = useSettings();
const { success, error: showError } = useToast();

const saving = ref(false);

const { data: settingsResponse, pending } = await getSettings("system");

const settings = computed(() => (settingsResponse.value as any)?.data || {});

const form = ref({
    general: {
        timezone: "Asia/Jakarta",
        date_format: "Y-m-d",
        time_format: "H:i:s",
        default_language: "id",
        currency: "IDR",
        currency_symbol: "Rp",
        currency_position: "before",
        decimal_separator: ",",
        thousand_separator: ".",
    },
    security: {
        min_password_length: 8,
        require_uppercase: true,
        require_number: true,
        require_special_char: false,
        max_login_attempts: 5,
        lockout_duration: 15,
        session_timeout: 120,
        enable_2fa: false,
    },
    order: {
        order_prefix: "ORD",
        min_order_amount: 0,
        enable_guest_checkout: true,
        auto_cancel_unpaid: true,
        unpaid_timeout_hours: 24,
        allow_backorders: false,
    },
    inventory: {
        track_inventory: true,
        low_stock_threshold: 5,
        out_of_stock_threshold: 0,
        enable_stock_notification: true,
        stock_notification_email: "",
    },
    cache: {
        enable_cache: true,
        cache_driver: "redis",
        cache_lifetime: 3600,
    },
    maintenance: {
        maintenance_mode: false,
        maintenance_message: "",
        maintenance_end_time: null as string | null,
    },
});

watch(
    settings,
    (newSettings) => {
        if (newSettings && Object.keys(newSettings).length > 0) {
            form.value = {
                general: {
                    timezone: newSettings["system.general"]?.value?.timezone || "Asia/Jakarta",
                    date_format: newSettings["system.general"]?.value?.date_format || "Y-m-d",
                    time_format: newSettings["system.general"]?.value?.time_format || "H:i:s",
                    default_language: newSettings["system.general"]?.value?.default_language || "id",
                    currency: newSettings["system.general"]?.value?.currency || "IDR",
                    currency_symbol: newSettings["system.general"]?.value?.currency_symbol || "Rp",
                    currency_position: newSettings["system.general"]?.value?.currency_position || "before",
                    decimal_separator: newSettings["system.general"]?.value?.decimal_separator || ",",
                    thousand_separator: newSettings["system.general"]?.value?.thousand_separator || ".",
                },
                security: {
                    min_password_length: newSettings["system.security"]?.value?.min_password_length || 8,
                    require_uppercase: newSettings["system.security"]?.value?.require_uppercase || false,
                    require_number: newSettings["system.security"]?.value?.require_number || false,
                    require_special_char: newSettings["system.security"]?.value?.require_special_char || false,
                    max_login_attempts: newSettings["system.security"]?.value?.max_login_attempts || 5,
                    lockout_duration: newSettings["system.security"]?.value?.lockout_duration || 15,
                    session_timeout: newSettings["system.security"]?.value?.session_timeout || 120,
                    enable_2fa: newSettings["system.security"]?.value?.enable_2fa || false,
                },
                order: {
                    order_prefix: newSettings["system.order"]?.value?.order_prefix || "ORD",
                    min_order_amount: newSettings["system.order"]?.value?.min_order_amount || 0,
                    enable_guest_checkout: newSettings["system.order"]?.value?.enable_guest_checkout || false,
                    auto_cancel_unpaid: newSettings["system.order"]?.value?.auto_cancel_unpaid || false,
                    unpaid_timeout_hours: newSettings["system.order"]?.value?.unpaid_timeout_hours || 24,
                    allow_backorders: newSettings["system.order"]?.value?.allow_backorders || false,
                },
                inventory: {
                    track_inventory: newSettings["system.inventory"]?.value?.track_inventory || false,
                    low_stock_threshold: newSettings["system.inventory"]?.value?.low_stock_threshold || 5,
                    out_of_stock_threshold: newSettings["system.inventory"]?.value?.out_of_stock_threshold || 0,
                    enable_stock_notification: newSettings["system.inventory"]?.value?.enable_stock_notification || false,
                    stock_notification_email: newSettings["system.inventory"]?.value?.stock_notification_email || "",
                },
                cache: {
                    enable_cache: newSettings["system.cache"]?.value?.enable_cache || false,
                    cache_driver: newSettings["system.cache"]?.value?.cache_driver || "redis",
                    cache_lifetime: newSettings["system.cache"]?.value?.cache_lifetime || 3600,
                },
                maintenance: {
                    maintenance_mode: newSettings["system.maintenance"]?.value?.maintenance_mode || false,
                    maintenance_message: newSettings["system.maintenance"]?.value?.maintenance_message || "",
                    maintenance_end_time: newSettings["system.maintenance"]?.value?.maintenance_end_time || null,
                },
            };
        }
    },
    { immediate: true },
);

const handleSubmit = async () => {
    try {
        saving.value = true;

        const payload = {
            general: form.value.general,
            security: form.value.security,
            order: form.value.order,
            inventory: form.value.inventory,
            cache: form.value.cache,
            maintenance: form.value.maintenance,
        };

        await updateSettings("system", payload);
        success("System settings updated successfully!");
    } catch (err) {
        showError(getErrorMessage(err, "Failed to update settings"));
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
                <h3 class="text-lg font-semibold">General Settings</h3>
                <p class="text-base-content/60 mt-1 text-sm">Configure general system settings</p>
            </div>

            <!-- General System -->
            <div class="space-y-4">
                <h4 class="font-medium">System Configuration</h4>
                <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <fieldset class="fieldset">
                        <legend class="fieldset-legend">Timezone</legend>
                        <select v-model="form.general.timezone" class="select w-full" :disabled="saving">
                            <option value="UTC">UTC</option>
                            <option value="Asia/Jakarta">Asia/Jakarta</option>
                            <option value="America/New_York">America/New_York</option>
                            <option value="Europe/London">Europe/London</option>
                        </select>
                    </fieldset>

                    <fieldset class="fieldset">
                        <legend class="fieldset-legend">Date Format</legend>
                        <select v-model="form.general.date_format" class="select w-full" :disabled="saving">
                            <option value="Y-m-d">YYYY-MM-DD</option>
                            <option value="d/m/Y">DD/MM/YYYY</option>
                            <option value="m/d/Y">MM/DD/YYYY</option>
                            <option value="d-M-Y">DD-MMM-YYYY</option>
                        </select>
                    </fieldset>

                    <fieldset class="fieldset">
                        <legend class="fieldset-legend">Time Format</legend>
                        <select v-model="form.general.time_format" class="select w-full" :disabled="saving">
                            <option value="H:i:s">24 Hour (HH:MM:SS)</option>
                            <option value="h:i:s A">12 Hour (hh:mm:ss AM/PM)</option>
                        </select>
                    </fieldset>

                    <fieldset class="fieldset">
                        <legend class="fieldset-legend">Language</legend>
                        <select v-model="form.general.default_language" class="select w-full" :disabled="saving">
                            <option value="en">English</option>
                            <option value="id">Indonesian</option>
                        </select>
                    </fieldset>

                    <fieldset class="fieldset">
                        <legend class="fieldset-legend">Currency</legend>
                        <select v-model="form.general.currency" class="select w-full" :disabled="saving">
                            <option value="USD">USD</option>
                            <option value="IDR">IDR</option>
                            <option value="EUR">EUR</option>
                        </select>
                    </fieldset>

                    <fieldset class="fieldset">
                        <legend class="fieldset-legend">Currency Symbol</legend>
                        <input v-model="form.general.currency_symbol" type="text" class="input w-full" :disabled="saving" />
                    </fieldset>
                </div>
            </div>

            <!-- Security -->
            <div class="divider"></div>
            <div class="space-y-4">
                <h4 class="font-medium">Security Settings</h4>
                <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <fieldset class="fieldset">
                        <legend class="fieldset-legend">Min Password Length</legend>
                        <input
                            v-model.number="form.security.min_password_length"
                            type="number"
                            min="6"
                            class="input w-full"
                            :disabled="saving" />
                    </fieldset>

                    <fieldset class="fieldset">
                        <legend class="fieldset-legend">Max Login Attempts</legend>
                        <input
                            v-model.number="form.security.max_login_attempts"
                            type="number"
                            min="1"
                            class="input w-full"
                            :disabled="saving" />
                    </fieldset>

                    <fieldset class="fieldset">
                        <legend class="fieldset-legend">Lockout Duration (minutes)</legend>
                        <input
                            v-model.number="form.security.lockout_duration"
                            type="number"
                            min="1"
                            class="input w-full"
                            :disabled="saving" />
                    </fieldset>

                    <fieldset class="fieldset">
                        <legend class="fieldset-legend">Session Timeout (minutes)</legend>
                        <input
                            v-model.number="form.security.session_timeout"
                            type="number"
                            min="1"
                            class="input w-full"
                            :disabled="saving" />
                    </fieldset>

                    <fieldset class="fieldset">
                        <label class="label cursor-pointer justify-start gap-3">
                            <input
                                v-model="form.security.require_uppercase"
                                type="checkbox"
                                class="checkbox"
                                :disabled="saving" />
                            <span class="label-text">Require Uppercase</span>
                        </label>
                    </fieldset>

                    <fieldset class="fieldset">
                        <label class="label cursor-pointer justify-start gap-3">
                            <input
                                v-model="form.security.require_number"
                                type="checkbox"
                                class="checkbox"
                                :disabled="saving" />
                            <span class="label-text">Require Number</span>
                        </label>
                    </fieldset>

                    <fieldset class="fieldset">
                        <label class="label cursor-pointer justify-start gap-3">
                            <input
                                v-model="form.security.require_special_char"
                                type="checkbox"
                                class="checkbox"
                                :disabled="saving" />
                            <span class="label-text">Require Special Character</span>
                        </label>
                    </fieldset>

                    <fieldset class="fieldset">
                        <label class="label cursor-pointer justify-start gap-3">
                            <input v-model="form.security.enable_2fa" type="checkbox" class="checkbox" :disabled="saving" />
                            <span class="label-text">Enable 2FA</span>
                        </label>
                    </fieldset>
                </div>
            </div>

            <!-- Order Settings -->
            <div class="divider"></div>
            <div class="space-y-4">
                <h4 class="font-medium">Order Settings</h4>
                <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <fieldset class="fieldset">
                        <legend class="fieldset-legend">Order Prefix</legend>
                        <input v-model="form.order.order_prefix" type="text" class="input w-full" :disabled="saving" />
                    </fieldset>

                    <fieldset class="fieldset">
                        <legend class="fieldset-legend">Min Order Amount</legend>
                        <input
                            v-model.number="form.order.min_order_amount"
                            type="number"
                            step="0.01"
                            class="input w-full"
                            :disabled="saving" />
                    </fieldset>

                    <fieldset class="fieldset">
                        <legend class="fieldset-legend">Unpaid Timeout (hours)</legend>
                        <input
                            v-model.number="form.order.unpaid_timeout_hours"
                            type="number"
                            min="1"
                            class="input w-full"
                            :disabled="saving" />
                    </fieldset>

                    <fieldset class="fieldset">
                        <label class="label cursor-pointer justify-start gap-3">
                            <input
                                v-model="form.order.enable_guest_checkout"
                                type="checkbox"
                                class="checkbox"
                                :disabled="saving" />
                            <span class="label-text">Enable Guest Checkout</span>
                        </label>
                    </fieldset>

                    <fieldset class="fieldset">
                        <label class="label cursor-pointer justify-start gap-3">
                            <input
                                v-model="form.order.auto_cancel_unpaid"
                                type="checkbox"
                                class="checkbox"
                                :disabled="saving" />
                            <span class="label-text">Auto Cancel Unpaid Orders</span>
                        </label>
                    </fieldset>

                    <fieldset class="fieldset">
                        <label class="label cursor-pointer justify-start gap-3">
                            <input
                                v-model="form.order.allow_backorders"
                                type="checkbox"
                                class="checkbox"
                                :disabled="saving" />
                            <span class="label-text">Allow Backorders</span>
                        </label>
                    </fieldset>
                </div>
            </div>

            <!-- Inventory -->
            <div class="divider"></div>
            <div class="space-y-4">
                <h4 class="font-medium">Inventory Settings</h4>
                <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <fieldset class="fieldset">
                        <label class="label cursor-pointer justify-start gap-3">
                            <input
                                v-model="form.inventory.track_inventory"
                                type="checkbox"
                                class="checkbox"
                                :disabled="saving" />
                            <span class="label-text">Track Inventory</span>
                        </label>
                    </fieldset>

                    <fieldset class="fieldset">
                        <label class="label cursor-pointer justify-start gap-3">
                            <input
                                v-model="form.inventory.enable_stock_notification"
                                type="checkbox"
                                class="checkbox"
                                :disabled="saving" />
                            <span class="label-text">Enable Stock Notifications</span>
                        </label>
                    </fieldset>

                    <fieldset class="fieldset">
                        <legend class="fieldset-legend">Low Stock Threshold</legend>
                        <input
                            v-model.number="form.inventory.low_stock_threshold"
                            type="number"
                            min="0"
                            class="input w-full"
                            :disabled="saving" />
                    </fieldset>

                    <fieldset class="fieldset">
                        <legend class="fieldset-legend">Out of Stock Threshold</legend>
                        <input
                            v-model.number="form.inventory.out_of_stock_threshold"
                            type="number"
                            min="0"
                            class="input w-full"
                            :disabled="saving" />
                    </fieldset>

                    <fieldset class="fieldset md:col-span-2">
                        <legend class="fieldset-legend">Stock Notification Email</legend>
                        <input
                            v-model="form.inventory.stock_notification_email"
                            type="email"
                            class="input w-full"
                            :disabled="saving" />
                    </fieldset>
                </div>
            </div>

            <!-- Maintenance -->
            <div class="divider"></div>
            <div class="space-y-4">
                <h4 class="font-medium">Maintenance Mode</h4>
                <div class="alert alert-warning" v-if="form.maintenance.maintenance_mode">
                    <span class="iconify lucide--alert-triangle size-5" />
                    <span class="text-sm">Maintenance mode is currently enabled!</span>
                </div>
                <div class="grid grid-cols-1 gap-6">
                    <fieldset class="fieldset">
                        <label class="label cursor-pointer justify-start gap-3">
                            <input
                                v-model="form.maintenance.maintenance_mode"
                                type="checkbox"
                                class="checkbox checkbox-warning"
                                :disabled="saving" />
                            <div>
                                <span class="label-text font-medium">Enable Maintenance Mode</span>
                                <p class="text-base-content/60 mt-1 text-xs">Site will be unavailable to regular users</p>
                            </div>
                        </label>
                    </fieldset>

                    <fieldset v-if="form.maintenance.maintenance_mode" class="fieldset">
                        <legend class="fieldset-legend">Maintenance Message</legend>
                        <textarea
                            v-model="form.maintenance.maintenance_message"
                            class="textarea w-full"
                            rows="3"
                            :disabled="saving"></textarea>
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
