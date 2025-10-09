<script setup lang="ts">
const props = defineProps<{
    iconClass?: string;
    class?: string;
}>();

const { toggleTheme } = useConfig();
</script>

<template>
    <button
        v-bind="$attrs"
        :class="`relative overflow-hidden ${props.class ?? ''}`"
        aria-label="Toggle Theme"
        @click="toggleTheme">
        <span
            :class="`iconify lucide--sun absolute size-4.5 -translate-y-4 opacity-0 transition-all duration-300 group-data-[theme=light]/html:translate-y-0 group-data-[theme=light]/html:opacity-100 ${props.iconClass ?? ''}`" />
        <span
            :class="`iconify lucide--moon absolute size-4.5 translate-y-4 opacity-0 transition-all duration-300 group-data-[theme=dark]/html:translate-y-0 group-data-[theme=dark]/html:opacity-100 ${props.iconClass ?? ''}`" />
        <span
            :class="`iconify lucide--palette absolute size-4.5 opacity-100 group-data-[theme=dark]/html:opacity-0 group-data-[theme=light]/html:opacity-0 ${props.iconClass ?? ''}`" />
    </button>
</template>
