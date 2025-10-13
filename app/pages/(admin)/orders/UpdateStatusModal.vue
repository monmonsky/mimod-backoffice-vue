<script setup lang="ts">
const props = defineProps<{
    order: any;
}>();

const emit = defineEmits<{
    close: [];
    updated: [];
}>();

const { updateOrderStatus } = useOrders();
const { success, error: showError } = useToast();

const form = ref({
    status: props.order.status,
    notes: "",
});

const updating = ref(false);

const statuses = [
    { value: "pending", label: "Pending", color: "text-warning" },
    { value: "processing", label: "Processing", color: "text-info" },
    { value: "shipped", label: "Shipped", color: "text-primary" },
    { value: "completed", label: "Completed", color: "text-success" },
    { value: "cancelled", label: "Cancelled", color: "text-error" },
];

const handleSubmit = async () => {
    try {
        updating.value = true;

        await updateOrderStatus(props.order.id, {
            status: form.value.status,
            notes: form.value.notes || undefined,
        });

        success("Order status updated successfully!");
        emit("updated");
    } catch (err: any) {
        showError(err?.data?.message || "Failed to update order status");
    } finally {
        updating.value = false;
    }
};
</script>

<template>
    <dialog class="modal modal-open">
        <div class="modal-box">
            <h3 class="flex items-center gap-2 text-lg font-bold">
                <span class="iconify lucide--package size-5 text-primary" />
                Update Order Status
            </h3>

            <div class="alert alert-info mt-4">
                <span class="iconify lucide--info size-5" />
                <div class="text-sm">
                    <p class="font-semibold">Order: {{ order.order_number }}</p>
                    <p class="text-xs">Current Status: <span class="font-medium">{{ order.status }}</span></p>
                </div>
            </div>

            <form @submit.prevent="handleSubmit" class="mt-4 space-y-4">
                <fieldset class="fieldset">
                    <legend class="fieldset-legend">New Status <span class="text-error">*</span></legend>
                    <select v-model="form.status" class="select select-bordered w-full" :disabled="updating">
                        <option v-for="status in statuses" :key="status.value" :value="status.value">
                            {{ status.label }}
                        </option>
                    </select>
                </fieldset>

                <fieldset class="fieldset">
                    <legend class="fieldset-legend">Notes (Optional)</legend>
                    <textarea
                        v-model="form.notes"
                        class="textarea textarea-bordered w-full"
                        rows="3"
                        placeholder="Add notes about this status change..."
                        :disabled="updating"></textarea>
                </fieldset>

                <div class="alert alert-warning" v-if="form.status === 'cancelled'">
                    <span class="iconify lucide--alert-triangle size-5" />
                    <span class="text-sm">Cancelling this order cannot be undone</span>
                </div>

                <div class="modal-action">
                    <button type="button" class="btn btn-ghost" :disabled="updating" @click="emit('close')">
                        Cancel
                    </button>
                    <button type="submit" class="btn btn-primary" :disabled="updating">
                        <span v-if="updating" class="loading loading-spinner loading-sm"></span>
                        <span v-else class="iconify lucide--check size-4" />
                        {{ updating ? "Updating..." : "Update Status" }}
                    </button>
                </div>
            </form>
        </div>
        <div class="modal-backdrop" @click="emit('close')"></div>
    </dialog>
</template>
