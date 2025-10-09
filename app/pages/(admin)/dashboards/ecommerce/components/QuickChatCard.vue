<script setup lang="ts">
import QuickChatItem from "./QuickChatItem.vue";

interface IQuickChatItem {
    image: string;
    name: string;
    time: string;
    message: string;
}

const quickChats: IQuickChatItem[] = [
    {
        image: "/images/avatars/1.png",
        name: "Mia Johnson",
        time: "11:35 AM",
        message: "It's called 'Dreamscape.' A must-watch!",
    },
    {
        image: "/images/avatars/2.png",
        name: "Ethan Patel",
        time: "09:58 AM",
        message: "Just got a new book. Excited to start reading.",
    },
    {
        image: "/images/avatars/3.png",
        name: "Sophia Nguyen",
        time: "08:20 AM",
        message: "How's your day going?",
    },
    {
        image: "/images/avatars/4.png",
        name: "Emily Chen",
        time: "06:21 PM",
        message: "Did you see that amazing sunset yesterday?",
    },
    {
        image: "/images/avatars/5.png",
        name: "Kelvin S.",
        time: "08:15 AM",
        message: "Not sure, what you talking about...",
    },
];
</script>
<template>
    <div class="card bg-base-100 shadow">
        <div class="card-body pb-3">
            <div class="flex items-center gap-3">
                <span class="iconify lucide--messages-square size-4.5" />
                <span class="font-medium">Quick Chat</span>
                <NuxtLink href="/apps/chat" class="btn btn-outline btn-sm border-base-300 ms-auto">Go To Chat</NuxtLink>
            </div>
            <div class="-mx-2 mt-2 space-y-0.5">
                <QuickChatItem
                    v-for="(chat, index) in quickChats"
                    :key="index"
                    :image="chat.image"
                    :name="chat.name"
                    :time="chat.time"
                    :message="chat.message" />
            </div>
        </div>
    </div>
</template>
