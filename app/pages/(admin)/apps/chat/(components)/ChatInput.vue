<script setup lang="ts">
export type IChatInput = {
    onSendMessage(message: string): void;
};
const props = defineProps<IChatInput>();

function onSubmit(e: Event) {
    e.preventDefault();
    const target = e.target as HTMLFormElement;
    const data = new FormData(target);
    const message = (data.get("message") as string) ?? "A new message";
    props.onSendMessage(message);
    target.reset();
}
</script>

<template>
    <form class="bg-base-200 flex items-center gap-3 p-4" @submit="onSubmit">
        <button class="btn btn-ghost btn-sm btn-circle" aria-label="Attachment" type="button">
            <span class="iconify lucide--paperclip size-4.5" />
        </button>
        <input
            class="input validator grow"
            name="message"
            type="text"
            required
            aria-label="Message"
            placeholder="Type a message..." />
        <button class="btn btn-primary btn-circle btn-sm" type="submit" aria-label="Send message">
            <span class="iconify lucide--send-horizonal size-4.5" />
        </button>
    </form>
</template>
