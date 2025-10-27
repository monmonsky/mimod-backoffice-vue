<script setup lang="ts">
import CategoryTree from "~/components/CategoryTree.vue";

interface Props {
    brandId: string;
    selectedCategories: number[];
    ageMin: number;
    ageMax: number;
    tags: string[];
    status: string;
    isFeatured: boolean;
    brands: any[];
    categories: any[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
    'update:brandId': [value: string];
    'update:selectedCategories': [value: number[]];
    'update:ageMin': [value: number];
    'update:ageMax': [value: number];
    'update:tags': [value: string[]];
    'update:status': [value: string];
    'update:isFeatured': [value: boolean];
}>();

const tagInput = ref('');

const addTag = () => {
    if (tagInput.value.trim() && !props.tags.includes(tagInput.value.trim())) {
        emit('update:tags', [...props.tags, tagInput.value.trim()]);
        tagInput.value = '';
    }
};

const removeTag = (index: number) => {
    const newTags = [...props.tags];
    newTags.splice(index, 1);
    emit('update:tags', newTags);
};

const handleTagKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        addTag();
    }
};
</script>

<template>
    <div class="space-y-4">
        <!-- Brand & Categories -->
        <div class="card bg-base-100 shadow">
            <div class="card-body">
                <h3 class="card-title text-base flex items-center gap-2">
                    <span class="iconify lucide--building-2 text-primary" />
                    Brand & Categories
                </h3>

                <!-- Brand -->
                <div class="space-y-2 mt-4">
                    <label class="fieldset-label text-sm" for="brand">
                        Brand <span class="text-error">*</span>
                    </label>
                    <select
                        id="brand"
                        :value="brandId"
                        @change="emit('update:brandId', ($event.target as HTMLSelectElement).value)"
                        class="select select-sm w-full"
                        required
                    >
                        <option value="" disabled>Select brand</option>
                        <option v-for="brand in brands" :key="brand.id" :value="brand.id">
                            {{ brand.name }}
                        </option>
                    </select>
                </div>

                <!-- Categories Tree -->
                <div class="space-y-2 mt-4">
                    <label class="fieldset-label text-sm">
                        Categories <span class="text-error">*</span>
                    </label>
                    <div class="border border-base-300 rounded-lg p-3 max-h-64 overflow-y-auto bg-base-50">
                        <CategoryTree
                            :categories="categories"
                            :model-value="selectedCategories"
                            @update:model-value="emit('update:selectedCategories', $event)"
                        />
                    </div>
                </div>
            </div>
        </div>

        <!-- Age Range -->
        <div class="card bg-base-100 shadow">
            <div class="card-body">
                <h3 class="card-title text-base flex items-center gap-2">
                    <span class="iconify lucide--user text-primary" />
                    Age Range
                </h3>
                <div class="grid grid-cols-2 gap-3 mt-4">
                    <div class="space-y-2">
                        <label class="fieldset-label text-sm">Min Age</label>
                        <div class="join w-full">
                            <input
                                type="number"
                                :value="ageMin"
                                @input="emit('update:ageMin', Number(($event.target as HTMLInputElement).value))"
                                class="input input-sm join-item w-full"
                                min="0"
                                placeholder="0"
                            />
                            <span class="btn btn-sm join-item no-animation">yo</span>
                        </div>
                    </div>
                    <div class="space-y-2">
                        <label class="fieldset-label text-sm">Max Age</label>
                        <div class="join w-full">
                            <input
                                type="number"
                                :value="ageMax"
                                @input="emit('update:ageMax', Number(($event.target as HTMLInputElement).value))"
                                class="input input-sm join-item w-full"
                                min="0"
                                placeholder="10"
                            />
                            <span class="btn btn-sm join-item no-animation">yo</span>
                        </div>
                    </div>
                </div>
                <div class="text-center mt-3">
                    <span class="badge badge-ghost badge-sm">{{ ageMin }} - {{ ageMax }} years old</span>
                </div>
            </div>
        </div>

        <!-- Tags -->
        <div class="card bg-base-100 shadow">
            <div class="card-body">
                <h3 class="card-title text-base flex items-center gap-2">
                    <span class="iconify lucide--tags text-primary" />
                    Tags
                </h3>
                <div class="space-y-3 mt-4">
                    <div class="join w-full">
                        <input
                            v-model="tagInput"
                            type="text"
                            placeholder="Add tag..."
                            class="input input-sm join-item flex-1"
                            @keydown="handleTagKeydown"
                        />
                        <button type="button" @click="addTag" class="btn btn-primary btn-sm join-item">
                            <span class="iconify lucide--plus size-4" />
                        </button>
                    </div>
                    <div v-if="tags.length > 0" class="flex flex-wrap gap-2">
                        <span
                            v-for="(tag, index) in tags"
                            :key="index"
                            class="badge badge-primary gap-1 py-3"
                        >
                            {{ tag }}
                            <button
                                type="button"
                                @click="removeTag(index)"
                                class="hover:text-error"
                            >
                                <span class="iconify lucide--x size-3" />
                            </button>
                        </span>
                    </div>
                    <p v-else class="text-xs text-base-content/60 text-center py-2">
                        No tags added yet
                    </p>
                </div>
            </div>
        </div>

        <!-- Status & Settings -->
        <div class="card bg-base-100 shadow">
            <div class="card-body">
                <h3 class="card-title text-base flex items-center gap-2">
                    <span class="iconify lucide--settings text-primary" />
                    Status & Settings
                </h3>
                <div class="space-y-4 mt-4">
                    <div class="space-y-2">
                        <label class="fieldset-label text-sm">Status</label>
                        <select
                            :value="status"
                            @change="emit('update:status', ($event.target as HTMLSelectElement).value)"
                            class="select select-sm w-full"
                        >
                            <option value="active">● Active</option>
                            <option value="inactive">● Inactive</option>
                            <option value="draft">● Draft</option>
                        </select>
                    </div>
                    <div class="form-control">
                        <label class="label cursor-pointer justify-start gap-3">
                            <input
                                type="checkbox"
                                :checked="isFeatured"
                                @change="emit('update:isFeatured', ($event.target as HTMLInputElement).checked)"
                                class="checkbox checkbox-primary checkbox-sm"
                            />
                            <div>
                                <span class="label-text font-medium">Featured Product</span>
                                <p class="text-xs text-base-content/60">Show in featured section</p>
                            </div>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
