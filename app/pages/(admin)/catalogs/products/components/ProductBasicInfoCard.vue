<script setup lang="ts">
import RichTextEditor from "~/components/RichTextEditor.vue";

interface Props {
    name: string;
    slug: string;
    description: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
    'update:name': [value: string];
    'update:slug': [value: string];
    'update:description': [value: string];
}>();

const localName = computed({
    get: () => props.name,
    set: (value) => emit('update:name', value),
});

const localSlug = computed({
    get: () => props.slug,
    set: (value) => emit('update:slug', value),
});

const localDescription = computed({
    get: () => props.description,
    set: (value) => emit('update:description', value),
});
</script>

<template>
    <div class="card bg-base-100 shadow">
        <div class="card-body">
            <h3 class="card-title text-lg flex items-center gap-2">
                <span class="iconify lucide--file-text text-primary" />
                Basic Information
            </h3>
            <fieldset class="fieldset mt-4 space-y-4">
                <div class="space-y-2">
                    <label class="fieldset-label" for="name">
                        Product Name <span class="text-error">*</span>
                    </label>
                    <input
                        id="name"
                        v-model="localName"
                        type="text"
                        class="input w-full"
                        placeholder="Enter product name"
                        required
                    />
                </div>
                <div class="space-y-2">
                    <label class="fieldset-label" for="slug">URL Slug</label>
                    <input
                        id="slug"
                        v-model="localSlug"
                        type="text"
                        class="input w-full bg-base-200"
                        placeholder="Auto-generated from name"
                        readonly
                    />
                    <p class="text-base-content/60 text-xs flex items-center gap-1">
                        <span class="iconify lucide--info size-3" />
                        Auto-generated from product name
                    </p>
                </div>
                <div class="space-y-2">
                    <label class="fieldset-label" for="description">Description</label>
                    <RichTextEditor
                        v-model="localDescription"
                        placeholder="Describe your product in detail..."
                    />
                </div>
            </fieldset>
        </div>
    </div>
</template>
