<script setup lang="ts">
import ClassicTopbarDemo from "./ClassicTopbarDemo.vue";
import CustomBackgroundTopbarDemo from "./CustomBackgroundTopbarDemo.vue";
import EditorTopbarDemo from "./EditorTopbarDemo.vue";
import GreetingTopbarDemo from "./GreetingTopbarDemo.vue";
import NavMenu1TopbarDemo from "./NavMenu1TopbarDemo.vue";
import NavMenu2TopbarDemo from "./NavMenu2TopbarDemo.vue";

definePageMeta({
    layout: "components",
});
</script>

<template>
    <div>
        <ComponentPageTitle
            label="Layouts"
            title="Topbar"
            description="Topbar demos show basic layouts, greetings, navigation menus, and editor integration options" />

        <div class="bg-base-200/40 rounded-box mt-6 flex items-center gap-3 px-5 py-4 lg:mt-12">
            <span class="iconify lucide--info text-base-content/70 size-4.5" />
            <p>
                <span class="me-1">Play with layouts using</span>
                <NuxtLink href="/layout-builder" target="_blank" class="text-primary"> Layout Builder </NuxtLink>
            </p>
        </div>

        <p class="text-base-content/60 mt-6 font-medium">Demos</p>

        <div class="mt-6 space-y-6 pb-20">
            <div class="card bg-base-100 card-border">
                <div class="bg-base-200/30 rounded-t-box px-5 py-3 font-medium">Classic</div>
                <div class="h-15">
                    <ClassicTopbarDemo />
                </div>
            </div>
            <div class="card bg-base-100 card-border">
                <div class="bg-base-200/30 rounded-t-box px-5 py-3 font-medium">Greeting</div>
                <div class="h-15">
                    <GreetingTopbarDemo />
                </div>
            </div>
            <div class="card bg-base-100 card-border">
                <div class="bg-base-200/30 rounded-t-box px-5 py-3 font-medium">Nav Menu 1</div>
                <div class="h-15">
                    <NavMenu1TopbarDemo />
                </div>
            </div>

            <div class="card bg-base-100 card-border">
                <div class="bg-base-200/30 rounded-t-box px-5 py-3 font-medium">Nav Menu 2</div>
                <div class="h-15">
                    <NavMenu2TopbarDemo />
                </div>
            </div>
            <div class="card bg-base-100 card-border">
                <div class="bg-base-200/30 rounded-t-box px-5 py-3 font-medium">Editor</div>
                <div class="h-15">
                    <EditorTopbarDemo />
                </div>
            </div>
            <div class="card bg-base-100 card-border">
                <div class="bg-base-200/30 rounded-t-box px-5 py-3 font-medium">Custom Background</div>
                <div class="h-15">
                    <CustomBackgroundTopbarDemo />
                </div>
            </div>
        </div>
    </div>
</template>
