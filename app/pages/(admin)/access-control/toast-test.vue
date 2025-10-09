<script setup lang="ts">
import { toast } from "vue-sonner";

definePageMeta({
    layout: "admin",
});

const showSuccessToast = () => {
    toast.success("Success! This is a success message");
};

const showErrorToast = () => {
    toast.error("Error! This is an error message");
};

const showInfoToast = () => {
    toast.info("Info! This is an info message");
};

const showWarningToast = () => {
    toast.warning("Warning! This is a warning message");
};

const showPromiseToast = () => {
    const promise = new Promise((resolve) => setTimeout(resolve, 2000));
    toast.promise(promise, {
        loading: "Loading...",
        success: "Promise resolved!",
        error: "Promise failed!",
    });
};
</script>

<template>
    <div class="container mx-auto p-8">
        <div class="card bg-base-100 shadow-xl">
            <div class="card-body">
                <h2 class="card-title text-2xl">Toast Test Page</h2>
                <p class="text-base-content/60">Test different toast notifications</p>

                <div class="divider"></div>

                <div class="flex flex-wrap gap-4">
                    <button class="btn btn-success" @click="showSuccessToast">
                        <span class="iconify lucide--check-circle size-5" />
                        Success Toast
                    </button>

                    <button class="btn btn-error" @click="showErrorToast">
                        <span class="iconify lucide--x-circle size-5" />
                        Error Toast
                    </button>

                    <button class="btn btn-info" @click="showInfoToast">
                        <span class="iconify lucide--info size-5" />
                        Info Toast
                    </button>

                    <button class="btn btn-warning" @click="showWarningToast">
                        <span class="iconify lucide--alert-triangle size-5" />
                        Warning Toast
                    </button>

                    <button class="btn btn-primary" @click="showPromiseToast">
                        <span class="iconify lucide--loader size-5" />
                        Promise Toast
                    </button>
                </div>

                <div class="divider"></div>

                <div class="alert alert-info">
                    <span class="iconify lucide--lightbulb size-5" />
                    <span>Click the buttons above to test toast notifications. They should appear at the top-right corner.</span>
                </div>
            </div>
        </div>
    </div>
</template>
