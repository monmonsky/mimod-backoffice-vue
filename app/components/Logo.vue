<script lang="ts" setup>
interface ILogo {
    className?: string;
}

const props = defineProps<ILogo>();
</script>

<template>
    <img src="/images/logo/logo-dark.png" alt="logo-dark" :class="`hidden h-5 dark:block ${props.className ?? ''}`" />
    <img src="/images/logo/logo-light.png" alt="logo-light" :class="`block h-5 dark:hidden ${props.className ?? ''}`" />
</template>
