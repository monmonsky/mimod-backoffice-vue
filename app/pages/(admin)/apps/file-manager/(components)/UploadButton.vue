<script setup lang="ts">
import FileUploader from "~/components/forms/FileUploader.vue";

const modal = ref<HTMLDialogElement | null>(null);

const showModal = () => {
    modal.value?.showModal();
};

const closeModal = () => {
    modal.value?.close();
};
</script>

<template>
    <div>
        <button class="btn btn-ghost border-base-300 btn-sm" aria-label="Upload file" @click="showModal">
            <span class="iconify lucide--upload size-4" />
            Upload
        </button>

        <dialog id="apps-file-upload-modal" ref="modal" class="modal">
            <div class="modal-box">
                <div class="flex items-center justify-between">
                    <p class="font-medium">Upload Files</p>
                    <form method="dialog">
                        <button
                            class="btn btn-ghost btn-sm btn-circle"
                            aria-label="Close upload file modal"
                            @click="closeModal">
                            <span class="iconify lucide--x size-5" />
                        </button>
                    </form>
                </div>
                <div class="mt-4">
                    <FileUploader />
                    <div class="mt-5 text-end">
                        <button class="btn btn-primary btn-sm">
                            <span class="iconify lucide--arrow-down-to-line size-4" />
                            Import
                        </button>
                    </div>
                </div>
            </div>
            <form method="dialog" class="modal-backdrop" @click="closeModal">
                <button>close</button>
            </form>
        </dialog>
    </div>
</template>
