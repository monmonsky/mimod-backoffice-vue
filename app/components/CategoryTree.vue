<script setup lang="ts">
interface Category {
    id: number;
    name: string;
    parent_id: number | null;
    children?: Category[];
}

interface Props {
    categories: Category[];
    modelValue: number[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
    'update:modelValue': [value: number[]];
}>();

// Build tree structure from flat categories
const categoryTree = computed(() => {
    const map = new Map<number, Category & { children: Category[] }>();
    const roots: (Category & { children: Category[] })[] = [];

    // Initialize map
    props.categories.forEach(cat => {
        map.set(cat.id, { ...cat, children: [] });
    });

    // Build tree
    props.categories.forEach(cat => {
        const node = map.get(cat.id);
        if (!node) return;

        if (cat.parent_id === null || cat.parent_id === 0) {
            roots.push(node);
        } else {
            const parent = map.get(cat.parent_id);
            if (parent) {
                parent.children.push(node);
            }
        }
    });

    return roots;
});

// Toggle category selection
const toggleCategory = (categoryId: number) => {
    const selected = [...props.modelValue];
    const index = selected.indexOf(categoryId);

    if (index > -1) {
        selected.splice(index, 1);
    } else {
        selected.push(categoryId);
    }

    emit('update:modelValue', selected);
};

// Check if category is selected
const isSelected = (categoryId: number) => {
    return props.modelValue.includes(categoryId);
};

// Check if category has selected children (for partial state)
const hasSelectedChildren = (category: Category & { children: Category[] }): boolean => {
    if (!category.children || category.children.length === 0) return false;

    return category.children.some(child => {
        return isSelected(child.id) || hasSelectedChildren(child as any);
    });
};
</script>

<template>
    <div class="space-y-1">
        <!-- Empty state -->
        <div v-if="categoryTree.length === 0" class="text-center py-8 text-base-content/60">
            <span class="iconify lucide--folder-x size-12 mx-auto mb-2" />
            <p class="text-sm">No categories available</p>
        </div>

        <!-- Tree structure -->
        <div v-else class="space-y-1">
            <div v-for="category in categoryTree" :key="category.id" class="space-y-1">
                <!-- Parent category -->
                <label
                    class="flex items-center gap-2 p-2 rounded hover:bg-base-200 cursor-pointer transition-colors"
                    :class="{
                        'bg-primary/10': isSelected(category.id),
                        'bg-base-200/50': !isSelected(category.id) && hasSelectedChildren(category)
                    }"
                >
                    <input
                        type="checkbox"
                        :checked="isSelected(category.id)"
                        @change="toggleCategory(category.id)"
                        class="checkbox checkbox-primary checkbox-sm"
                    />
                    <span class="iconify lucide--folder size-4 text-primary" />
                    <span class="font-medium text-sm">{{ category.name }}</span>
                    <span v-if="category.children && category.children.length > 0" class="badge badge-xs badge-ghost ml-auto">
                        {{ category.children.length }}
                    </span>
                </label>

                <!-- Children categories -->
                <div v-if="category.children && category.children.length > 0" class="ml-6 space-y-1 border-l-2 border-base-300 pl-3">
                    <label
                        v-for="child in category.children"
                        :key="child.id"
                        class="flex items-center gap-2 p-2 rounded hover:bg-base-200 cursor-pointer transition-colors"
                        :class="{ 'bg-primary/10': isSelected(child.id) }"
                    >
                        <input
                            type="checkbox"
                            :checked="isSelected(child.id)"
                            @change="toggleCategory(child.id)"
                            class="checkbox checkbox-primary checkbox-sm"
                        />
                        <span class="iconify lucide--folder size-4 text-secondary" />
                        <span class="text-sm">{{ child.name }}</span>
                    </label>
                </div>
            </div>
        </div>

        <!-- Selected count -->
        <div v-if="modelValue.length > 0" class="mt-4 pt-4 border-t border-base-300">
            <div class="flex items-center justify-between text-xs text-base-content/60">
                <span>Selected categories</span>
                <span class="badge badge-primary badge-sm">{{ modelValue.length }}</span>
            </div>
        </div>
    </div>
</template>
