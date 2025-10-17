<script setup lang="ts">
import PageTitle from "~/components/PageTitle.vue";
import type { PaymentMethod } from "~/types/orders";

definePageMeta({
    layout: "admin",
});

const { createOrder } = useOrders();
const { validateCoupon } = useCoupons();
const { success, error: showError } = useToast();

// Form state
const form = ref({
    customer_id: null as number | null,
    items: [] as Array<{
        variant_id: number;
        product_name: string;
        sku: string;
        quantity: number;
        price: number;
        stock: number;
        image?: string;
    }>,
    shipping_address: "",
    shipping_city: "",
    shipping_province: "",
    shipping_postal_code: "",
    shipping_phone: "",
    courier: "",
    shipping_cost: 0,
    payment_method: "bank_transfer" as PaymentMethod,
    coupon_code: "",
    notes: "",
    shipping_notes: "",
});

const loading = ref(false);
const validatingCoupon = ref(false);
const couponValid = ref(false);
const couponDiscount = ref(0);

// Customer search
const customerSearch = ref("");
const selectedCustomer = ref<any>(null);

const customerSearchParams = computed(() => ({
    search: customerSearch.value,
    per_page: 50,
}));

const { data: customersData } = await useAsyncData(
    "customers-search",
    () =>
        $fetch("/customers", {
            baseURL: useRuntimeConfig().public.apiBase,
            headers: {
                Authorization: `Bearer ${useAuthStore().token}`,
            },
            params: customerSearchParams.value,
        }),
    {
        watch: [customerSearchParams],
    }
);

const customers = computed(() => {
    const response = customersData.value as any;
    return response?.data?.customers?.data || [];
});

// Select customer
const selectCustomer = (customer: any) => {
    form.value.customer_id = customer.id;
    selectedCustomer.value = customer;
    customerSearch.value = "";
};

// Product/Variant search
const productSearch = ref("");
const productSearchParams = computed(() => ({
    search: productSearch.value,
    per_page: 20,
    with_variants: true,
}));

const { data: productsData } = await useAsyncData(
    "products-search",
    () =>
        $fetch("/catalog/products", {
            baseURL: useRuntimeConfig().public.apiBase,
            headers: {
                Authorization: `Bearer ${useAuthStore().token}`,
            },
            params: productSearchParams.value,
        }),
    {
        watch: [productSearchParams],
    }
);

// Flatten products with variants into a list of variants
const variants = computed(() => {
    const response = productsData.value as any;
    const products = response?.data?.products?.data || [];

    // Flatten all variants from all products
    const allVariants: any[] = [];
    products.forEach((product: any) => {
        if (product.variants && Array.isArray(product.variants)) {
            product.variants.forEach((variant: any) => {
                allVariants.push({
                    ...variant,
                    product_name: product.name,
                    product_id: product.id,
                });
            });
        }
    });

    return allVariants;
});

// Add item to cart
const addItem = (variant: any) => {
    const existingItem = form.value.items.find((item) => item.variant_id === variant.id);

    if (existingItem) {
        if (existingItem.quantity < variant.stock_quantity) {
            existingItem.quantity++;
        } else {
            showError("Cannot add more than available stock");
        }
    } else {
        const imageUrl = variant.images && variant.images.length > 0 ? variant.images[0].url : undefined;

        form.value.items.push({
            variant_id: variant.id,
            product_name: variant.product_name || "Product",
            sku: variant.sku,
            quantity: 1,
            price: parseFloat(variant.price),
            stock: variant.stock_quantity,
            image: imageUrl,
        });
    }

    productSearch.value = "";
};

// Remove item from cart
const removeItem = (index: number) => {
    form.value.items.splice(index, 1);
};

// Update item quantity
const updateQuantity = (index: number, quantity: number) => {
    const item = form.value.items[index];
    if (item && quantity > 0 && quantity <= item.stock) {
        item.quantity = quantity;
    }
};

// Calculate subtotal
const subtotal = computed(() => {
    return form.value.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
});

// Calculate total
const total = computed(() => {
    return subtotal.value - couponDiscount.value + form.value.shipping_cost;
});

// Watch subtotal changes and re-validate coupon if applied
watch(subtotal, async (newSubtotal) => {
    if (couponValid.value && form.value.coupon_code && form.value.customer_id) {
        try {
            const response = await validateCoupon({
                code: form.value.coupon_code,
                customer_id: form.value.customer_id,
                cart_amount: newSubtotal,
            });

            if (response.data.valid) {
                couponDiscount.value = response.data.discount_amount || 0;
            } else {
                // Coupon no longer valid (e.g., below min purchase)
                couponValid.value = false;
                couponDiscount.value = 0;
                showError(response.data.message || "Coupon is no longer valid");
            }
        } catch (err) {
            // Silently fail, don't interrupt user
            console.error("Failed to re-validate coupon:", err);
        }
    }
});

// Validate coupon
const handleValidateCoupon = async () => {
    if (!form.value.coupon_code || !form.value.customer_id) {
        showError("Please select customer and enter coupon code");
        return;
    }

    try {
        validatingCoupon.value = true;
        const response = await validateCoupon({
            code: form.value.coupon_code,
            customer_id: form.value.customer_id,
            cart_amount: subtotal.value,
        });

        if (response.data.valid) {
            couponValid.value = true;
            couponDiscount.value = response.data.discount_amount || 0;
            success(response.data.message || "Coupon applied successfully!");
        } else {
            couponValid.value = false;
            couponDiscount.value = 0;
            showError(response.data.message || "Invalid coupon");
        }
    } catch (err: any) {
        couponValid.value = false;
        couponDiscount.value = 0;
        showError(err?.data?.message || "Failed to validate coupon");
    } finally {
        validatingCoupon.value = false;
    }
};

// Remove coupon
const removeCoupon = () => {
    form.value.coupon_code = "";
    couponValid.value = false;
    couponDiscount.value = 0;
};

// Submit order
const handleSubmit = async () => {
    // Validation
    if (!form.value.customer_id) {
        showError("Please select a customer");
        return;
    }

    if (form.value.items.length === 0) {
        showError("Please add at least one item");
        return;
    }

    if (!form.value.shipping_address || !form.value.shipping_city || !form.value.shipping_province) {
        showError("Please fill in shipping information");
        return;
    }

    if (!form.value.shipping_phone) {
        showError("Please enter shipping phone number");
        return;
    }

    try {
        loading.value = true;

        const payload = {
            customer_id: form.value.customer_id,
            items: form.value.items.map((item) => ({
                variant_id: item.variant_id,
                quantity: item.quantity,
                price: item.price,
            })),
            shipping_address: form.value.shipping_address,
            shipping_city: form.value.shipping_city,
            shipping_province: form.value.shipping_province,
            shipping_postal_code: form.value.shipping_postal_code || undefined,
            shipping_phone: form.value.shipping_phone,
            courier: form.value.courier || undefined,
            shipping_cost: form.value.shipping_cost,
            payment_method: form.value.payment_method,
            coupon_code: couponValid.value ? form.value.coupon_code : undefined,
            notes: form.value.notes || undefined,
            shipping_notes: form.value.shipping_notes || undefined,
        };

        const response = await createOrder(payload);
        success("Order created successfully!");
        await navigateTo(`/orders/${response.data.id}/show`);
    } catch (err: any) {
        showError(err?.data?.message || "Failed to create order");
        loading.value = false;
    }
};
</script>

<template>
    <div>
        <PageTitle
            :title="'Create Order'"
            :items="[{ label: 'Orders', path: '/orders' }, { label: 'Create', active: true }]" />

        <div class="mt-6">
            <form @submit.prevent="handleSubmit">
                <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <!-- Left Column - Items & Customer -->
                    <div class="lg:col-span-2 space-y-6">
                        <!-- Customer Selection -->
                        <div class="card bg-base-100 shadow">
                            <div class="card-body">
                                <h3 class="card-title">
                                    <span class="iconify lucide--user size-5" />
                                    Customer Information
                                </h3>
                                <div class="space-y-4">
                                    <!-- Selected Customer Display -->
                                    <div v-if="selectedCustomer" class="alert alert-success shadow-sm">
                                        <div class="flex-1">
                                            <div class="flex items-center gap-3">
                                                <div class="avatar placeholder">
                                                    <div class="bg-success-content text-success rounded-full w-12">
                                                        <span class="text-lg">{{ selectedCustomer.name.charAt(0).toUpperCase() }}</span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div class="font-semibold text-base">{{ selectedCustomer.name }}</div>
                                                    <div class="text-sm opacity-80">{{ selectedCustomer.email }}</div>
                                                    <div class="text-xs opacity-70">{{ selectedCustomer.phone }}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            @click="selectedCustomer = null; form.customer_id = null"
                                            class="btn btn-ghost btn-sm btn-square">
                                            <span class="iconify lucide--x size-4" />
                                        </button>
                                    </div>

                                    <!-- Search Customer -->
                                    <div v-else>
                                        <label class="label">
                                            <span class="label-text">Search Customer <span class="text-error">*</span></span>
                                        </label>
                                        <input
                                            v-model="customerSearch"
                                            type="text"
                                            class="input input-bordered w-full"
                                            placeholder="Search by name, email, or phone..." />

                                        <!-- Customer Search Results -->
                                        <div v-if="customerSearch && customers.length > 0" class="mt-2 max-h-64 overflow-y-auto border rounded-lg bg-base-100 shadow-lg">
                                            <div
                                                v-for="customer in customers"
                                                :key="customer.id"
                                                @click="selectCustomer(customer)"
                                                class="p-3 hover:bg-base-200 cursor-pointer border-b last:border-0 transition-colors">
                                                <div class="flex items-center gap-3">
                                                    <div class="avatar placeholder">
                                                        <div class="bg-primary text-primary-content rounded-full w-10">
                                                            <span>{{ customer.name.charAt(0).toUpperCase() }}</span>
                                                        </div>
                                                    </div>
                                                    <div class="flex-1">
                                                        <div class="font-medium">{{ customer.name }}</div>
                                                        <div class="text-sm text-base-content/60">{{ customer.email }}</div>
                                                        <div class="text-xs text-base-content/50">{{ customer.phone }}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div v-else-if="customerSearch && customers.length === 0" class="mt-2 p-4 text-center text-base-content/60 text-sm border rounded-lg">
                                            No customers found
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Add Items -->
                        <div class="card bg-base-100 shadow">
                            <div class="card-body">
                                <h3 class="card-title">
                                    <span class="iconify lucide--shopping-cart size-5" />
                                    Order Items
                                </h3>
                                <div class="space-y-4">
                                    <div>
                                        <label class="label">
                                            <span class="label-text">Search Product/Variant</span>
                                        </label>
                                        <input
                                            v-model="productSearch"
                                            type="text"
                                            class="input input-bordered w-full"
                                            placeholder="Search by name, SKU..." />
                                    </div>
                                    <!-- Product Search Results -->
                                    <div v-if="productSearch && variants.length > 0" class="mt-2 max-h-64 overflow-y-auto border rounded-lg bg-base-100 shadow-lg">
                                        <div
                                            v-for="variant in variants"
                                            :key="variant.id"
                                            @click="addItem(variant)"
                                            class="p-3 hover:bg-base-200 cursor-pointer border-b last:border-0 transition-colors">
                                            <div class="flex items-center gap-3">
                                                <!-- Product Image -->
                                                <div class="avatar">
                                                    <div class="w-16 h-16 rounded-lg">
                                                        <img
                                                            v-if="variant.images && variant.images.length > 0"
                                                            :src="variant.images[0].url"
                                                            :alt="variant.product_name"
                                                            class="object-cover" />
                                                        <div v-else class="w-full h-full bg-base-300 flex items-center justify-center">
                                                            <span class="iconify lucide--image size-6 text-base-content/40" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <!-- Product Info -->
                                                <div class="flex-1">
                                                    <div class="font-medium">{{ variant.product_name }}</div>
                                                    <div class="text-sm text-base-content/60">
                                                        {{ variant.sku }} • {{ variant.size }} • {{ variant.color }}
                                                    </div>
                                                    <div class="text-sm font-semibold text-primary">{{ formatPrice(variant.price) }}</div>
                                                </div>
                                                <!-- Stock Badge -->
                                                <div>
                                                    <div :class="['badge badge-sm', variant.stock_quantity > 0 ? 'badge-success' : 'badge-error']">
                                                        Stock: {{ variant.stock_quantity }}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div v-else-if="productSearch && variants.length === 0" class="mt-2 p-4 text-center text-base-content/60 text-sm border rounded-lg">
                                        No products found
                                    </div>

                                    <!-- Cart Items -->
                                    <div v-if="form.items.length > 0" class="mt-4">
                                        <div class="divider">Cart Items</div>
                                        <div class="space-y-3">
                                            <div
                                                v-for="(item, index) in form.items"
                                                :key="index"
                                                class="flex items-center gap-3 p-3 border rounded-lg bg-base-50 hover:bg-base-100 transition-colors">
                                                <!-- Product Image -->
                                                <div class="avatar">
                                                    <div class="w-16 h-16 rounded-lg">
                                                        <img
                                                            v-if="item.image"
                                                            :src="item.image"
                                                            :alt="item.product_name"
                                                            class="object-cover" />
                                                        <div v-else class="w-full h-full bg-base-300 flex items-center justify-center">
                                                            <span class="iconify lucide--image size-6 text-base-content/40" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <!-- Product Info -->
                                                <div class="flex-1 min-w-0">
                                                    <div class="font-medium truncate">{{ item.product_name }}</div>
                                                    <div class="text-sm text-base-content/60">{{ item.sku }}</div>
                                                    <div class="text-sm font-semibold text-primary">{{ formatPrice(item.price) }}</div>
                                                </div>
                                                <!-- Quantity Controls -->
                                                <div class="flex items-center gap-2">
                                                    <button
                                                        type="button"
                                                        @click="updateQuantity(index, item.quantity - 1)"
                                                        class="btn btn-sm btn-circle btn-ghost">
                                                        <span class="iconify lucide--minus size-4" />
                                                    </button>
                                                    <input
                                                        v-model.number="item.quantity"
                                                        type="number"
                                                        class="input input-sm w-16 text-center"
                                                        min="1"
                                                        :max="item.stock" />
                                                    <button
                                                        type="button"
                                                        @click="updateQuantity(index, item.quantity + 1)"
                                                        class="btn btn-sm btn-circle btn-ghost">
                                                        <span class="iconify lucide--plus size-4" />
                                                    </button>
                                                </div>
                                                <!-- Total Price -->
                                                <div class="font-semibold min-w-28 text-right">
                                                    {{ formatPrice(item.price * item.quantity) }}
                                                </div>
                                                <!-- Remove Button -->
                                                <button
                                                    type="button"
                                                    @click="removeItem(index)"
                                                    class="btn btn-sm btn-circle btn-ghost text-error">
                                                    <span class="iconify lucide--trash-2 size-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div v-else class="text-center py-8 text-base-content/60">
                                        <span class="iconify lucide--shopping-cart size-12 block mx-auto mb-2 opacity-20" />
                                        <p>No items added yet</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Shipping Information -->
                        <div class="card bg-base-100 shadow">
                            <div class="card-body">
                                <h3 class="card-title">
                                    <span class="iconify lucide--truck size-5" />
                                    Shipping Information
                                </h3>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div class="md:col-span-2">
                                        <label class="label">
                                            <span class="label-text">Address <span class="text-error">*</span></span>
                                        </label>
                                        <textarea
                                            v-model="form.shipping_address"
                                            class="textarea textarea-bordered w-full"
                                            rows="2"
                                            placeholder="Full shipping address"
                                            required></textarea>
                                    </div>
                                    <div>
                                        <label class="label">
                                            <span class="label-text">City <span class="text-error">*</span></span>
                                        </label>
                                        <input
                                            v-model="form.shipping_city"
                                            type="text"
                                            class="input input-bordered w-full"
                                            required />
                                    </div>
                                    <div>
                                        <label class="label">
                                            <span class="label-text">Province <span class="text-error">*</span></span>
                                        </label>
                                        <input
                                            v-model="form.shipping_province"
                                            type="text"
                                            class="input input-bordered w-full"
                                            required />
                                    </div>
                                    <div>
                                        <label class="label">
                                            <span class="label-text">Postal Code</span>
                                        </label>
                                        <input
                                            v-model="form.shipping_postal_code"
                                            type="text"
                                            class="input input-bordered w-full" />
                                    </div>
                                    <div>
                                        <label class="label">
                                            <span class="label-text">Phone <span class="text-error">*</span></span>
                                        </label>
                                        <input
                                            v-model="form.shipping_phone"
                                            type="text"
                                            class="input input-bordered w-full"
                                            required />
                                    </div>
                                    <div>
                                        <label class="label">
                                            <span class="label-text">Courier</span>
                                        </label>
                                        <input
                                            v-model="form.courier"
                                            type="text"
                                            class="input input-bordered w-full"
                                            placeholder="JNE, TIKI, etc" />
                                    </div>
                                    <div>
                                        <label class="label">
                                            <span class="label-text">Shipping Cost</span>
                                        </label>
                                        <label class="input input-bordered flex items-center gap-2">
                                            <span class="text-base-content/60">Rp</span>
                                            <input
                                                v-model.number="form.shipping_cost"
                                                type="number"
                                                class="grow"
                                                min="0"
                                                step="any" />
                                        </label>
                                    </div>
                                    <div class="md:col-span-2">
                                        <label class="label">
                                            <span class="label-text">Shipping Notes</span>
                                        </label>
                                        <textarea
                                            v-model="form.shipping_notes"
                                            class="textarea textarea-bordered w-full"
                                            rows="2"
                                            placeholder="Special instructions for delivery"></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Right Column - Summary -->
                    <div class="space-y-6">
                        <!-- Payment Method -->
                        <div class="card bg-base-100 shadow">
                            <div class="card-body">
                                <h3 class="card-title">
                                    <span class="iconify lucide--credit-card size-5" />
                                    Payment
                                </h3>
                                <div class="space-y-3">
                                    <div>
                                        <label class="label">
                                            <span class="label-text">Payment Method</span>
                                        </label>
                                        <select v-model="form.payment_method" class="select select-bordered w-full">
                                            <option value="bank_transfer">Bank Transfer</option>
                                            <option value="credit_card">Credit Card</option>
                                            <option value="e_wallet">E-Wallet</option>
                                            <option value="cod">Cash on Delivery</option>
                                            <option value="installment">Installment</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Coupon -->
                        <div class="card bg-base-100 shadow">
                            <div class="card-body">
                                <h3 class="card-title">
                                    <span class="iconify lucide--ticket size-5" />
                                    Coupon
                                </h3>
                                <div class="space-y-3">
                                    <div v-if="!couponValid">
                                        <div class="flex gap-2">
                                            <input
                                                v-model="form.coupon_code"
                                                type="text"
                                                class="input input-bordered flex-1 uppercase"
                                                placeholder="Enter coupon code" />
                                            <button
                                                type="button"
                                                @click="handleValidateCoupon"
                                                class="btn btn-primary"
                                                :disabled="validatingCoupon || !form.coupon_code">
                                                <span v-if="validatingCoupon" class="loading loading-spinner loading-xs"></span>
                                                <span v-else>Apply</span>
                                            </button>
                                        </div>
                                    </div>
                                    <div v-else class="alert alert-success">
                                        <span class="iconify lucide--check-circle size-5" />
                                        <div class="flex-1">
                                            <div>Coupon applied!</div>
                                            <div class="text-xs">{{ form.coupon_code }}</div>
                                        </div>
                                        <button type="button" @click="removeCoupon" class="btn btn-xs btn-ghost">
                                            <span class="iconify lucide--x size-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Order Summary -->
                        <div class="card bg-base-100 shadow">
                            <div class="card-body">
                                <h3 class="card-title">Order Summary</h3>
                                <div class="space-y-2">
                                    <div class="flex justify-between">
                                        <span>Subtotal</span>
                                        <span class="font-medium">{{ formatPrice(subtotal) }}</span>
                                    </div>
                                    <div v-if="couponDiscount > 0" class="flex justify-between text-success">
                                        <span>Discount</span>
                                        <span class="font-medium">-{{ formatPrice(couponDiscount) }}</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span>Shipping</span>
                                        <span class="font-medium">{{ formatPrice(form.shipping_cost) }}</span>
                                    </div>
                                    <div class="divider my-2"></div>
                                    <div class="flex justify-between text-lg font-bold">
                                        <span>Total</span>
                                        <span>{{ formatPrice(total) }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Notes -->
                        <div class="card bg-base-100 shadow">
                            <div class="card-body">
                                <h3 class="card-title">
                                    <span class="iconify lucide--file-text size-5" />
                                    Notes
                                </h3>
                                <textarea
                                    v-model="form.notes"
                                    class="textarea textarea-bordered w-full"
                                    rows="3"
                                    placeholder="Internal notes (optional)"></textarea>
                            </div>
                        </div>

                        <!-- Actions -->
                        <div class="flex flex-col gap-2">
                            <button type="submit" class="btn btn-primary btn-block" :disabled="loading">
                                <span v-if="loading" class="loading loading-spinner"></span>
                                <span v-else class="iconify lucide--check size-4" />
                                {{ loading ? "Creating Order..." : "Create Order" }}
                            </button>
                            <NuxtLink href="/orders" class="btn btn-ghost btn-block">
                                <span class="iconify lucide--x size-4" />
                                Cancel
                            </NuxtLink>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>
