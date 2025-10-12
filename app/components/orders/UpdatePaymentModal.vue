<script setup lang="ts">
const props = defineProps<{
    order: any;
}>();

const emit = defineEmits<{
    close: [];
    updated: [];
}>();

const { updatePaymentStatus } = useOrders();
const { success, error: showError } = useToast();

const form = ref({
    payment_status: props.order.payment_status,
    notes: "",
});

const updating = ref(false);

const handleSubmit = async () => {
    try {
        updating.value = true;

        await updatePaymentStatus(props.order.id, {
            payment_status: form.value.payment_status,
            notes: form.value.notes || undefined,
        });

        success("Payment status updated successfully!");
        emit("updated");
    } catch (err: any) {
        showError(err?.data?.message || "Failed to update payment status");
    } finally {
        updating.value = false;
    }
};
</script>

<template>
    <dialog class="modal modal-open">
        <div class="modal-box">
            <h3 class="flex items-center gap-2 text-lg font-bold">
                <span class="iconify lucide--credit-card size-5 text-success" />
                Update Payment Status
            </h3>

            <div class="alert alert-info mt-4">
                <span class="iconify lucide--info size-5" />
                <div class="text-sm">
                    <p class="font-semibold">Order: {{ order.order_number }}</p>
                    <p class="text-xs">Current Payment: <span class="font-medium">{{ order.payment_status }}</span></p>
                </div>
            </div>

            <form @submit.prevent="handleSubmit" class="mt-4 space-y-4">
                <fieldset class="fieldset">
                    <legend class="fieldset-legend">Payment Status <span class="text-error">*</span></legend>
                    <select v-model="form.payment_status" class="select select-bordered w-full" :disabled="updating">
                        <option value="unpaid">Unpaid</option>
                        <option value="paid">Paid</option>
                    </select>
                </fieldset>

                <fieldset class="fieldset">
                    <legend class="fieldset-legend">Notes (Optional)</legend>
                    <textarea
                        v-model="form.notes"
                        class="textarea textarea-bordered w-full"
                        rows="3"
                        placeholder="Add payment confirmation details..."
                        :disabled="updating"></textarea>
                    <p class="text-base-content/60 mt-1 text-xs">
                        e.g., "Payment confirmed via bank transfer", "Payment proof verified"
                    </p>
                </fieldset>

                <div class="alert alert-success" v-if="form.payment_status === 'paid'">
                    <span class="iconify lucide--check-circle size-5" />
                    <span class="text-sm">Payment will be marked as confirmed and paid_at timestamp will be set</span>
                </div>

                <div class="modal-action">
                    <button type="button" class="btn btn-ghost" :disabled="updating" @click="emit('close')">
                        Cancel
                    </button>
                    <button type="submit" class="btn btn-success" :disabled="updating">
                        <span v-if="updating" class="loading loading-spinner loading-sm"></span>
                        <span v-else class="iconify lucide--check size-4" />
                        {{ updating ? "Updating..." : "Update Payment" }}
                    </button>
                </div>
            </form>
        </div>
        <div class="modal-backdrop" @click="emit('close')"></div>
    </dialog>
</template>
