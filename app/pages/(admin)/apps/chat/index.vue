<script setup lang="ts">
import type { IChatItem } from "./(components)/ChatItem.vue";
import ChatList from "./(components)/ChatList.vue";
import ChatMessageList from "./(components)/ChatMessageList.vue";
import { chatsData } from "./data";

const selectedChat = ref(chatsData[0]);

const onSubmit = (message: string) => {
    if (selectedChat.value) {
        selectedChat.value.messages.push({
            message,
            sendAt: "05:59 PM",
            sender: "me",
        });
    }
};

const selectChat = (chat: IChatItem) => {
    selectedChat.value = chat;
};
definePageMeta({
    layout: "admin",
});
</script>
<template>
    <div>
        <PageTitle title="Chat" :items="[{ label: 'Apps' }, { label: 'Chat', active: true }]" />
        <div class="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div class="lg:col-span-5 xl:col-span-4 2xl:col-span-3">
                <ChatList :chats="chatsData" :selected="selectedChat" :select-chat="selectChat" />
            </div>
            <div class="lg:col-span-7 xl:col-span-8 2xl:col-span-9">
                <ChatMessageList :on-send-message="onSubmit" :chat="selectedChat" />
            </div>
        </div>
    </div>
</template>
