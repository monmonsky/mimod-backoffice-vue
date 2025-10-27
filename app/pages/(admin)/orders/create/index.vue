<script setup lang="ts">
import PageTitle from "~/components/PageTitle.vue";
import type { PaymentMethod } from "~/types/orders";

definePageMeta({
    layout: "admin",
});

const { createOrder } = useOrders();
const { validateCoupon } = useCoupons();
const { success, error: showError } = useToast();

// Fetch payment methods
const { data: paymentMethodsData } = await useAsyncData("payment-methods-list", () =>
    $fetch("/payment-methods", {
        baseURL: useRuntimeConfig().public.apiBase,
        headers: {
            Authorization: `Bearer ${useAuthStore().token}`,
        },
        params: { status: "active", per_page: 100 },
    })
);

const paymentMethods = computed(() => {
    const response = paymentMethodsData.value as any;
    // Handle both response.data (array) and response.data.data (nested)
    let methods = response?.data || [];
    if (!Array.isArray(methods) && response?.data?.data) {
        methods = response.data.data;
    }
    // Ensure methods is an array
    if (!Array.isArray(methods)) {
        return [];
    }
    // Filter only active methods (is_active === true)
    return methods.filter((method: any) => method.is_active === true);
});

// Fetch shipping methods
const { data: shippingMethodsData } = await useAsyncData("shipping-methods-list", () =>
    $fetch("/shipping-methods", {
        baseURL: useRuntimeConfig().public.apiBase,
        headers: {
            Authorization: `Bearer ${useAuthStore().token}`,
        },
        params: { status: "active", per_page: 100 },
    })
);

const shippingMethods = computed(() => {
    const response = shippingMethodsData.value as any;
    // Handle nested data structure: response.data.data
    const methods = response?.data?.data || [];
    // Ensure methods is an array
    if (!Array.isArray(methods)) {
        return [];
    }
    // Filter only active methods (is_active === true)
    return methods.filter((method: any) => method.is_active === true);
});

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
        weight?: number;
    }>,
    shipping_address: "",
    shipping_city: "",
    shipping_province: "",
    shipping_postal_code: "",
    shipping_phone: "",
    shipping_method_id: null as number | null,
    shipping_cost: 0,
    payment_method_id: null as number | null,
    coupon_code: "",
    notes: "",
    shipping_notes: "",
});

const loading = ref(false);
const validatingCoupon = ref(false);
const couponValid = ref(false);
const couponDiscount = ref(0);

// RajaOngkir location
const selectedLocation = ref<any>(null);
const calculatingShipping = ref(false);
const shippingCostOptions = ref<any[]>([]);

// Fetch RajaOngkir config
const { data: rajaongkirConfigData } = await useAsyncData("rajaongkir-config", () =>
    $fetch("/shipping-method-configs/4", {
        baseURL: useRuntimeConfig().public.apiBase,
        headers: {
            Authorization: `Bearer ${useAuthStore().token}`,
        },
    })
);

const rajaongkirConfig = computed(() => {
    const response = rajaongkirConfigData.value as any;
    return response?.data || null;
});

// Calculate total weight from items
const totalWeight = computed(() => {
    // Assuming each item has a weight, if not available, use default 500g per item
    return form.value.items.reduce((total, item) => {
        const weight = (item as any).weight || 500; // default 500g
        return total + (weight * item.quantity);
    }, 0);
});

// Calculate shipping cost using RajaOngkir
const calculateShippingCost = async () => {
    if (!selectedLocation.value) {
        showError("Please select shipping location first");
        return;
    }

    if (!form.value.shipping_method_id) {
        showError("Please select shipping method first");
        return;
    }

    if (totalWeight.value === 0) {
        showError("Please add items to calculate shipping cost");
        return;
    }

    const selectedMethod = shippingMethods.value.find((m: any) => m.id === form.value.shipping_method_id);
    if (!selectedMethod) return;

    // Get courier code from provider field
    const courierCode = selectedMethod.provider || selectedMethod.code;
    if (!courierCode) {
        showError("Shipping method provider not found");
        return;
    }

    // Get origin from config (use origin_city_id or origin)
    const origin = rajaongkirConfig.value?.configs?.origin_city_id || rajaongkirConfig.value?.configs?.origin || null;
    if (!origin) {
        showError("Origin location not configured. Please set origin_city_id in RajaOngkir shipping config.");
        return;
    }

    try {
        calculatingShipping.value = true;

        // Use local API proxy
        const response = await $fetch('/rajaongkir/calculate-cost', {
            baseURL: useRuntimeConfig().public.apiBase,
            method: 'POST',
            headers: {
                Authorization: `Bearer ${useAuthStore().token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: {
                origin: parseInt(origin),
                destination: selectedLocation.value.id,
                weight: totalWeight.value,
                courier: courierCode.toLowerCase(),
                price: 'lowest'
            }
        });

        const data = response as any;
        if (data.status && data.data && data.data.length > 0) {
            shippingCostOptions.value = data.data;
            // Reset shipping cost, user must choose from options
            form.value.shipping_cost = 0;
            success(`Found ${data.data.length} shipping service(s). Please choose one.`);
        } else {
            showError("No shipping services available");
        }
    } catch (error: any) {
        console.error('Failed to calculate shipping cost:', error);
        showError(error?.data?.message || "Failed to calculate shipping cost");
    } finally {
        calculatingShipping.value = false;
    }
};

// Watch location changes and update form
watch(selectedLocation, (location) => {
    if (location) {
        form.value.shipping_city = location.city_name;
        form.value.shipping_province = location.province_name;
        form.value.shipping_postal_code = location.zip_code;
        // Update address with district and subdistrict if empty
        if (!form.value.shipping_address) {
            form.value.shipping_address = `${location.subdistrict_name}, ${location.district_name}`;
        }
        // Reset shipping cost options when location changes
        shippingCostOptions.value = [];
        form.value.shipping_cost = 0;
    }
});

// Watch shipping method changes to auto-calculate
watch(() => form.value.shipping_method_id, async (newMethodId, oldMethodId) => {
    console.log('Shipping method changed:', { newMethodId, oldMethodId, location: selectedLocation.value, weight: totalWeight.value });

    // Reset shipping cost options when method changes
    if (newMethodId !== oldMethodId) {
        shippingCostOptions.value = [];
        form.value.shipping_cost = 0;
    }

    // Auto-calculate if all required data available
    if (newMethodId && selectedLocation.value && totalWeight.value > 0) {
        console.log('Auto-calculating shipping cost...');
        await calculateShippingCost();
    } else {
        console.log('Auto-calculate skipped. Missing:', {
            hasMethod: !!newMethodId,
            hasLocation: !!selectedLocation.value,
            hasWeight: totalWeight.value > 0
        });
    }
});

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
            weight: variant.weight || 500, // Default 500g if not specified
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

    if (!selectedLocation.value) {
        showError("Please search and select a shipping location from RajaOngkir");
        return;
    }

    if (!form.value.shipping_address) {
        showError("Please enter street address");
        return;
    }

    if (!form.value.shipping_phone) {
        showError("Please enter shipping phone number");
        return;
    }

    if (!form.value.payment_method_id) {
        showError("Please select a payment method");
        return;
    }

    if (!form.value.shipping_method_id) {
        showError("Please select a shipping method");
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
            shipping_method_id: form.value.shipping_method_id,
            shipping_cost: form.value.shipping_cost,
            payment_method_id: form.value.payment_method_id,
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
                                    <div v-if="selectedCustomer" class="border border-base-300 rounded-lg p-4 bg-base-50">
                                        <div class="flex items-center gap-4">
                                            <div class="avatar placeholder">
                                                <div class="bg-primary text-primary-content rounded-full w-12 h-12">
                                                    <span class="text-lg font-semibold">{{ selectedCustomer.name.charAt(0).toUpperCase() }}</span>
                                                </div>
                                            </div>
                                            <div class="flex-1">
                                                <div class="font-semibold text-base">{{ selectedCustomer.name }}</div>
                                                <div class="text-sm text-base-content/70">{{ selectedCustomer.email }}</div>
                                                <div class="text-sm text-base-content/60">{{ selectedCustomer.phone }}</div>
                                            </div>
                                            <button
                                                type="button"
                                                @click="selectedCustomer = null; form.customer_id = null"
                                                class="btn btn-ghost btn-sm btn-circle"
                                                aria-label="Remove customer">
                                                <span class="iconify lucide--x size-4" />
                                            </button>
                                        </div>
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

                        <!-- Notes -->
                        <div class="card bg-base-100 shadow">
                            <div class="card-body">
                                <h3 class="card-title">
                                    <span class="iconify lucide--file-text size-5" />
                                    Notes
                                </h3>
                                <RichTextEditor
                                    v-model="form.notes"
                                    placeholder="Internal notes (optional)" />
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
                                    <!-- Location Search (RajaOngkir) -->
                                    <div class="md:col-span-2">
                                        <label class="label">
                                            <span class="label-text">Search Location (RajaOngkir) <span class="text-error">*</span></span>
                                        </label>
                                        <RajaOngkirLocationSearch
                                            v-model="selectedLocation"
                                            placeholder="Type to search city, district, or subdistrict..."
                                            :required="true" />
                                        <div class="text-xs text-base-content/60 mt-1 px-1">
                                            Search by city, district, or subdistrict name. City, province, and postal code will be auto-filled.
                                        </div>
                                    </div>

                                    <!-- Address -->
                                    <div class="md:col-span-2">
                                        <label class="label">
                                            <span class="label-text">Street Address <span class="text-error">*</span></span>
                                        </label>
                                        <textarea
                                            v-model="form.shipping_address"
                                            class="textarea textarea-bordered w-full"
                                            rows="2"
                                            placeholder="Street name, building number, floor, etc."
                                            required></textarea>
                                    </div>

                                    <!-- Phone -->
                                    <div class="md:col-span-2">
                                        <label class="label">
                                            <span class="label-text">Phone <span class="text-error">*</span></span>
                                        </label>
                                        <input
                                            v-model="form.shipping_phone"
                                            type="text"
                                            class="input input-bordered w-full"
                                            placeholder="08xxxxxxxxxx"
                                            required />
                                    </div>

                                    <!-- Auto-filled fields (read-only) -->
                                    <div>
                                        <label class="label">
                                            <span class="label-text">City</span>
                                        </label>
                                        <input
                                            v-model="form.shipping_city"
                                            type="text"
                                            class="input input-bordered w-full"
                                            readonly
                                            placeholder="Auto-filled from location" />
                                    </div>
                                    <div>
                                        <label class="label">
                                            <span class="label-text">Province</span>
                                        </label>
                                        <input
                                            v-model="form.shipping_province"
                                            type="text"
                                            class="input input-bordered w-full"
                                            readonly
                                            placeholder="Auto-filled from location" />
                                    </div>
                                    <div class="md:col-span-2">
                                        <label class="label">
                                            <span class="label-text">Postal Code</span>
                                        </label>
                                        <input
                                            v-model="form.shipping_postal_code"
                                            type="text"
                                            class="input input-bordered w-full"
                                            readonly
                                            placeholder="Auto-filled from location" />
                                    </div>
                                    <div class="md:col-span-2">
                                        <label class="label">
                                            <span class="label-text">Shipping Method <span class="text-error">*</span></span>
                                        </label>
                                        <select v-model="form.shipping_method_id" class="select select-bordered w-full" required>
                                            <option :value="null" disabled>Select shipping method...</option>
                                            <option
                                                v-for="method in shippingMethods"
                                                :key="method.id"
                                                :value="method.id">
                                                {{ method.name }} - {{ method.estimated_delivery }}
                                            </option>
                                        </select>
                                        <div v-if="totalWeight > 0" class="text-xs text-base-content/60 mt-1 px-1">
                                            Total weight: {{ (totalWeight / 1000).toFixed(2) }} kg
                                        </div>
                                    </div>
                                    <div class="md:col-span-2">
                                        <label class="label">
                                            <span class="label-text flex items-center gap-2">
                                                Shipping Cost <span class="text-error">*</span>
                                                <button
                                                    v-if="selectedLocation && form.shipping_method_id && totalWeight > 0"
                                                    type="button"
                                                    @click="calculateShippingCost"
                                                    class="btn btn-xs btn-primary"
                                                    :disabled="calculatingShipping">
                                                    <span v-if="calculatingShipping" class="loading loading-spinner loading-xs"></span>
                                                    <span v-else class="iconify lucide--calculator size-3" />
                                                    {{ calculatingShipping ? 'Calculating...' : (shippingCostOptions.length > 0 ? 'Re-calculate' : 'Calculate') }}
                                                </button>
                                            </span>
                                        </label>
                                        <label class="input input-bordered flex items-center gap-2" :class="{ 'input-disabled': shippingCostOptions.length > 0 }">
                                            <span class="text-base-content/60">Rp</span>
                                            <input
                                                v-model.number="form.shipping_cost"
                                                type="number"
                                                class="grow"
                                                min="0"
                                                step="any"
                                                :readonly="true"
                                                placeholder="Choose service below" />
                                        </label>
                                        <div v-if="form.shipping_cost === 0 && shippingCostOptions.length > 0" class="text-xs text-warning mt-1 px-1">
                                            <span class="iconify lucide--alert-circle size-3 inline-block" />
                                            Please select a shipping service below
                                        </div>
                                        <!-- Shipping Cost Options -->
                                        <div v-if="shippingCostOptions.length > 0" class="mt-4">
                                            <div class="text-sm text-base-content/80 font-semibold mb-3">
                                                <span class="iconify lucide--package size-4 inline-block mr-1" />
                                                Choose Shipping Service:
                                            </div>
                                            <div class="grid grid-cols-1 gap-3">
                                                <div
                                                    v-for="(option, index) in shippingCostOptions"
                                                    :key="index"
                                                    @click="form.shipping_cost = parseFloat(option.cost)"
                                                    class="card bg-base-100 border-2 cursor-pointer transition-all hover:shadow-md"
                                                    :class="{
                                                        'border-primary bg-primary/5 shadow-md': form.shipping_cost === parseFloat(option.cost),
                                                        'border-base-300 hover:border-primary/50': form.shipping_cost !== parseFloat(option.cost)
                                                    }">
                                                    <div class="card-body p-4">
                                                        <div class="flex items-start justify-between gap-3">
                                                            <div class="flex-1">
                                                                <div class="flex items-center gap-2">
                                                                    <span class="font-bold text-base">{{ option.service }}</span>
                                                                    <span
                                                                        v-if="form.shipping_cost === parseFloat(option.cost)"
                                                                        class="badge badge-primary badge-sm">
                                                                        Selected
                                                                    </span>
                                                                </div>
                                                                <p class="text-sm text-base-content/70 mt-1">{{ option.description }}</p>
                                                                <div class="flex items-center gap-3 mt-2">
                                                                    <div class="badge badge-ghost badge-sm">
                                                                        <span class="iconify lucide--clock size-3 mr-1" />
                                                                        {{ option.etd }}
                                                                    </div>
                                                                    <div class="badge badge-ghost badge-sm">
                                                                        <span class="iconify lucide--building-2 size-3 mr-1" />
                                                                        {{ option.name }}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div class="text-right">
                                                                <div class="text-2xl font-bold text-primary">
                                                                    {{ formatPrice(option.cost) }}
                                                                </div>
                                                                <div class="text-xs text-base-content/60 mt-1">
                                                                    per {{ (totalWeight / 1000).toFixed(2) }} kg
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
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
                                            <span class="label-text">Payment Method <span class="text-error">*</span></span>
                                        </label>
                                        <select v-model="form.payment_method_id" class="select select-bordered w-full" required>
                                            <option :value="null" disabled>Select payment method...</option>
                                            <option
                                                v-for="method in paymentMethods"
                                                :key="method.id"
                                                :value="method.id">
                                                {{ method.name }}
                                            </option>
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
