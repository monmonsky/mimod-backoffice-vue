<script setup lang="ts">
import FileUploader from "~/components/forms/FileUploader.vue";
</script>

<template>
    <div>
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div class="card bg-base-100 shadow">
                <div class="card-body">
                    <div class="card-title">Basic Information</div>
                    <fieldset class="fieldset mt-2 grid grid-cols-1 gap-4 lg:grid-cols-2">
                        <div class="space-y-2">
                            <label class="fieldset-label" for="name"> Name </label>
                            <input id="name" type="text" class="input w-full" placeholder="Name" />
                        </div>
                        <div class="space-y-2">
                            <label class="fieldset-label" for="category"> Category </label>
                            <select id="category" class="select w-full" aria-label="Select Category">
                                <option value="" disabled>Select category</option>
                                <option>Fashion</option>
                                <option>Daily Need</option>
                                <option>Cosmetic</option>
                                <option>Electronic</option>
                                <option>Food</option>
                            </select>
                        </div>
                        <div class="col-span-1 space-y-2 lg:col-span-2">
                            <label class="fieldset-label" for="description"> Description </label>
                            <textarea id="description" placeholder="Description" class="textarea w-full" />
                        </div>
                    </fieldset>
                </div>
            </div>
            <div class="card bg-base-100 shadow">
                <div class="card-body">
                    <div class="card-title">Upload Image</div>
                    <div class="mt-5">
                        <FileUploader
                            :label-idle="'<div>Drag and Drop your files or <span style=&quot;text-decoration: underline&quot;>Browse</span></div>'" />
                    </div>
                </div>
            </div>
            <div class="card bg-base-100 shadow">
                <div class="card-body">
                    <div class="card-title">Pricing</div>
                    <fieldset class="fieldset mt-2 grid grid-cols-1 gap-4 lg:grid-cols-2">
                        <div class="space-y-2">
                            <label class="fieldset-label" for="cost-price"> Cost Price </label>
                            <label class="input w-full">
                                <span class="iconify lucide--dollar-sign text-base-content/60 size-4" />
                                <input id="cost-price" class="grow" placeholder="0" type="number" min="0" />
                            </label>
                        </div>
                        <div class="space-y-2">
                            <label class="fieldset-label" for="sale-price"> Sale Price </label>
                            <label class="input w-full">
                                <span class="iconify lucide--dollar-sign text-base-content/60 size-4" />
                                <input id="sale-price" class="grow" placeholder="0" type="number" min="0" />
                            </label>
                        </div>
                        <div class="space-y-2">
                            <label class="fieldset-label" for="discount"> Discount </label>
                            <label class="input w-full">
                                <input id="discount" class="grow" placeholder="0" type="number" min="0" max="100" />
                                <span class="iconify lucide--percent text-base-content/60 size-4" />
                            </label>
                        </div>
                        <div class="space-y-2">
                            <label class="fieldset-label" for="tax"> Tax </label>
                            <label class="input w-full">
                                <input id="tax" class="grow" placeholder="0" type="number" min="0" max="100" />
                                <span class="iconify lucide--percent text-base-content/60 size-4" />
                            </label>
                        </div>
                    </fieldset>
                </div>
            </div>
            <div class="card bg-base-100 shadow">
                <div class="card-body">
                    <div class="card-title">Inventory</div>
                    <div class="fieldset mt-2 gap-4">
                        <div class="space-y-2">
                            <label class="fieldset-label" for="sku"> SKU </label>
                            <input id="sku" type="text" class="input w-full" placeholder="SKU (Stock Keeping Unit)" />
                        </div>
                        <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
                            <div class="space-y-2">
                                <label class="fieldset-label" for="stock"> Stock </label>
                                <input id="stock" type="number" min="0" class="input w-full" placeholder="Stock" />
                            </div>
                            <div class="space-y-2">
                                <label class="fieldset-label" for="stock-alert"> Stock Alert </label>
                                <input
                                    id="stock-alert"
                                    type="number"
                                    min="0"
                                    class="input w-full"
                                    placeholder="Stock alert" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card bg-base-100 shadow">
                <div class="card-body">
                    <div class="card-title">SEO (Meta)</div>
                    <div class="fieldset mt-2 gap-4">
                        <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
                            <div class="space-y-2">
                                <label class="fieldset-label" for="slug"> Slug </label>
                                <input id="slug" type="text" class="input w-full" placeholder="Slug" />
                            </div>
                            <div class="space-y-2">
                                <label class="fieldset-label" for="title"> Title </label>
                                <input id="title" type="text" class="input w-full" placeholder="Meta" />
                            </div>
                        </div>
                        <div class="space-y-2">
                            <label class="fieldset-label" for="meta-description"> Description </label>
                            <textarea id="meta-description" placeholder="Description" class="textarea w-full" />
                        </div>
                    </div>
                </div>
            </div>
            <div class="card bg-base-100 shadow">
                <div class="card-body">
                    <div class="card-title">Shipping</div>
                    <div class="fieldset mt-2 grid grid-cols-1 gap-4 lg:grid-cols-2">
                        <div class="space-y-2">
                            <label class="fieldset-label" for="weight"> Weight </label>
                            <label class="input w-full">
                                <input id="weight" class="grow" placeholder="0" type="number" min="0" />
                                <span class="text-base-content/60">gm</span>
                            </label>
                        </div>
                        <div class="space-y-2">
                            <label class="fieldset-label" for="width"> Width </label>
                            <label class="input w-full">
                                <input id="width" class="grow" placeholder="0" type="number" min="0" />
                                <span class="text-base-content/60">In</span>
                            </label>
                        </div>

                        <div class="space-y-2">
                            <label class="fieldset-label" for="height"> Height </label>
                            <label class="input w-full">
                                <input id="height" class="grow" placeholder="0" type="number" min="0" />
                                <span class="text-base-content/60">In</span>
                            </label>
                        </div>

                        <div class="space-y-2">
                            <label class="fieldset-label" for="depth"> Depth </label>
                            <label class="input w-full">
                                <input id="depth" class="grow" placeholder="0" type="number" min="0" />
                                <span class="text-base-content/60">In</span>
                            </label>
                        </div>

                        <div class="flex items-center gap-4">
                            <label class="label" for="free_shipping"> Free Shipping </label>
                            <input id="free_shipping" class="toggle toggle-sm" type="checkbox" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="mt-6 flex justify-end gap-3">
            <NuxtLink class="btn btn-sm btn-ghost" href="/apps/ecommerce/products">
                <span class="iconify lucide--x size-4" />
                Cancel
            </NuxtLink>
            <NuxtLink class="btn btn-sm btn-primary" href="/apps/ecommerce/products">
                <span class="iconify lucide--check size-4" />
                Save
            </NuxtLink>
        </div>
    </div>
</template>
