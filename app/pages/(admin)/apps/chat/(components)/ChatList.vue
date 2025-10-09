<script setup lang="ts">
// @ts-ignore
import SimpleBar from "simplebar";

import ChatItem from "./ChatItem.vue";
import type { IChatMessageItem } from "./ChatItem.vue";

interface IChatItem {
    id: number;
    image: string;
    name: string;
    messages: IChatMessageItem[];
    unreadCount?: number;
}

interface IChatList {
    chats: IChatItem[];
    selected: IChatItem;
    selectChat(chat: IChatItem): void;
}

defineProps<IChatList>();

const chatListRef = ref<HTMLDivElement | null>(null);

onMounted(() => {
    if (chatListRef.value) {
        new SimpleBar(chatListRef.value);
    }
});
</script>

<template>
    <div class="card bg-base-100 shadow">
        <div class="card-body">
            <div class="flex items-center justify-between gap-3">
                <label class="input">
                    <span class="iconify lucide--search text-base-content/80 size-4" />
                    <input aria-label="Search chat" class="grow" placeholder="Search along chats" type="search" />
                </label>
                <div class="tooltip" data-tip="New Contact">
                    <button aria-label="Add New Contact" class="btn btn-outline btn-square border-base-300">
                        <span class="iconify lucide--plus size-4" />
                    </button>
                </div>
            </div>

            <div ref="chatListRef" class="h-[calc(100vh_-_306px)]">
                <div class="mt-4">
                    <div v-for="(chat, index) in chats" :key="index" @click="selectChat(chat)">
                        <ChatItem
                            :image="chat.image"
                            :name="chat.name"
                            :messages="chat.messages"
                            :unread-count="chat.unreadCount"
                            :selected="selected?.id === chat.id" />
                    </div>
                </div>
            </div>

            <div class="mt-3 text-center">
                <button class="btn btn-soft btn-primary btn-sm">
                    <span class="iconify lucide--user-plus size-3.5" />
                    Join a Community
                </button>
            </div>
        </div>
    </div>
</template>
