<script setup lang="ts">
import HelpTopic from "./HelpTopic.vue";
import { getSystemFAQs, getUserManagementFAQs, helpTopics } from "./helpers";

definePageMeta({
    layout: "admin",
});
</script>

<template>
    <div class="min-sm:container">
        <div class="bg-primary/10 rounded-box relative w-full overflow-hidden p-6">
            <div class="flex justify-between">
                <div>
                    <div class="flex items-center gap-1">
                        <p class="text-base-content/80 text-sm">Pages</p>
                        <span class="iconify lucide--chevron-right text-base-content/80 size-3.5" />
                        <p class="text-sm">Support</p>
                    </div>
                    <p class="text-primary mt-4 text-xl font-medium">Get Help</p>
                    <p class="text-base-content/80">
                        Find answers to common questions and learn how to use the platform effectively
                    </p>
                </div>
                <div class="flex flex-col items-end justify-between">
                    <button class="btn btn-sm btn-primary max-xl:btn-square">
                        <span class="iconify lucide--plus size-4" />
                        <span class="max-xl:hidden">Create a Ticket</span>
                    </button>
                    <div class="text-base-content/60 flex items-center gap-2 max-xl:hidden">
                        <span class="iconify lucide--ticket-check size-4" />
                        <p class="text-sm">Your last ticket has been resolved</p>
                    </div>
                </div>
            </div>
            <span class="iconify lucide--badge-help text-primary/5 absolute start-1/2 -bottom-12 size-44 -rotate-25" />
        </div>

        <div class="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <HelpTopic v-for="(topic, index) in helpTopics" :key="index" v-bind="topic" />
        </div>

        <p class="mt-12 text-center text-2xl font-medium">Frequently Asked Questions</p>
        <p class="text-base-content/80 text-center">
            Find answers to common questions about system features, settings, and troubleshooting.
        </p>

        <div class="mt-8 grid gap-8 md:grid-cols-2">
            <div class="card bg-base-100 h-fit shadow">
                <div class="card-body pb-0">
                    <div class="badge badge-sm badge-ghost">Control</div>
                    <p class="text-lg font-medium">User Management queries</p>
                    <div class="-mx-4 mt-2">
                        <div
                            v-for="(faq, index) in getUserManagementFAQs"
                            :key="'user-' + index"
                            class="collapse-plus collapse">
                            <input type="radio" name="accordion" aria-label="Accordion radio" class="cursor-pointer" />
                            <div class="collapse-title cursor-pointer">{{ faq.question }}</div>
                            <div class="collapse-content">{{ faq.answer }}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card bg-base-100 h-fit shadow">
                <div class="card-body pb-0">
                    <div class="badge badge-sm badge-ghost">Platform</div>
                    <p class="text-lg font-medium">System related queries</p>
                    <div class="-mx-4 mt-2">
                        <div
                            v-for="(faq, index) in getSystemFAQs"
                            :key="'system-' + index"
                            class="collapse-plus collapse">
                            <input type="radio" name="accordion" aria-label="Accordion radio" class="cursor-pointer" />
                            <div class="collapse-title cursor-pointer">{{ faq.question }}</div>
                            <div class="collapse-content">{{ faq.answer }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
