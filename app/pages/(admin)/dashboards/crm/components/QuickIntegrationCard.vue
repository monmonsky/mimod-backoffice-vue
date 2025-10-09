<script setup lang="ts">
import QuickIntegrationItem, { type IQuickIntegrationItem } from "./QuickIntegrationItem.vue";

const quickIntegrationItems: IQuickIntegrationItem[] = [
    {
        name: "Salesforce",
        image: "/images/brand-logo/salesforce.svg",
        description: "Salesforce provides customer relationship management software and application focused on sales",
        isConnected: false,
    },
    {
        name: "Asana",
        image: "/images/brand-logo/asana.svg",
        description: "Track, manage and connect your project across any team.",
        isConnected: true,
    },
    {
        name: "Slack",
        image: "/images/brand-logo/slack.svg",
        description: "Slack is a new way to communicate with your team.",
        isConnected: false,
    },
    {
        name: "Notion",
        image: "/images/brand-logo/notion.svg",
        description: "Notion is a freemium productivity and note-taking web application developed by Notion Lab Inc.",
        isConnected: true,
    },
    {
        name: "Hubspot",
        image: "/images/brand-logo/hubspot.svg",
        description: "Hubspot is a CRM platform with all the software, integrations and resources you need to connect",
        isConnected: true,
    },
];
</script>
<template>
    <div class="card bg-base-100 shadow">
        <div class="card-body">
            <div class="flex items-center gap-2">
                <span class="iconify lucide--unplug text-base-content/80 size-4.5" />
                <p class="grow font-medium">Quick Integration</p>
                <button class="btn btn-ghost btn-sm border-base-300">
                    <span class="iconify lucide--settings-2 size-3.5" />
                    Manage
                </button>
            </div>
            <div class="mt-4 space-y-3.5">
                <QuickIntegrationItem
                    v-for="(integration, index) in quickIntegrationItems"
                    :key="index"
                    :name="integration.name"
                    :image="integration.image"
                    :description="integration.description"
                    :is-connected="integration.isConnected" />
            </div>
        </div>
    </div>
</template>
