<script setup>
import ProductTableRow from "./ProductTableRow.vue";
import { productsData } from "./data";
</script>

<template>
    <div>
        <div class="bg-base-100 card shadow">
            <div class="card-body p-0">
                <div class="flex items-center justify-between px-5 pt-5">
                    <div class="inline-flex items-center gap-3">
                        <label class="input input-sm">
                            <span class="iconify lucide--search text-base-content/80 size-3.5" />
                            <input
                                type="search"
                                class="w-24 sm:w-36"
                                placeholder="Search along products"
                                aria-label="Search products" />
                        </label>
                        <div class="hidden sm:block">
                            <select class="select select-sm w-36" aria-label="Select category">
                                <option value="" disabled>Select Category</option>
                                <option>Fashion</option>
                                <option>Daily Need</option>
                                <option>Cosmetic</option>
                                <option>Electronics</option>
                                <option>Food</option>
                            </select>
                        </div>
                    </div>
                    <div class="inline-flex items-center gap-3">
                        <NuxtLink
                            href="/apps/ecommerce/products/create"
                            aria-label="Create product link"
                            class="btn btn-primary btn-sm max-sm:btn-square">
                            <span class="iconify lucide--plus size-4" />
                            <span class="hidden sm:inline">New Product</span>
                        </NuxtLink>
                        <div class="dropdown dropdown-bottom dropdown-end">
                            <div
                                tabIndex="0"
                                role="button"
                                class="btn btn-ghost border-base-300 btn-sm btn-square"
                                aria-label="More option">
                                <span class="iconify lucide--settings-2 size-4" />
                            </div>
                            <div tabIndex="0" class="dropdown-content bg-base-100 rounded-box z-1 w-52 shadow">
                                <ul class="menu w-full p-2">
                                    <li>
                                        <div>
                                            <span class="iconify lucide--wand size-4" />
                                            Bulk Actions
                                        </div>
                                    </li>
                                </ul>
                                <hr class="border-base-300" />
                                <ul class="menu w-full p-2">
                                    <li>
                                        <div>
                                            <span class="iconify lucide--download-cloud size-4" />
                                            Import from Store
                                        </div>
                                    </li>
                                    <li>
                                        <div>
                                            <span class="iconify lucide--copy-plus size-4" />
                                            Create from Existing
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="mt-4 overflow-auto">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>
                                    <input aria-label="Check all" type="checkbox" class="checkbox checkbox-sm" />
                                </th>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Ratings</th>
                                <th>Orders</th>
                                <th>Stock</th>
                                <th>Created At</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <ProductTableRow v-for="(product, index) in productsData" :key="index" v-bind="product" />
                        </tbody>
                    </table>
                </div>
                <div class="flex items-center justify-between p-6">
                    <div class="text-base-content/80 hover:text-base-content flex gap-2 text-sm">
                        <span class="hidden sm:inline">Per page</span>
                        <select class="select select-xs w-18" aria-label="Per page">
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </select>
                    </div>
                    <span class="text-base-content/80 hidden text-sm lg:inline">
                        Showing <span class="text-base-content font-medium">1 to 20</span> of 457 items
                    </span>
                    <div class="inline-flex items-center gap-1">
                        <button class="btn btn-circle sm:btn-sm btn-xs btn-ghost" aria-label="Prev">
                            <span class="iconify lucide--chevron-left" />
                        </button>
                        <button class="btn btn-primary btn-circle sm:btn-sm btn-xs">1</button>
                        <button class="btn btn-ghost btn-circle sm:btn-sm btn-xs">2</button>
                        <button class="btn btn-ghost btn-circle sm:btn-sm btn-xs">3</button>
                        <button class="btn btn-circle sm:btn-sm btn-xs btn-ghost" aria-label="Next">
                            <span class="iconify lucide--chevron-right" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <dialog id="apps-product-delete" class="modal">
            <div class="modal-box">
                <div class="flex items-center justify-between text-lg font-medium">
                    Confirm Delete
                    <form method="dialog">
                        <button class="btn btn-sm btn-ghost btn-circle" aria-label="Close modal">
                            <span class="iconify lucide--x size-4" />
                        </button>
                    </form>
                </div>
                <p class="py-4">You are about to delete this product. Would you like to proceed further?</p>
                <div class="modal-action">
                    <form method="dialog">
                        <button class="btn btn-ghost btn-sm">No</button>
                    </form>
                    <form method="dialog">
                        <button class="btn btn-sm btn-error">Yes, delete it</button>
                    </form>
                </div>
            </div>
            <form method="dialog" class="modal-backdrop">
                <button>close</button>
            </form>
        </dialog>
    </div>
</template>
