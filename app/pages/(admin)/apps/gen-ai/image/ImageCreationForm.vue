<script lang="ts" setup>
import { type IAiImageType, imageTypes } from "./helpers";

const selectedType = ref<IAiImageType>(imageTypes[0]);
const describe = ref("");
const selectedEngine = ref("Stable Diffusion");
const selectedSize = ref("512x512");
const selectedNumber = ref(2);
</script>
<template>
    <div class="space-y-6">
        <div class="card card-border bg-base-100">
            <div class="card-body gap-0">
                <div class="card-title">Configure</div>
                <div class="fieldset mt-2 gap-4">
                    <div class="space-y-2">
                        <label class="fieldset-label" for="describe">Describe your image</label>
                        <textarea
                            id="describe"
                            v-model="describe"
                            class="textarea h-16 w-full pb-0 leading-5"
                            placeholder="E.g., A sunny beach with clear blue water"
                            aria-label="Textarea" />
                    </div>
                    <div class="space-y-2">
                        <label class="fieldset-label" for="engine">Engine</label>
                        <select id="engine" v-model="selectedEngine" class="select w-full">
                            <option>Stable Diffusion</option>
                            <option>DALL·E</option>
                            <option>MidJourney</option>
                            <option>DeepAI</option>
                            <option>RunwayML</option>
                        </select>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div class="space-y-2">
                            <label class="fieldset-label" for="image-size">Image Size</label>
                            <select id="image-size" v-model="selectedSize" class="select w-full">
                                <option>512x512</option>
                                <option>1024x1024</option>
                                <option>1920x1080</option>
                                <option>2048x2048</option>
                                <option>Portrait</option>
                                <option>Landscape</option>
                            </select>
                        </div>

                        <div class="space-y-2">
                            <label class="fieldset-label" for="image-number">Images</label>
                            <select id="image-number" v-model="selectedNumber" class="select w-full">
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                                <option value="6">6</option>
                            </select>
                        </div>
                    </div>

                    <label class="fieldset-label">Type</label>
                    <div class="grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-3">
                        <div
                            v-for="(imageType, index) in imageTypes"
                            :key="index"
                            :class="{
                                'hover:bg-base-200 rounded-box cursor-pointer border border-transparent p-1 transition-all': true,
                                '!border-primary/20 !bg-primary/10 text-primary font-medium':
                                    selectedType.image === imageType.image,
                            }"
                            @click="selectedType = imageType">
                            <img :src="imageType.image" :alt="imageType.type" class="rounded-box" />
                            <p class="mt-1 text-center text-sm">{{ imageType.type }}</p>
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
