<script lang="ts" setup>
import { computed, ref } from "vue";
import Rightbar from "~/components/admin-layout/Rightbar.vue";

import { footers, sidebars, topbars } from "./list";

const { calculatedSidebarTheme } = toRefs(useConfig());

const selectedSidebar = ref(sidebars[0]!.title);
const selectedTopbar = ref(topbars[0]!.title);
const selectedFooter = ref(footers[0]!.title);
const Sidebar = computed(() => {
    return sidebars.find((s) => s.title === selectedSidebar.value)?.comp || sidebars[0]!.comp;
});

const Topbar = computed(() => {
    return topbars.find((t) => t.title === selectedTopbar.value)?.comp || topbars[0]!.comp;
});

const Footer = computed(() => {
    return footers.find((f) => f.title === selectedFooter.value)?.comp || footers[0]!.comp;
});
</script>

<template>
    <div class="size-full">
        <div class="flex">
            <input
                id="layout-sidebar-toggle-trigger"
                type="checkbox"
                class="hidden"
                aria-label="Toggle layout sidebar" />
            <input id="layout-sidebar-hover-trigger" type="checkbox" class="hidden" aria-label="Dense layout sidebar" />
            <div id="layout-sidebar-hover" class="bg-base-300 h-screen w-1" />
            <div id="layout-sidebar" :data-theme="calculatedSidebarTheme" class="overflow-hidden">
                <Suspense>
                    <component :is="Sidebar" />
                </Suspense>
            </div>
            <label id="layout-sidebar-backdrop" for="layout-sidebar-toggle-trigger" />

            <div class="flex h-screen min-w-0 grow flex-col overflow-auto">
                <div id="layout-topbar">
                    <Suspense>
                        <component :is="Topbar" />
                    </Suspense>
                </div>
                <div id="layout-content">
                    <PageTitle :title="'Layout Builder'" :items="[{ label: 'Layout Builder', active: true }]" />
                    <div class="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5">
                        <div class="bg-base-100 card card-border h-fit">
                            <div
                                class="bg-base-200/30 rounded-box mx-3 mt-3 flex items-center gap-2 px-4 py-2 font-medium">
                                <span class="iconify lucide--layout-panel-left size-4" />
                                Sidebar
                            </div>
                            <div class="space-y-0.5 p-3">
                                <div
                                    v-for="(sidebar, index) in sidebars"
                                    :key="index"
                                    :class="[
                                        'hover:bg-base-200 rounded-box flex cursor-pointer items-center gap-2 px-2.5 py-1',
                                        selectedSidebar === sidebar.title ? 'bg-base-200' : '',
                                    ]"
                                    @click="selectedSidebar = sidebar.title">
                                    <div class="w-5">
                                        <span
                                            v-if="selectedSidebar === sidebar.title"
                                            class="iconify lucide--check block" />
                                    </div>
                                    <div>{{ sidebar.title }}</div>
                                </div>
                            </div>
                        </div>
                        <div class="card card-border bg-base-100 h-fit">
                            <div
                                class="bg-base-200/30 rounded-box mx-3 mt-3 flex items-center gap-2 px-4 py-2 font-medium">
                                <span class="iconify lucide--layout-panel-top size-4" />
                                Topbar
                            </div>
                            <div class="space-y-0.5 p-3">
                                <div
                                    v-for="(topbar, index) in topbars"
                                    :key="index"
                                    :class="[
                                        'hover:bg-base-200 rounded-box flex cursor-pointer items-center gap-2 px-2.5 py-1',
                                        selectedTopbar === topbar.title ? 'bg-base-200' : '',
                                    ]"
                                    @click="selectedTopbar = topbar.title">
                                    <div class="w-5">
                                        <span
                                            v-if="selectedTopbar === topbar.title"
                                            class="iconify lucide--check block" />
                                    </div>
                                    <div>{{ topbar.title }}</div>
                                </div>
                            </div>
                        </div>
                        <div class="card card-border bg-base-100 h-fit">
                            <div
                                class="bg-base-200/30 rounded-box mx-3 mt-3 flex items-center gap-2 px-4 py-2 font-medium">
                                <span class="iconify lucide--layout-panel-top size-4 rotate-180" />
                                Footer
                            </div>
                            <div class="space-y-0.5 p-3">
                                <div
                                    v-for="(footer, index) in footers"
                                    :key="index"
                                    :class="[
                                        'hover:bg-base-200 rounded-box flex cursor-pointer items-center gap-2 px-2.5 py-1',
                                        selectedFooter === footer.title ? 'bg-base-200' : '',
                                    ]"
                                    @click="selectedFooter = footer.title">
                                    <div class="w-5">
                                        <span
                                            v-if="selectedFooter === footer.title"
                                            class="iconify lucide--check block" />
                                    </div>
                                    <div>{{ footer.title }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="bg-base-100 rounded-box border-base-200 mt-8 max-w-md border p-5 xl:mt-12 2xl:mt-16">
                        <p class="text-info font-medium">Note:</p>
                        <p class="text-base-content/80 mt-1 text-sm">
                            All layout components, including the
                            <router-link class="link link-hover text-primary" to="/components/layouts/sidebar">
                                sidebar
                            </router-link>
                            ,
                            <router-link class="link link-hover text-primary" to="/components/layouts/topbar">
                                topbar
                            </router-link>
                            and
                            <router-link class="link link-hover text-primary" to="/components/layouts/footer">
                                footer
                            </router-link>
                            are available in the components section for easy access and customization.
                        </p>
                    </div>
                </div>
                <div class="px-4 py-1">
                    <Suspense>
                        <component :is="Footer" />
                    </Suspense>
                </div>
            </div>
        </div>
        <div class="fixed end-16 bottom-16 z-100">
            <label
                for="layout-rightbar-drawer"
                class="btn btn-circle btn-lg btn-primary shadow-primary/20 drawer-button shadow-lg hover:shadow-xl">
                <span class="iconify lucide--palette size-6" />
            </label>
            <Rightbar />
        </div>
    </div>
</template>
