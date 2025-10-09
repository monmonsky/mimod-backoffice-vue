<script setup lang="ts">
import FileUploader from "@/components/forms/FileUploader.vue";

const showModal = () => {
    const modal = document.querySelector<HTMLDialogElement>("#page-settings-avatar-modal");
    modal?.showModal();
};
</script>

<template>
    <div>
        <div
            class="avatar group relative size-24 min-w-24 cursor-pointer overflow-hidden rounded-full"
            @click="showModal">
            <div class="bg-base-200 p-1 pb-0">
                <img src="/images/avatars/1.png" alt="Avatar" />
            </div>
            <div
                class="absolute right-0 -bottom-8 left-0 h-6 w-full bg-black/60 text-center text-sm font-medium text-white opacity-0 backdrop-blur-xs transition-all group-hover:bottom-0 group-hover:opacity-100">
                Edit
            </div>
        </div>

        <dialog id="page-settings-avatar-modal" class="modal">
            <div class="modal-box">
                <div class="flex items-center justify-between">
                    <p class="font-medium">Choose Avatar</p>
                    <form method="dialog">
                        <button class="btn btn-ghost btn-xs btn-circle" aria-label="Close upload file modal">
                            <span class="iconify lucide--x size-4" />
                        </button>
                    </form>
                </div>
                <div class="mt-4">
                    <FileUploader />
                    <div class="mt-5 text-end">
                        <button class="btn btn-primary btn-sm">
                            <span class="iconify lucide--arrow-up-from-line size-4" />
                            Update
                        </button>
                    </div>
                </div>
            </div>
            <form method="dialog" class="modal-backdrop">
                <button>close</button>
            </form>
        </dialog>
    </div>
</template>
