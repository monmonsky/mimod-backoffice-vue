<script lang="ts" setup>
import { ref, nextTick } from "vue";

const dialogRef = ref<HTMLDialogElement | null>(null);
const searchInputRef = ref<HTMLInputElement | null>(null);
const selectedIndex = ref(-1);

const { searchQuery, results, search, clearSearch, hasResults, totalResults } = useGlobalSearch();

const showModal = () => {
    if (dialogRef.value) {
        dialogRef.value.showModal();
        nextTick(() => {
            searchInputRef.value?.focus();
        });
    }
};

const closeModal = () => {
    if (dialogRef.value) {
        dialogRef.value.close();
        clearSearch();
        selectedIndex.value = -1;
    }
};

const handleInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
    search(target.value);
    selectedIndex.value = -1;
};

const handleKeyDown = (event: KeyboardEvent) => {
    const maxIndex = totalResults.value - 1;

    if (event.key === "ArrowDown") {
        event.preventDefault();
        selectedIndex.value = Math.min(selectedIndex.value + 1, maxIndex);
    } else if (event.key === "ArrowUp") {
        event.preventDefault();
        selectedIndex.value = Math.max(selectedIndex.value - 1, -1);
    } else if (event.key === "Enter" && selectedIndex.value >= 0) {
        event.preventDefault();
        navigateToSelected();
    } else if (event.key === "Escape") {
        closeModal();
    }
};

const navigateToSelected = () => {
    let currentIndex = 0;

    // Navigate to selected order
    if (selectedIndex.value < results.value.orders.length) {
        const order = results.value.orders[selectedIndex.value];
        navigateTo(`/orders/${order.id}/show`);
        closeModal();
        return;
    }
    currentIndex += results.value.orders.length;

    // Navigate to selected product
    if (selectedIndex.value < currentIndex + results.value.products.length) {
        const product = results.value.products[selectedIndex.value - currentIndex];
        navigateTo(`/catalogs/products/${product.id}/show`);
        closeModal();
        return;
    }
    currentIndex += results.value.products.length;

    // Navigate to selected customer
    if (selectedIndex.value < currentIndex + results.value.customers.length) {
        const customer = results.value.customers[selectedIndex.value - currentIndex];
        navigateTo(`/customers/${customer.id}/show`);
        closeModal();
        return;
    }
};

const getItemIndex = (category: "orders" | "products" | "customers", itemIndex: number): number => {
    let offset = 0;
    if (category === "products") {
        offset = results.value.orders.length;
    } else if (category === "customers") {
        offset = results.value.orders.length + results.value.products.length;
    }
    return offset + itemIndex;
};

const formatPrice = (price: string | number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(Number(price));
};

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
};
</script>

<template>
    <div>
        <button
            class="btn btn-outline btn-sm btn-ghost border-base-300 text-base-content/70 hidden h-9 w-48 justify-start gap-2 !text-sm md:flex"
            @click="showModal">
            <span class="iconify lucide--search size-4" />
            <span>Search...</span>
            <kbd class="kbd kbd-xs ml-auto">⌘K</kbd>
        </button>
        <button
            class="btn btn-outline btn-sm btn-square btn-ghost border-base-300 text-base-content/70 flex size-9 md:hidden"
            aria-label="Search"
            @click="showModal">
            <span class="iconify lucide--search size-4" />
        </button>

        <dialog ref="dialogRef" class="modal p-0" @keydown="handleKeyDown">
            <div class="modal-box bg-transparent max-w-2xl p-0 shadow-none">
                <div class="bg-base-100 rounded-box shadow-xl">
                    <!-- Search Input -->
                    <div class="input w-full border-0 !outline-none">
                        <span class="iconify lucide--search text-base-content/60 size-5" />
                        <input
                            ref="searchInputRef"
                            v-model="searchQuery"
                            type="search"
                            class="grow"
                            placeholder="Search orders, products, customers..."
                            aria-label="Global Search"
                            @input="handleInput" />
                        <div v-if="results.loading" class="loading loading-spinner loading-sm"></div>
                        <form method="dialog">
                            <button class="btn btn-xs btn-circle btn-ghost" aria-label="Close" @click="closeModal">
                                <span class="iconify lucide--x text-base-content/80 size-4" />
                            </button>
                        </form>
                    </div>

                    <!-- Search Results -->
                    <div v-if="searchQuery.length >= 2" class="max-h-96 overflow-y-auto">
                        <!-- Loading State -->
                        <div v-if="results.loading" class="flex items-center justify-center py-12">
                            <div class="loading loading-spinner loading-lg"></div>
                        </div>

                        <!-- Results -->
                        <div v-else-if="hasResults">
                            <!-- Orders Section -->
                            <div v-if="results.orders.length > 0" class="pt-2">
                                <div class="px-4 py-2">
                                    <p class="text-xs font-semibold text-base-content/60 uppercase tracking-wide">
                                        Orders ({{ results.orders.length }})
                                    </p>
                                </div>
                                <div class="space-y-1 px-2">
                                    <div
                                        v-for="(order, index) in results.orders"
                                        :key="order.id"
                                        :class="[
                                            'flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors hover:bg-base-200',
                                            selectedIndex === getItemIndex('orders', index) ? 'bg-base-200' : '',
                                        ]"
                                        @click="navigateTo(`/orders/${order.id}/show`); closeModal()">
                                        <div class="bg-primary/10 rounded-lg flex size-10 items-center justify-center shrink-0">
                                            <span class="iconify lucide--shopping-bag text-primary size-5" />
                                        </div>
                                        <div class="flex-1 min-w-0">
                                            <p class="text-sm font-medium truncate">Order #{{ order.order_number }}</p>
                                            <p class="text-xs text-base-content/60 truncate">
                                                {{ order.customer?.name || 'Guest' }} • {{ formatPrice(order.total_amount) }}
                                            </p>
                                        </div>
                                        <div class="flex items-center gap-2 shrink-0">
                                            <div :class="['badge badge-sm', getOrderStatusBadgeClass(order.status)]">
                                                {{ order.status }}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div v-if="results.orders.length === 5" class="px-4 py-2">
                                    <NuxtLink
                                        to="/orders"
                                        class="text-xs text-primary hover:underline"
                                        @click="closeModal">
                                        View all orders →
                                    </NuxtLink>
                                </div>
                            </div>

                            <hr v-if="results.orders.length > 0 && (results.products.length > 0 || results.customers.length > 0)" class="border-base-300" />

                            <!-- Products Section -->
                            <div v-if="results.products.length > 0" class="pt-2">
                                <div class="px-4 py-2">
                                    <p class="text-xs font-semibold text-base-content/60 uppercase tracking-wide">
                                        Products ({{ results.products.length }})
                                    </p>
                                </div>
                                <div class="space-y-1 px-2">
                                    <div
                                        v-for="(product, index) in results.products"
                                        :key="product.id"
                                        :class="[
                                            'flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors hover:bg-base-200',
                                            selectedIndex === getItemIndex('products', index) ? 'bg-base-200' : '',
                                        ]"
                                        @click="navigateTo(`/catalogs/products/${product.id}/show`); closeModal()">
                                        <div class="avatar size-10 shrink-0">
                                            <div class="rounded-lg overflow-hidden">
                                                <img
                                                    v-if="product.images && product.images.find(img => img.is_primary && img.type === 'image')"
                                                    :src="product.images.find(img => img.is_primary && img.type === 'image')?.url"
                                                    :alt="product.name"
                                                    class="object-cover w-full h-full" />
                                                <div
                                                    v-else
                                                    class="bg-secondary/10 flex size-full items-center justify-center">
                                                    <span class="iconify lucide--package text-secondary size-5" />
                                                </div>
                                            </div>
                                        </div>
                                        <div class="flex-1 min-w-0">
                                            <p class="text-sm font-medium truncate">{{ product.name }}</p>
                                        </div>
                                        <div class="flex items-center gap-2 shrink-0">
                                            <div :class="['badge badge-sm', getStatusBadgeClass(product.status)]">
                                                {{ product.status }}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div v-if="results.products.length === 5" class="px-4 py-2">
                                    <NuxtLink
                                        to="/catalogs/products"
                                        class="text-xs text-primary hover:underline"
                                        @click="closeModal">
                                        View all products →
                                    </NuxtLink>
                                </div>
                            </div>

                            <hr v-if="results.products.length > 0 && results.customers.length > 0" class="border-base-300" />

                            <!-- Customers Section -->
                            <div v-if="results.customers.length > 0" class="pt-2">
                                <div class="px-4 py-2">
                                    <p class="text-xs font-semibold text-base-content/60 uppercase tracking-wide">
                                        Customers ({{ results.customers.length }})
                                    </p>
                                </div>
                                <div class="space-y-1 px-2">
                                    <div
                                        v-for="(customer, index) in results.customers"
                                        :key="customer.id"
                                        :class="[
                                            'flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors hover:bg-base-200',
                                            selectedIndex === getItemIndex('customers', index) ? 'bg-base-200' : '',
                                        ]"
                                        @click="navigateTo(`/customers/${customer.id}/show`); closeModal()">
                                        <div class="bg-accent/10 rounded-lg flex size-10 items-center justify-center shrink-0">
                                            <span class="iconify lucide--user text-accent size-5" />
                                        </div>
                                        <div class="flex-1 min-w-0">
                                            <p class="text-sm font-medium truncate">{{ customer.name }}</p>
                                            <p class="text-xs text-base-content/60 truncate">
                                                {{ customer.email }}
                                            </p>
                                        </div>
                                        <div class="flex items-center gap-2 shrink-0">
                                            <span class="text-xs text-base-content/60">
                                                {{ customer.phone || '-' }}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div v-if="results.customers.length === 5" class="px-4 py-2">
                                    <NuxtLink
                                        to="/customers"
                                        class="text-xs text-primary hover:underline"
                                        @click="closeModal">
                                        View all customers →
                                    </NuxtLink>
                                </div>
                            </div>
                        </div>

                        <!-- No Results -->
                        <div v-else class="flex flex-col items-center justify-center py-12 px-4">
                            <span class="iconify lucide--search-x size-16 mb-3 text-base-content/40" />
                            <p class="text-sm font-medium">No results found</p>
                            <p class="text-xs text-base-content/60 mt-1">
                                Try searching with different keywords
                            </p>
                        </div>
                    </div>

                    <!-- Empty State / Tips -->
                    <div v-else class="bg-base-100 rounded-b-box">
                        <div class="px-5 py-4">
                            <p class="text-sm font-medium text-base-content/80 mb-3">Quick tips:</p>
                            <div class="space-y-2 text-xs text-base-content/60">
                                <div class="flex items-start gap-2">
                                    <span class="iconify lucide--hash size-4 mt-0.5 shrink-0" />
                                    <p>Search orders by order number, customer name, or email</p>
                                </div>
                                <div class="flex items-start gap-2">
                                    <span class="iconify lucide--package size-4 mt-0.5 shrink-0" />
                                    <p>Find products by name, SKU, or barcode</p>
                                </div>
                                <div class="flex items-start gap-2">
                                    <span class="iconify lucide--user size-4 mt-0.5 shrink-0" />
                                    <p>Look up customers by name, email, or phone</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Keyboard Shortcuts Footer -->
                    <div class="border-base-300 flex items-center gap-3 border-t px-3 py-2 bg-base-200/30">
                        <div class="flex items-center gap-1">
                            <kbd class="kbd kbd-xs">↑</kbd>
                            <kbd class="kbd kbd-xs">↓</kbd>
                            <span class="text-xs text-base-content/60 ml-1">Navigate</span>
                        </div>
                        <div class="flex items-center gap-1">
                            <kbd class="kbd kbd-xs">↵</kbd>
                            <span class="text-xs text-base-content/60 ml-1">Select</span>
                        </div>
                        <div class="flex items-center gap-1 ml-auto">
                            <kbd class="kbd kbd-xs">esc</kbd>
                            <span class="text-xs text-base-content/60 ml-1">Close</span>
                        </div>
                    </div>
                </div>
            </div>
            <form method="dialog" class="modal-backdrop">
                <button @click="closeModal">close</button>
            </form>
        </dialog>
    </div>
</template>
