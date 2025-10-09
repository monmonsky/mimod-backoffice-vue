<script lang="ts" setup>
import { ref } from "vue";

const text = ref("You can write text and copy to your clipboard");
const isCopied = ref(false);
const timeout = ref<ReturnType<typeof setTimeout> | null>(null);

const copy = async () => {
    isCopied.value = true;
    if (timeout.value) clearTimeout(timeout.value);
    await navigator.clipboard.writeText(text.value);
    timeout.value = setTimeout(() => {
        isCopied.value = false;
    }, 3000);
};
</script>

<template>
    <div class="max-w-lg grow">
        <textarea v-model="text" aria-label="Text area" class="textarea w-full" />
        <div class="group mt-3 text-end" :data-copied="isCopied ? '' : undefined">
            <button class="btn" @click="copy">
                <span class="group-data-copied:hidden">Copy</span>
                <span class="hidden group-data-copied:block">Copied</span>
            </button>
        </div>
    </div>
</template>
