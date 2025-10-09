<script setup lang="ts">
import AnalyticsTitleDemo from "./AnalyticsTitleDemo.vue";
import EcommerceTitleDemo from "./EcommerceTitleDemo.vue";
import EditorTitleDemo from "./EditorTitleDemo.vue";
import MinimalTitleDemo from "./MinimalTitleDemo.vue";
import StepperTitleDemo from "./StepperTitleDemo.vue";
import TaskTitleDemo from "./TaskTitleDemo.vue";
import TopbarWithTitleDemo from "./TopbarWithTitleDemo.vue";

definePageMeta({
    layout: "components",
});
</script>
<template>
    <div>
        <ComponentPageTitle
            label="Layouts"
            title="Page Title"
            description="Flexible page title layouts with support for actions, breadcrumbs, tabs, stats, or progress." />

        <p class="text-base-content/60 mt-6 font-medium lg:mt-12">Demos</p>

        <div class="mt-6 space-y-6">
            <div class="card card-border bg-base-100">
                <div class="bg-base-200/30 rounded-t-box px-5 py-3 font-medium">Minimal</div>
                <div
                    class="to-base-200/20 text-base-content/25 flex h-24 w-full items-center justify-center bg-linear-to-b from-transparent">
                    Topbar
                </div>
                <div class="bg-base-100 rounded-box px-4 py-3 shadow">
                    <MinimalTitleDemo />
                </div>
                <div
                    class="to-base-200/20 text-base-content/25 flex h-32 w-full items-center justify-center bg-linear-to-t from-transparent">
                    Content
                </div>
            </div>
            <div class="card card-border bg-base-100">
                <div class="bg-base-200/30 rounded-t-box px-5 py-3 font-medium">Ecommerce</div>
                <div
                    class="to-base-200/20 text-base-content/25 flex h-24 w-full items-center justify-center bg-linear-to-b from-transparent">
                    Topbar
                </div>
                <div class="bg-base-100 rounded-box px-4 py-3 shadow">
                    <EcommerceTitleDemo />
                </div>
                <div
                    class="to-base-200/20 text-base-content/25 flex h-32 w-full items-center justify-center bg-linear-to-t from-transparent">
                    Content
                </div>
            </div>
            <div class="card card-border bg-base-100">
                <div class="bg-base-200/30 rounded-t-box px-5 py-3 font-medium">Editor</div>
                <div
                    class="to-base-200/20 text-base-content/25 flex h-24 w-full items-center justify-center bg-linear-to-b from-transparent">
                    Topbar
                </div>
                <div class="bg-base-100 rounded-box px-4 py-3 shadow">
                    <EditorTitleDemo />
                </div>
                <div
                    class="to-base-200/20 text-base-content/25 flex h-32 w-full items-center justify-center bg-linear-to-t from-transparent">
                    Content
                </div>
            </div>

            <div class="card card-border bg-base-100">
                <div class="bg-base-200/30 rounded-t-box px-5 py-3 font-medium">Task</div>
                <div
                    class="to-base-200/20 text-base-content/25 flex h-24 w-full items-center justify-center bg-linear-to-b from-transparent">
                    Topbar
                </div>
                <div class="bg-base-100 rounded-box px-4 py-3 shadow">
                    <TaskTitleDemo />
                </div>
                <div
                    class="to-base-200/20 text-base-content/25 flex h-32 w-full items-center justify-center bg-linear-to-t from-transparent">
                    Content
                </div>
            </div>
            <div class="card card-border bg-base-100">
                <div class="bg-base-200/30 rounded-t-box px-5 py-3 font-medium">Stepper</div>
                <div
                    class="to-base-200/20 text-base-content/25 flex h-24 w-full items-center justify-center bg-linear-to-b from-transparent">
                    Topbar
                </div>
                <div class="bg-base-100 rounded-box px-4 py-3 shadow">
                    <StepperTitleDemo />
                </div>
                <div
                    class="to-base-200/20 text-base-content/25 flex h-32 w-full items-center justify-center bg-linear-to-t from-transparent">
                    Content
                </div>
            </div>
            <div class="card card-border bg-base-100">
                <div class="bg-base-200/30 rounded-t-box px-5 py-3 font-medium">Analytics</div>
                <div
                    class="to-base-200/20 text-base-content/25 flex h-24 w-full items-center justify-center bg-linear-to-b from-transparent">
                    Topbar
                </div>
                <div class="bg-base-100 rounded-box px-4 py-3 shadow">
                    <AnalyticsTitleDemo />
                </div>
                <div
                    class="to-base-200/20 text-base-content/25 flex h-32 w-full items-center justify-center bg-linear-to-t from-transparent">
                    Content
                </div>
            </div>
            <div class="card card-border bg-base-100">
                <div class="bg-base-200/30 rounded-t-box px-5 py-3 font-medium">Topbar & Title</div>
                <div class="bg-base-100 rounded-box shadow">
                    <TopbarWithTitleDemo />
                </div>
                <div
                    class="to-base-200/20 text-base-content/25 flex h-32 w-full items-center justify-center bg-linear-to-t from-transparent">
                    Content
                </div>
            </div>
        </div>
    </div>
</template>
