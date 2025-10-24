<script setup lang="ts">
import TopbarNotificationButton from "./TopbarNotificationButton.vue";
import TopbarProfileMenu from "./TopbarProfileMenu.vue";
import TopbarSearchButton from "./TopbarSearchButton.vue";
</script>

<template>
    <div id="layout-topbar" role="navigation" aria-label="Navbar" class="flex items-center justify-between px-3">
        <div class="inline-flex items-center gap-3">
            <label
                class="btn btn-square btn-ghost btn-sm"
                aria-label="Leftmenu toggle"
                for="layout-sidebar-toggle-trigger">
                <span class="iconify lucide--menu size-5" />
            </label>
            <TopbarSearchButton />
        </div>
        <div class="inline-flex items-center gap-0.5">
                <TopbarNotificationButton />
                <ThemeToggle class="btn btn-sm btn-circle btn-ghost" />
                <label for="layout-rightbar-drawer" class="btn btn-circle btn-ghost btn-sm drawer-button">
                    <span class="iconify lucide--settings-2 size-4.5" />
                </label>
                <TopbarProfileMenu />
        </div>
    </div>
</template>
