<script setup lang="ts">
import Footer from "~/components/admin-layout/Footer.vue";
import Rightbar from "~/components/admin-layout/Rightbar.vue";
import Sidebar from "~/components/admin-layout/Sidebar.vue";
import Topbar from "~/components/admin-layout/Topbar.vue";

import { adminMenuItems } from "./admin-menu";
</script>

<template>
    <div class="size-full">
        <div class="flex">
            <Sidebar :menu-items="adminMenuItems" />
            <div class="flex h-screen min-w-0 grow flex-col overflow-auto">
                <Topbar />
                <div id="layout-content">
                    <slot />
                </div>
                <Footer />
            </div>
        </div>
        <Rightbar />
    </div>
</template>
