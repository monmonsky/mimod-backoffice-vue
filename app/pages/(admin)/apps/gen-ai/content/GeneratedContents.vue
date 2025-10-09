<script lang="ts" setup>
// @ts-ignore
import SimpleBar from "simplebar";
import "simplebar/dist/simplebar.min.css";

import ContentItem from "./ContentItem.vue";

const scrollRef = ref<HTMLElement | null>(null);

onMounted(() => {
    if (scrollRef.value) {
        new SimpleBar(scrollRef.value);
    }
});
</script>
<template>
    <div class="bg-base-100 card card-border">
        <div class="border-base-200 flex items-center justify-between border-b py-2.5 ps-5 pe-2.5">
            <div class="inline-flex items-center gap-3">
                <span class="iconify lucide--file-clock size-4.5" />
                <span>History</span>
            </div>
            <button class="btn btn-ghost btn-sm">Clear history</button>
        </div>
        <div class="card-body p-0">
            <div ref="scrollRef" class="h-[calc(100vh_-_220px)]">
                <div class="space-y-3 p-6 pt-3">
                    <div class="text-center">
                        <div
                            class="bg-base-200 inline-flex cursor-pointer items-center gap-1 rounded-full px-3 py-1 text-xs opacity-70 transition-all hover:opacity-100">
                            <span class="iconify lucide--arrow-up size-3" />
                            Older
                        </div>
                    </div>
                    <ContentItem
                        content="Can you provide an estimated timeline for completion?"
                        time-since="Weeks ago" />
                    <ContentItem
                        :is-response="true"
                        content="Certainly! Based on our current progress, we estimate the project will be completed within 4-6 weeks. Let me know if you’d like a detailed breakdown."
                        time-since="Week ago" />
                    <ContentItem content="Can you generate a random image?" time-since="30 minutes ago" />
                    <ContentItem
                        :is-response="true"
                        image="/images/apps/ai/gen-10.jpg"
                        time-since="30 minutes ago"
                        content="Here is your random image." />
                    <ContentItem content="Do you have any suggestions for improvement?" time-since="2 hours ago" />
                    <ContentItem
                        :is-response="true"
                        content="Certainly! One suggestion would be to focus more on user feedback during the early stages of development."
                        time-since="2 hours ago" />
                    <ContentItem content="What are the next steps?" time-since="1 minute ago" />
                    <ContentItem
                        :is-response="true"
                        content="Next, we can schedule a meeting to discuss the implementation details. Does that work for you?"
                        time-since="Now" />
                    <ContentItem content="Follow-Up on all conversations" time-since="now" />
                    <div class="bg-primary/5 text-primary border-primary/10 rounded-box inline border px-4 py-2">
                        <span class="loading loading-dots loading-sm" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
