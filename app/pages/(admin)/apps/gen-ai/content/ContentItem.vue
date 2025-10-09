<script lang="ts" setup>
type IResponseItem = {
    content?: string;
    image?: string;
    timeSince: string;
    isResponse?: boolean;
};

defineProps<IResponseItem>();
</script>
<template>
    <div v-if="isResponse" class="chat chat-start group">
        <div
            class="chat-image bg-primary/5 text-primary border-primary/10 flex items-center justify-center rounded-full border p-2">
            <span class="iconify lucide--bot size-6" />
        </div>
        <div class="chat-bubble bg-base-200 relative">
            {{ content }}
            <img v-if="image" :src="image" class="rounded-box mt-1" alt="Gen Image" />
            <div
                class="border-base-300 bg-base-100 absolute end-2 -bottom-8 z-10 flex scale-90 items-center gap-1.5 rounded-full border px-3 py-2 opacity-0 transition-all group-hover:scale-100 group-hover:opacity-100">
                <button class="btn btn-xs">Regenerate</button>
                <button class="btn btn-xs">Copy</button>
                <button class="btn btn-xs btn-ghost btn-error btn-circle">
                    <span class="iconify lucide--thumbs-down size-3.5" />
                </button>
                <button class="btn btn-xs btn-ghost btn-success btn-circle">
                    <span class="iconify lucide--thumbs-up size-3.5" />
                </button>
            </div>
        </div>
        <div class="chat-footer opacity-50">{{ timeSince }}</div>
    </div>
    <div v-else class="chat chat-end">
        <div class="chat-bubble bg-base-200">{{ content }}</div>
        <div class="chat-footer opacity-50">{{ timeSince }}</div>
    </div>
</template>
