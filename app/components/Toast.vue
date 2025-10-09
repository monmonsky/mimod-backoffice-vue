<script setup lang="ts">
const { toasts, removeToast } = useToast();
</script>

<template>
    <div class="toast toast-top toast-end z-[9999] w-[380px]">
        <TransitionGroup name="toast">
            <div
                v-for="toast in toasts"
                :key="toast.id"
                class="bg-base-100 shadow-2xl rounded-2xl px-6 py-4 w-full border border-base-300">
                <div class="flex items-start justify-between gap-4">
                    <div class="flex-1 min-w-0">
                        <div class="font-semibold text-base-content mb-1">
                            {{ toast.type === 'success' ? 'Success' : toast.type === 'error' ? 'Error' : toast.type === 'warning' ? 'Warning' : 'Info' }}
                        </div>
                        <div class="text-base-content/70 text-sm break-words whitespace-pre-wrap">
                            {{ toast.message }}
                        </div>
                    </div>
                    <button
                        class="btn btn-ghost btn-xs btn-square text-base-content/50 hover:text-base-content shrink-0"
                        @click="removeToast(toast.id)">
                        <span class="iconify lucide--x size-4" />
                    </button>
                </div>
            </div>
        </TransitionGroup>
    </div>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
    transition: all 0.3s ease;
}
.toast-enter-from {
    opacity: 0;
    transform: translateX(100%);
}
.toast-leave-to {
    opacity: 0;
    transform: translateX(100%);
}
</style>
