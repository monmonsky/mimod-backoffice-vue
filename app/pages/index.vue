<script setup lang="ts">
// Middleware will handle redirect to login or dashboard
definePageMeta({
    middleware: "auth",
});
</script>

<template>
    <div class="flex h-screen items-center justify-center">
        <div class="text-center">
            <span class="loading loading-spinner loading-lg"></span>
            <p class="mt-4 text-sm text-base-content/60">Redirecting...</p>
        </div>
    </div>
</template>
