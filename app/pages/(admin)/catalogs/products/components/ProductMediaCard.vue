<script setup lang="ts">
const props = defineProps<{
    existingImages: Array<{
        id: number;
        url: string;
        is_primary: boolean;
        sort_order: number;
        media_type?: string;
        thumbnail_url?: string;
        duration?: number;
    }>;
    tempMedia: Array<{
        url: string;
        path: string;
        media_type: string;
        thumbnail_url?: string;
        duration?: number;
        file_size?: number;
    }>;
    uploading: boolean;
    totalImages: number;
}>();

const emit = defineEmits<{
    'upload': [event: Event];
    'setPrimary': [imageId: number];
    'remove': [index: number];
}>();

const { getMediaUrl, getThumbnailUrl } = useMediaUrl();

const handleFileUpload = (event: Event) => {
    emit('upload', event);
};

const handleSetPrimary = (imageId: number) => {
    emit('setPrimary', imageId);
};

const handleRemove = (index: number) => {
    emit('remove', index);
};
</script>

<template>
    <div class="card bg-base-100 shadow">
        <div class="card-body">
            <h3 class="card-title text-lg flex items-center gap-2">
                <span class="iconify lucide--images text-primary" />
                Product Media (Images & Video)
            </h3>
            <div class="mt-4">
                <!-- Existing Media from Product -->
                <div v-if="existingImages.length > 0" class="mb-4">
                    <label class="text-base-content/60 mb-2 block text-sm">Existing Media</label>
                    <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                        <div
                            v-for="(media, index) in existingImages"
                            :key="media.id"
                            class="group relative aspect-square overflow-hidden rounded-lg border-2"
                            :class="media.is_primary ? 'border-primary' : media.media_type === 'video' ? 'border-primary' : 'border-base-300'">
                            <!-- Image Preview -->
                            <img v-if="media.media_type === 'image'" :src="getMediaUrl(media.url)" :alt="`Product image ${index + 1}`" class="h-full w-full object-cover" />

                            <!-- Video Preview with Thumbnail -->
                            <div v-else class="relative h-full w-full">
                                <img
                                    v-if="media.thumbnail_url"
                                    :src="getThumbnailUrl(media.thumbnail_url)"
                                    :alt="`Video thumbnail ${index + 1}`"
                                    class="h-full w-full object-cover" />
                                <div v-else class="h-full w-full bg-base-300 flex items-center justify-center">
                                    <span class="iconify lucide--video size-12 text-base-content/40" />
                                </div>
                                <!-- Play Icon Overlay -->
                                <div class="absolute inset-0 flex items-center justify-center bg-black/30">
                                    <div class="bg-primary rounded-full p-3">
                                        <span class="iconify lucide--play size-6 text-white" />
                                    </div>
                                </div>
                            </div>

                            <!-- Media Type Badge for Video -->
                            <div v-if="media.media_type === 'video'" class="absolute top-2 left-2 badge badge-primary badge-sm gap-1 z-10">
                                <span class="iconify lucide--video size-3" />
                                Video
                            </div>

                            <!-- Video Duration -->
                            <div v-if="media.media_type === 'video' && media.duration" class="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs z-10">
                                {{ Math.floor(media.duration / 60) }}:{{ String(media.duration % 60).padStart(2, '0') }}
                            </div>

                            <!-- Primary Badge -->
                            <div
                                v-if="media.is_primary && media.media_type === 'image'"
                                class="absolute left-1 top-1 badge badge-primary badge-xs">
                                <span class="iconify lucide--star size-3" />
                            </div>

                            <!-- Sort Order -->
                            <div class="bg-base-100/80 absolute bottom-0 left-0 right-0 p-1 text-center backdrop-blur-sm">
                                <span class="text-xs">Sort: {{ media.sort_order }}</span>
                            </div>

                            <!-- Action buttons - show on hover -->
                            <div class="absolute right-1 top-1 flex flex-col gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                                <button
                                    v-if="!media.is_primary && media.media_type === 'image'"
                                    type="button"
                                    @click="handleSetPrimary(media.id)"
                                    class="btn btn-circle btn-primary btn-xs"
                                    title="Set as primary">
                                    <span class="iconify lucide--star size-3" />
                                </button>
                                <button
                                    type="button"
                                    @click="handleRemove(index)"
                                    class="btn btn-circle btn-error btn-xs"
                                    :title="`Remove ${media.media_type}`">
                                    <span class="iconify lucide--trash-2 size-3" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Newly Uploaded Media (Temp) -->
                <div v-if="tempMedia.length > 0" class="mb-4">
                    <label class="text-base-content/60 mb-2 block text-sm">New Media (Not Saved Yet)</label>
                    <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                        <div
                            v-for="(media, index) in tempMedia"
                            :key="media.path"
                            class="group relative aspect-square overflow-hidden rounded-lg border-2 border-warning">
                            <!-- Image Preview -->
                            <img v-if="media.media_type === 'image'" :src="getMediaUrl(media.url)" :alt="`New image ${index + 1}`" class="h-full w-full object-cover" />

                            <!-- Video Preview with Thumbnail -->
                            <div v-else class="relative h-full w-full">
                                <img
                                    v-if="media.thumbnail_url"
                                    :src="getThumbnailUrl(media.thumbnail_url)"
                                    :alt="`New video thumbnail ${index + 1}`"
                                    class="h-full w-full object-cover" />
                                <div v-else class="h-full w-full bg-base-300 flex items-center justify-center">
                                    <span class="iconify lucide--video size-12 text-base-content/40" />
                                </div>
                                <!-- Play Icon Overlay -->
                                <div class="absolute inset-0 flex items-center justify-center bg-black/30">
                                    <div class="bg-warning rounded-full p-3">
                                        <span class="iconify lucide--play size-6 text-white" />
                                    </div>
                                </div>
                            </div>

                            <!-- Media Type Badge -->
                            <div class="absolute left-1 top-1 badge badge-warning badge-xs gap-1 z-10">
                                <span v-if="media.media_type === 'video'" class="iconify lucide--video size-3" />
                                {{ media.media_type === 'video' ? 'New Video' : 'New' }}
                            </div>

                            <!-- Video Duration -->
                            <div v-if="media.media_type === 'video' && media.duration" class="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs z-10">
                                {{ Math.floor(media.duration / 60) }}:{{ String(media.duration % 60).padStart(2, '0') }}
                            </div>

                            <button
                                type="button"
                                @click="handleRemove(existingImages.length + index)"
                                class="btn btn-circle btn-error btn-xs absolute -right-1 -top-1 opacity-0 transition-opacity group-hover:opacity-100">
                                <span class="iconify lucide--x size-3" />
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Upload Area -->
                <div class="space-y-3">
                    <div class="border-2 border-dashed border-base-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
                        <span class="iconify lucide--upload-cloud text-base-content/40 mb-2 size-10 block mx-auto" />
                        <p class="text-base-content/60 mb-3 text-sm">
                            {{ totalImages > 0 ? "Add more images or video" : "Upload product images & video" }}
                        </p>
                        <label class="btn btn-primary btn-sm">
                            <span v-if="uploading" class="loading loading-spinner loading-xs"></span>
                            <span v-else class="iconify lucide--upload size-4" />
                            {{ uploading ? "Uploading..." : "Choose Files" }}
                            <input type="file" accept="image/*,video/*" multiple class="hidden" @change="handleFileUpload" :disabled="uploading" />
                        </label>
                    </div>
                </div>

                <div class="alert alert-info mt-3">
                    <span class="iconify lucide--info size-4" />
                    <div class="text-xs">
                        <p><strong>Images:</strong> JPG, PNG, GIF, WebP. Max 10MB per image.</p>
                        <p><strong>Video:</strong> MP4, MOV, AVI. Max 100MB. Max 1 video per product.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
