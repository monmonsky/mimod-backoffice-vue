<template>
    <div class="card bg-base-200/50 max-w-2xl grow p-1.5 pt-0">
        <div class="flex items-center justify-between gap-2 px-3 py-2.5">
            <p class="text-base-content/80 text-sm">
                Saved to
                <span class="cursor-pointer italic underline">Library</span>
            </p>
            <p class="text-base-content/60 text-xs font-medium">
                <span class="text-error">58</span>
                Tokens left
            </p>
        </div>
        <div class="card-body bg-base-100 rounded-box p-3 shadow-xs">
            <textarea
                aria-label="Textarea"
                class="textarea m-0 h-28 w-full resize-none border-0 p-1 text-base focus:outline-none"
                placeholder="Type your request and choose an ability to enhance it" />
            <div class="mt-2 flex items-end justify-between">
                <div class="flex items-center gap-0.5">
                    <div class="dropdown dropdown-start">
                        <div
                            tabindex="0"
                            role="button"
                            class="btn btn-sm btn-ghost gap-2"
                            aria-label="Ability Selector">
                            <i class="iconify lucide--zap size-4" />
                            <p>Ability</p>
                            <i class="iconify lucide--chevron-down size-3.5" />
                        </div>
                        <ul tabindex="0" class="dropdown-content bg-base-100 rounded-box menu mt-2 w-56 p-1.5 shadow">
                            <li>
                                <div class="flex items-center gap-2.5">
                                    <i class="iconify lucide--eye size-4 opacity-80" />
                                    Vision
                                </div>
                            </li>
                            <li>
                                <div class="flex items-center gap-2.5">
                                    <i class="iconify lucide--globe size-4 opacity-80" />
                                    Browsing
                                </div>
                            </li>
                            <li>
                                <div class="flex items-center gap-2.5">
                                    <i class="iconify lucide--mic size-4 opacity-80" />
                                    Voice Input
                                </div>
                            </li>
                            <li>
                                <div class="flex items-center gap-2.5">
                                    <i class="iconify lucide--video size-4 opacity-80" />
                                    Video Understanding
                                </div>
                            </li>
                            <li>
                                <div class="flex items-center gap-2.5">
                                    <i class="iconify lucide--image size-4 opacity-80" />
                                    Image Generation
                                </div>
                            </li>
                            <li>
                                <div class="flex items-center gap-2.5">
                                    <i class="iconify lucide--file-text size-4 opacity-80" />
                                    Document Analysis
                                </div>
                            </li>
                            <li>
                                <div class="flex items-center gap-2.5">
                                    <i class="iconify lucide--code size-4 opacity-80" />
                                    Code Writing
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="flex items-center gap-1">
                    <button class="btn btn-sm btn-square btn-ghost" aria-label="Add Action">
                        <span class="iconify lucide--plus-circle text-base-content/60 size-4" />
                    </button>
                    <button class="btn btn-sm btn-square btn-ghost" aria-label="Voice Input">
                        <span class="iconify lucide--mic text-base-content/60 size-4" />
                    </button>
                    <button class="btn btn-primary btn-sm gap-2" aria-label="Send Prompt">
                        <span class="iconify lucide--send size-3.5" />
                        Send
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
