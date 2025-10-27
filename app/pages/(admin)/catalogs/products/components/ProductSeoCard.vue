<script setup lang="ts">
const props = defineProps<{
    title: string;
    description: string;
    keywords: string;
    generatingSeo: boolean;
    canGenerate: boolean;
}>();

const emit = defineEmits<{
    'update:title': [value: string];
    'update:description': [value: string];
    'update:keywords': [value: string];
    'generate': [];
}>();

const localTitle = computed({
    get: () => props.title,
    set: (value) => emit('update:title', value),
});

const localDescription = computed({
    get: () => props.description,
    set: (value) => emit('update:description', value),
});

const localKeywords = computed({
    get: () => props.keywords,
    set: (value) => emit('update:keywords', value),
});

const handleGenerate = () => {
    emit('generate');
};
</script>

<template>
    <div class="card bg-base-100 shadow">
        <div class="card-body">
            <div class="flex items-center justify-between">
                <h3 class="card-title text-lg flex items-center gap-2">
                    <span class="iconify lucide--search text-primary" />
                    SEO Meta Information
                </h3>
                <button
                    type="button"
                    @click="handleGenerate"
                    class="btn btn-primary btn-sm"
                    :disabled="generatingSeo || !canGenerate">
                    <span v-if="generatingSeo" class="loading loading-spinner loading-xs"></span>
                    <span v-else class="iconify lucide--sparkles size-4" />
                    {{ generatingSeo ? "Generating..." : "Generate by AI" }}
                </button>
            </div>
            <div class="mt-4 space-y-4">
                <div class="space-y-2">
                    <label class="fieldset-label text-sm" for="seo_title">
                        SEO Title
                    </label>
                    <input
                        id="seo_title"
                        v-model="localTitle"
                        type="text"
                        class="input input-sm w-full"
                        placeholder="SEO Title untuk Google Search"
                        maxlength="60" />
                    <p class="text-base-content/60 text-xs">
                        Recommended: 50-60 characters ({{ localTitle.length }}/60)
                    </p>
                </div>
                <div class="space-y-2">
                    <label class="fieldset-label text-sm" for="seo_description">
                        SEO Meta Description
                    </label>
                    <textarea
                        id="seo_description"
                        v-model="localDescription"
                        placeholder="Meta description untuk snippet Google Search Results"
                        class="textarea textarea-sm w-full"
                        rows="3"
                        maxlength="160"></textarea>
                    <p class="text-base-content/60 text-xs">
                        Recommended: 120-160 characters ({{ localDescription.length }}/160)
                    </p>
                </div>
                <div class="space-y-2">
                    <label class="fieldset-label text-sm" for="seo_keywords">
                        SEO Keywords
                    </label>
                    <input
                        id="seo_keywords"
                        v-model="localKeywords"
                        type="text"
                        class="input input-sm w-full"
                        placeholder="keyword1, keyword2, keyword3" />
                    <p class="text-base-content/60 text-xs">
                        Separate keywords with commas
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>
