<script setup lang="ts">
import DocumentationSearchDemo from "./DocumentationSearchDemo.vue";
import DrawerSearchDemo from "./DrawerSearchDemo.vue";
import FileSearchDemo from "./FileSearchDemo.vue";
import InlineSearchDemo from "./InlineSearchDemo.vue";
import MinimalSearchDemo from "./MinimalSearchDemo.vue";
import ProjectSearchDemo from "./ProjectSearchDemo.vue";
import SmartSearchDemo from "./SmartSearchDemo.vue";
import SplitSearchDemo from "./SplitSearchDemo.vue";

definePageMeta({
    layout: "components",
});
</script>

<template>
    <div>
        <ComponentPageTitle
            label="Layouts"
            title="Search"
            description="Showcasing multiple search interface patterns for modern web applications" />
        <p class="text-base-content/60 mt-6 font-medium lg:mt-12">Demos</p>

        <div class="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div class="card card-border bg-base-100">
                <div class="bg-base-200/30 rounded-t-box px-5 py-3 font-medium">Minimal</div>
                <div class="flex items-center justify-center p-6">
                    <MinimalSearchDemo />
                </div>
            </div>
            <div class="card card-border bg-base-100">
                <div class="bg-base-200/30 rounded-t-box px-5 py-3 font-medium">Split</div>
                <div class="flex items-center justify-center p-6">
                    <SplitSearchDemo />
                </div>
            </div>
            <div class="card card-border bg-base-100">
                <div class="bg-base-200/30 rounded-t-box px-5 py-3 font-medium">Smart</div>
                <div class="flex items-center justify-center p-6">
                    <SmartSearchDemo />
                </div>
            </div>
            <div class="card card-border bg-base-100">
                <div class="bg-base-200/30 rounded-t-box px-5 py-3 font-medium">Project</div>
                <div class="flex items-center justify-center p-6">
                    <ProjectSearchDemo />
                </div>
            </div>
            <div class="card card-border bg-base-100">
                <div class="bg-base-200/30 rounded-t-box px-5 py-3 font-medium">Inline</div>
                <div class="flex items-center justify-center p-6">
                    <InlineSearchDemo />
                </div>
            </div>
            <div class="card card-border bg-base-100">
                <div class="bg-base-200/30 rounded-t-box px-5 py-3 font-medium">File</div>
                <div class="flex items-center justify-center p-6">
                    <FileSearchDemo />
                </div>
            </div>
            <div class="card card-border bg-base-100">
                <div class="bg-base-200/30 rounded-t-box px-5 py-3 font-medium">Drawer</div>
                <div class="flex items-center justify-center p-6">
                    <DrawerSearchDemo />
                </div>
            </div>
            <div class="card card-border bg-base-100">
                <div class="bg-base-200/30 rounded-t-box px-5 py-3 font-medium">Documentation</div>
                <div class="flex items-center justify-center p-6">
                    <DocumentationSearchDemo />
                </div>
            </div>
        </div>
    </div>
</template>
