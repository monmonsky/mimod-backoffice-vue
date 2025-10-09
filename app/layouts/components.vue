<script setup lang="ts">
import Footer from "~/components/components-layout/Footer.vue";
import Sidebar from "~/components/components-layout/Sidebar.vue";
import Topbar from "~/components/components-layout/Topbar.vue";

import { componentsMenuItems } from "./component-menu";
</script>

<template>
    <div id="components-layout">
        <div id="components-layout-container">
            <div class="max-xl:hidden">
                <Sidebar :menu-items="componentsMenuItems" />
            </div>
            <div id="components-layout-main">
                <Topbar />
                <div id="components-layout-content"><slot /></div>
                <Footer />
            </div>
        </div>
    </div>
</template>
