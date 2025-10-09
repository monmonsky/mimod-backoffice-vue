<script setup lang="ts">
// @ts-ignore
import SimpleBar from "simplebar";

import ChatCallModal from "./ChatCallModal.vue";
import ChatInput from "./ChatInput.vue";
import type { IChatInput } from "./ChatInput.vue";
import type { IChatItem } from "./ChatItem.vue";
import ChatMessageItem from "./ChatMessageItem.vue";

export type IChatMessageList = {
    chat: IChatItem;
} & IChatInput;

const props = defineProps<IChatMessageList>();
const messagesListRef = ref<HTMLDivElement | null>(null);
let simpleBarRef: SimpleBar | null = null;

const scrollToBottom = () => {
    setTimeout(() => {
        const scrollElement = simpleBarRef.getScrollElement();
        if (scrollElement) {
            scrollElement.scrollTo({ top: scrollElement.scrollHeight, behavior: "smooth" });
        }
    }, 10);
};

onMounted(() => {
    if (messagesListRef.value) {
        simpleBarRef = new SimpleBar(messagesListRef.value);
        scrollToBottom();
    }
});

watch(props.chat, scrollToBottom, { deep: true });

const openChatCallModal = () => {
    const modal = document.querySelector<HTMLDialogElement>("#apps-chat-call-modal");
    if (modal) {
        modal.showModal();
    }
};
</script>

<template>
    <div class="card bg-base-100 shadow">
        <div class="flex items-center gap-3 px-4 py-3">
            <img :src="chat.image" class="size-10 max-sm:size-8" alt="avatar" />
            <div class="mt-1.5 grow">
                <p class="leading-none font-medium max-sm:text-sm">{{ chat.name }}</p>
                <div class="mt-0.5 flex items-center gap-2">
                    <div class="status status-success" />
                    <p class="text-base-content/80 text-xs">Active</p>
                </div>
            </div>
            <div class="tooltip" data-tip="Audio Call">
                <button
                    class="btn btn-outline border-base-300 btn-square btn-sm"
                    aria-label="Audio Call"
                    @click="openChatCallModal">
                    <span class="iconify lucide--phone size-4" />
                </button>
            </div>
            <div class="tooltip max-sm:hidden" data-tip="Video Call">
                <button class="btn btn-outline border-base-300 btn-square btn-sm" aria-label="Video Call">
                    <span class="iconify lucide--video size-4" />
                </button>
            </div>
            <div class="tooltip max-sm:hidden" data-tip="Add to Friend">
                <button class="btn btn-outline border-base-300 btn-square btn-sm" aria-label="Add to Friend">
                    <span class="iconify lucide--user-plus size-4" />
                </button>
            </div>
            <div class="dropdown dropdown-bottom dropdown-end">
                <div
                    tabindex="0"
                    role="button"
                    class="btn btn-outline btn-square btn-sm border-base-300"
                    aria-label="More options">
                    <span class="iconify lucide--more-vertical size-4" />
                </div>
                <div tabindex="0" class="dropdown-content bg-base-100 rounded-box mt-2 w-52 shadow">
                    <ul class="menu w-full p-2">
                        <li>
                            <div>
                                <span class="iconify lucide--square-user size-4" />
                                View Profile
                            </div>
                        </li>
                        <li>
                            <div>
                                <span class="iconify lucide--pin size-4" />
                                Pin
                            </div>
                        </li>
                        <li>
                            <div>
                                <span class="iconify lucide--bell-dot size-4" />
                                Mute Notification
                            </div>
                        </li>
                    </ul>
                    <hr class="border-base-300" />
                    <ul class="menu w-full p-2">
                        <li>
                            <div>
                                <span class="iconify lucide--archive size-4" />
                                Archive
                            </div>
                        </li>
                        <li>
                            <div class="text-error hover:bg-error/10">
                                <span class="iconify lucide--trash size-4" />
                                Delete Chat
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <hr class="border-base-300" />
        <div ref="messagesListRef" class="h-[calc(100vh_-_320px)] p-5">
            <ChatMessageItem v-for="(message, index) in chat.messages" :key="index" :chat="chat" :message="message" />
        </div>
        <ChatInput :on-send-message="onSendMessage" />
        <ChatCallModal :chat="chat" />
    </div>
</template>
