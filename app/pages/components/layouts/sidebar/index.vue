<script setup lang="ts">
import ChatSidebarDemo from "./ChatSidebarDemo.vue";
import CustomBackgroundSidebarDemo from "./CustomBackgroundSidebarDemo.vue";
import DocumentationSidebarDemo from "./DocumentationSidebarDemo.vue";
import EcommerceSidebarDemo from "./EcommerceSidebarDemo.vue";
import HugeIconsSidebarDemo from "./HugeIconsSidebarDemo.vue";
import PaymentSidebarDemo from "./PaymentSidebarDemo.vue";
import ProjectSidebarDemo from "./ProjectSidebarDemo.vue";
import RemixIconsSidebarDemo from "./RemixIconsSidebarDemo.vue";

definePageMeta({
    layout: "components",
});
</script>

<template>
    <div>
        <ComponentPageTitle
            label="Layouts"
            title="Sidebar"
            description="Custom sidebar layouts with icons, project menus, docs view, and background styling options" />
        <div class="bg-base-200/40 rounded-box mt-6 flex items-center gap-3 px-5 py-4 lg:mt-12">
            <span class="iconify lucide--info text-base-content/70 size-4.5" />
            <p>
                <span class="me-1">Play with layouts using</span>
                <NuxtLink href="/layout-builder" target="_blank" class="text-primary"> Layout Builder </NuxtLink>
            </p>
        </div>
        <p class="text-base-content/60 mt-6 font-medium">Demos</p>
        <div class="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2 xl:gap-8">
            <div class="card bg-base-100 card-border overflow-hidden">
                <div class="bg-base-200/30 px-5 py-3 font-medium">Ecommerce</div>
                <div class="flex items-center justify-center p-6 md:p-8">
                    <div class="border-base-200 rounded-box h-full min-h-[85vh] w-64 border shadow-xs">
                        <EcommerceSidebarDemo />
                    </div>
                </div>
            </div>
            <div class="card bg-base-100 card-border overflow-hidden">
                <div class="bg-base-200/30 px-5 py-3 font-medium">Payment</div>
                <div class="flex items-center justify-center p-6 md:p-8">
                    <div class="border-base-200 rounded-box h-full min-h-[85vh] w-64 border shadow-xs">
                        <PaymentSidebarDemo />
                    </div>
                </div>
            </div>
            <div class="card bg-base-100 card-border overflow-hidden">
                <div class="bg-base-200/30 px-5 py-3 font-medium">Project</div>
                <div class="flex items-center justify-center p-6 md:p-8">
                    <div class="border-base-200 rounded-box h-full min-h-[85vh] w-64 border shadow-xs">
                        <ProjectSidebarDemo />
                    </div>
                </div>
            </div>
            <div class="card bg-base-100 card-border overflow-hidden">
                <div class="bg-base-200/30 px-5 py-3 font-medium">Chat</div>
                <div class="flex items-center justify-center p-6 md:p-8">
                    <div class="border-base-200 rounded-box h-full min-h-[85vh] w-64 border shadow-xs">
                        <ChatSidebarDemo />
                    </div>
                </div>
            </div>

            <div class="card bg-base-100 card-border overflow-hidden">
                <div class="bg-base-200/30 px-5 py-3 font-medium">Huge Icons</div>
                <div class="flex items-center justify-center p-6 md:p-8">
                    <div class="border-base-200 rounded-box h-full min-h-[85vh] w-64 border shadow-xs">
                        <HugeIconsSidebarDemo />
                    </div>
                </div>
            </div>
            <div class="card bg-base-100 card-border overflow-hidden">
                <div class="bg-base-200/30 px-5 py-3 font-medium">Remix Icons</div>
                <div class="flex items-center justify-center p-6 md:p-8">
                    <div class="border-base-200 rounded-box h-full min-h-[85vh] w-64 border shadow-xs">
                        <RemixIconsSidebarDemo />
                    </div>
                </div>
            </div>
            <div class="card bg-base-100 card-border overflow-hidden">
                <div class="bg-base-200/30 px-5 py-3 font-medium">Documentation</div>
                <div class="flex items-center justify-center p-6 md:p-8">
                    <div class="border-base-200 rounded-box h-full min-h-[85vh] w-64 border shadow-xs">
                        <DocumentationSidebarDemo />
                    </div>
                </div>
            </div>
            <div class="card bg-base-100 card-border overflow-hidden">
                <div class="bg-base-200/30 px-5 py-3 font-medium">Custom Background</div>
                <div class="flex items-center justify-center p-6 md:p-8">
                    <div class="rounded-box h-full min-h-[85vh] w-64 overflow-hidden">
                        <CustomBackgroundSidebarDemo />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
