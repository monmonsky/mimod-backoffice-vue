<template>
    <div class="space-y-6">
        <div class="card bg-base-100 card-border">
            <div class="card-body">
                <div class="card-title">Information</div>
                <div class="fieldset mt-2 gap-4">
                    <div class="space-y-2">
                        <label class="fieldset-label" for="content"> Content </label>
                        <textarea
                            id="content"
                            class="textarea h-36 w-full pb-0 leading-5"
                            placeholder="Join [Company Name] as a UI Designer and craft user-friendly, visually stunning interfaces. Collaborate with..."
                            aria-label="Textarea" />
                    </div>
                    <div class="space-y-2">
                        <label class="fieldset-label" for="keywords"> Keywords are included </label>
                        <input id="keywords" class="input w-full" placeholder="react, dashboard, nextjs, ...." />
                    </div>
                </div>
            </div>
        </div>

        <div class="card bg-base-100 card-border">
            <div class="card-body">
                <div class="card-title">Language options</div>
                <div class="border-success/20 bg-success/5 rounded-box my-2.5 border p-3 text-sm">
                    <span class="font-medium">Beta:</span> This feature is currently accessible to a limited group of
                    beta users.
                </div>
                <div class="fieldset">
                    <div class="flex gap-4">
                        <div class="grow space-y-2">
                            <label class="fieldset-label" for="voice-tone"> Voice Tone </label>
                            <select id="voice-tone" class="select w-full">
                                <option>Formal</option>
                                <option>Casual</option>
                                <option>Persuasive</option>
                                <option>Friendly</option>
                                <option>Neutral</option>
                            </select>
                        </div>
                        <div class="grow space-y-2">
                            <label class="fieldset-label" for="creative"> How creative it be </label>
                            <input
                                id="creative"
                                class="input w-full focus:outline-0"
                                min="0"
                                step="0.1"
                                max="1"
                                value="0.6"
                                type="number"
                                placeholder="0.6" />
                        </div>
                    </div>
                    <div class="mt-2 flex items-end gap-4">
                        <div class="grow space-y-2">
                            <label class="fieldset-label" for="input-voice"> Input Voice </label>
                            <select id="input-voice" class="select w-full">
                                <option value="en" selected>English</option>
                                <option value="es">Spanish</option>
                                <option value="fr">French</option>
                                <option value="de">German</option>
                                <option value="it">Italian</option>
                            </select>
                        </div>
                        <button class="btn btn-sm btn-circle mb-1">
                            <span class="iconify lucide--arrow-left-right size-4" />
                        </button>
                        <div class="grow space-y-2">
                            <label class="fieldset-label" for="output-voice"> Output Voice </label>
                            <select id="output-voice" class="select w-full">
                                <option value="en">English</option>
                                <option value="es">Spanish</option>
                                <option value="fr" selected>French</option>
                                <option value="de">German</option>
                                <option value="it">Italian</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div class="mt-5 flex justify-end gap-3">
                    <button class="btn btn-ghost btn-sm" disabled>Stop</button>
                    <button class="btn btn-sm btn-primary">
                        <span class="iconify lucide--wand-2 size-3.5" />
                        Generate
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
