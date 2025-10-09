<template>
    <div class="card bg-base-100 card-border max-w-2xl grow">
        <div class="card-body p-3">
            <textarea
                aria-label="Textarea"
                class="textarea m-0 h-28 w-full resize-none border-0 p-1 text-base focus:outline-none"
                placeholder="Type your request or attach files to get started" />
            <div class="mt-2 flex items-end justify-between">
                <div class="flex items-center gap-2">
                    <button class="btn btn-sm btn-outline border-base-300 text-base-content/80">
                        <span class="iconify lucide--plus-circle size-4" />
                        Add File
                    </button>
                    <button class="btn btn-sm btn-outline border-base-300 text-base-content/80">
                        <span class="iconify lucide--brain size-4" />
                        Deep Thinking
                    </button>
                    <button class="btn btn-sm btn-outline border-base-300 text-base-content/80">
                        <span class="iconify lucide--globe size-4" />
                        Browsing
                    </button>
                </div>
                <div class="flex items-center gap-2">
                    <button class="btn btn-sm btn-square btn-ghost" aria-label="Voice Input">
                        <span class="iconify lucide--mic text-base-content/60 size-4" />
                    </button>
                    <button class="btn btn-primary btn-square btn-sm" aria-label="Send">
                        <span class="iconify lucide--arrow-up size-4" />
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
