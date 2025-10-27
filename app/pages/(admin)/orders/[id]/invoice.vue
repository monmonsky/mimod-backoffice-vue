<script setup lang="ts">
import { formatPrice, formatDate } from "~/utils/formatters";

definePageMeta({
    layout: "admin",
    middleware: "auth",
});

const route = useRoute();
const orderId = Number(route.params.id);

const { setPageTitleFromMenu } = useAdminMenu();
setPageTitleFromMenu();

// Fetch invoice data
const { data: invoiceResponse, pending: loading } = await useAsyncData(
    `invoice-${orderId}`,
    () =>
        $fetch(`/orders/${orderId}/invoice`, {
            baseURL: useRuntimeConfig().public.apiBase,
            headers: {
                Authorization: `Bearer ${useAuthStore().token}`,
            },
        })
);

const invoice = computed(() => (invoiceResponse.value as any)?.data || {});

// Print function
const handlePrint = () => {
    window.print();
};
</script>

<template>
    <div class="p-6">
        <!-- Action Bar (Hidden on print) -->
        <div class="flex items-center justify-between mb-6 print:hidden">
            <div class="flex items-center gap-4">
                <NuxtLink :to="`/orders/${orderId}/show`" class="btn btn-ghost btn-sm">
                    <span class="iconify lucide--arrow-left size-4" />
                    Back to Order
                </NuxtLink>
            </div>
            <div class="flex items-center gap-3">
                <button @click="handlePrint" class="btn btn-primary btn-sm">
                    <span class="iconify lucide--printer size-4" />
                    Print Invoice
                </button>
            </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex items-center justify-center py-12">
            <span class="loading loading-spinner loading-lg"></span>
        </div>

        <!-- Invoice Content -->
        <div v-else class="card bg-base-100 shadow-xl max-w-4xl mx-auto">
            <div class="card-body p-8 sm:p-12">
                <!-- Invoice Header -->
                <div class="flex justify-between items-start mb-8">
                    <div>
                        <h1 class="text-3xl font-bold text-primary">INVOICE</h1>
                        <p class="text-base-content/60 mt-1">{{ invoice.invoice?.invoice_number }}</p>
                    </div>
                    <div class="text-right">
                        <h2 class="text-2xl font-bold">{{ invoice.store?.name }}</h2>
                        <p class="text-base-content/60">{{ invoice.store?.email }}</p>
                        <p class="text-base-content/60">{{ invoice.store?.phone }}</p>
                        <p class="text-base-content/60">{{ invoice.store?.address }}</p>
                    </div>
                </div>

                <div class="divider"></div>

                <!-- Invoice Info & Customer -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <!-- Invoice Details -->
                    <div>
                        <h3 class="font-semibold text-lg mb-3">Invoice Details</h3>
                        <div class="space-y-2">
                            <div class="flex justify-between">
                                <span class="text-base-content/60">Invoice Date:</span>
                                <span class="font-medium">{{ formatDate(invoice.invoice?.invoice_date, 'date') }}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-base-content/60">Status:</span>
                                <span :class="['badge badge-sm', invoice.invoice?.status === 'completed' ? 'badge-success' : 'badge-warning']">
                                    {{ invoice.invoice?.status }}
                                </span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-base-content/60">Payment Status:</span>
                                <span :class="['badge badge-sm', invoice.payment?.status === 'paid' ? 'badge-success' : 'badge-error']">
                                    {{ invoice.payment?.status }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Customer Details -->
                    <div>
                        <h3 class="font-semibold text-lg mb-3">Bill To</h3>
                        <div class="space-y-1">
                            <p class="font-medium">{{ invoice.customer?.name }}</p>
                            <p class="text-base-content/60">{{ invoice.customer?.email }}</p>
                            <p class="text-base-content/60">{{ invoice.customer?.phone }}</p>
                            <p class="text-base-content/60">{{ invoice.customer?.address }}</p>
                        </div>
                    </div>
                </div>

                <!-- Items Table -->
                <div class="mb-8">
                    <h3 class="font-semibold text-lg mb-4">Items</h3>
                    <div class="overflow-x-auto">
                        <table class="table table-zebra">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>SKU</th>
                                    <th class="text-center">Qty</th>
                                    <th class="text-right">Price</th>
                                    <th class="text-right">Discount</th>
                                    <th class="text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item in invoice.items" :key="item.id">
                                    <td>
                                        <div>
                                            <p class="font-medium">{{ item.product_name }}</p>
                                            <p class="text-xs text-base-content/60">
                                                <span v-if="item.size">Size: {{ item.size }}</span>
                                                <span v-if="item.color"> • Color: {{ item.color }}</span>
                                            </p>
                                        </div>
                                    </td>
                                    <td class="text-sm text-base-content/60">{{ item.sku }}</td>
                                    <td class="text-center">{{ item.quantity }}</td>
                                    <td class="text-right">{{ formatPrice(item.price) }}</td>
                                    <td class="text-right">{{ formatPrice(item.discount_amount) }}</td>
                                    <td class="text-right font-medium">{{ formatPrice(item.total) }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Summary -->
                <div class="flex justify-end mb-8">
                    <div class="w-full md:w-1/2">
                        <div class="space-y-2">
                            <div class="flex justify-between">
                                <span class="text-base-content/60">Subtotal:</span>
                                <span>{{ formatPrice(invoice.summary?.subtotal) }}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-base-content/60">Shipping:</span>
                                <span>{{ formatPrice(invoice.summary?.shipping_cost) }}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-base-content/60">Tax:</span>
                                <span>{{ formatPrice(invoice.summary?.tax_amount) }}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-base-content/60">Discount:</span>
                                <span class="text-error">-{{ formatPrice(invoice.summary?.discount_amount) }}</span>
                            </div>
                            <div class="divider my-2"></div>
                            <div class="flex justify-between text-xl font-bold">
                                <span>Total:</span>
                                <span class="text-primary">{{ formatPrice(invoice.summary?.total_amount) }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Payment & Shipping Info -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <!-- Payment Info -->
                    <div>
                        <h3 class="font-semibold text-lg mb-3">Payment Information</h3>
                        <div class="space-y-2">
                            <div class="flex justify-between">
                                <span class="text-base-content/60">Method:</span>
                                <span class="font-medium">{{ invoice.payment?.method || 'Not specified' }}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-base-content/60">Status:</span>
                                <span :class="['badge badge-sm', invoice.payment?.status === 'paid' ? 'badge-success' : 'badge-error']">
                                    {{ invoice.payment?.status }}
                                </span>
                            </div>
                            <div v-if="invoice.payment?.paid_at" class="flex justify-between">
                                <span class="text-base-content/60">Paid At:</span>
                                <span class="font-medium">{{ formatDate(invoice.payment.paid_at, 'datetime') }}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Shipping Info -->
                    <div>
                        <h3 class="font-semibold text-lg mb-3">Shipping Information</h3>
                        <div class="space-y-2">
                            <div class="flex justify-between">
                                <span class="text-base-content/60">Courier:</span>
                                <span class="font-medium">{{ invoice.shipping?.courier || 'Not specified' }}</span>
                            </div>
                            <div v-if="invoice.shipping?.tracking_number" class="flex justify-between">
                                <span class="text-base-content/60">Tracking:</span>
                                <span class="font-medium">{{ invoice.shipping.tracking_number }}</span>
                            </div>
                            <div v-if="invoice.shipping?.shipped_at" class="flex justify-between">
                                <span class="text-base-content/60">Shipped At:</span>
                                <span class="font-medium">{{ formatDate(invoice.shipping.shipped_at, 'datetime') }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Notes -->
                <div v-if="invoice.notes" class="mt-8">
                    <h3 class="font-semibold text-lg mb-3">Notes</h3>
                    <p class="text-base-content/80">{{ invoice.notes }}</p>
                </div>

                <!-- Footer -->
                <div class="mt-12 pt-8 border-t border-base-300 text-center text-base-content/60 text-sm">
                    <p>Thank you for your business!</p>
                    <p class="mt-2">This is a computer-generated invoice and does not require a signature.</p>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
@media print {
    body {
        print-color-adjust: exact;
        -webkit-print-color-adjust: exact;
    }

    .print\:hidden {
        display: none !important;
    }

    @page {
        margin: 1cm;
    }
}
</style>
