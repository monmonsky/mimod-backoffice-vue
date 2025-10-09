<script setup lang="ts">
defineProps<{
    image: string;
    name: string;
    time: string;
    message: string;
}>();
</script>
<template>
    <div
        class="rounded-box hover:bg-base-200 flex cursor-pointer items-center gap-3 px-2 py-2 transition-all active:scale-[.98]">
        <img :src="image" alt="chat" class="bg-base-200 mask mask-squircle size-11" />

        <div class="grow">
            <div class="flex gap-1">
                <p class="grow">{{ name }}</p>
                <span class="text-base-content/60 text-xs">{{ time }}</span>
            </div>
            <p class="text-base-content/80 line-clamp-1 text-sm text-ellipsis">{{ message }}</p>
        </div>
    </div>
</template>
