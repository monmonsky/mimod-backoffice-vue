<script setup lang="ts">
export type IChatItem = {
    name: string;
    image: string;
};

defineProps<{
    chat: IChatItem;
}>();

const dialogRef = ref<HTMLDialogElement | null>(null);
</script>

<template>
    <dialog id="apps-chat-call-modal" ref="dialogRef" class="modal">
        <div class="modal-box">
            <div class="text-center">
                <img :src="chat.image" class="bg-base-200 mask mask-squircle inline size-16 p-0.5" alt="avatar" />
                <p class="mt-1 font-medium">{{ chat.name }}</p>
                <p class="text-base-content/60 text-sm">02 : 55</p>
            </div>

            <div class="mt-8 grid grid-cols-4 gap-3 text-center">
                <div class="hover:bg-base-200 rounded-box cursor-pointer py-3 transition-all max-sm:text-sm">
                    <span class="iconify lucide--mic-off size-6" />
                    <p>Mute</p>
                </div>
                <div class="hover:bg-base-200 rounded-box cursor-pointer py-3 transition-all max-sm:text-sm">
                    <span class="iconify lucide--pause size-6" />
                    <p>Hold</p>
                </div>
                <div class="hover:bg-base-200 rounded-box cursor-pointer py-3 transition-all max-sm:text-sm">
                    <span class="iconify lucide--disc size-6" />
                    <p>Record</p>
                </div>
                <div class="hover:bg-base-200 rounded-box cursor-pointer py-3 transition-all max-sm:text-sm">
                    <span class="iconify lucide--book-user size-6" />
                    <p>Contact</p>
                </div>
            </div>

            <div class="mt-8 grid grid-cols-3 text-center">
                <div>
                    <button class="btn btn-circle btn-ghost btn-lg" aria-label="Add User">
                        <span class="iconify lucide--user-round-plus size-6" />
                    </button>
                </div>
                <form method="dialog">
                    <div class="mt-8">
                        <button class="btn btn-circle btn-error btn-lg" aria-label="End call">
                            <span class="iconify lucide--phone size-6 rotate-[135deg]" />
                        </button>
                    </div>
                </form>
                <div>
                    <button class="btn btn-circle btn-ghost btn-lg" aria-label="More option">
                        <span class="iconify lucide--more-horizontal size-6" />
                    </button>
                </div>
            </div>
        </div>
        <form method="dialog" class="modal-backdrop">
            <button>close</button>
        </form>
    </dialog>
</template>
