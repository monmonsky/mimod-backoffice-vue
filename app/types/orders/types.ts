export type OrderStatus = "pending" | "processing" | "shipped" | "completed" | "cancelled";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";
export type PaymentMethod = "bank_transfer" | "credit_card" | "e_wallet" | "cod" | "installment";

export interface OrderItem {
    id: number;
    order_id: number;
    variant_id: number;
    product_name: string;
    sku: string;
    size: string;
    color: string;
    quantity: number;
    price: number;
    subtotal: number;
    discount_amount: number;
    total: number;
}

export interface Order {
    id: number;
    order_number: string;
    customer_id: number;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    status: OrderStatus;
    payment_method: PaymentMethod;
    payment_status: PaymentStatus;
    shipping_address: string;
    shipping_city: string;
    shipping_province: string;
    shipping_postal_code: string | null;
    shipping_phone: string;
    courier: string | null;
    shipping_cost: number;
    subtotal: number;
    tax_amount: number;
    discount_amount: number;
    total_amount: number;
    notes: string | null;
    shipping_notes: string | null;
    items?: OrderItem[];
    created_at: string;
    updated_at: string;
}

export interface OrderItemInput {
    variant_id: number;
    quantity: number;
    price: number;
}

export interface CreateOrderData {
    customer_id: number;
    items: OrderItemInput[];
    shipping_address: string;
    shipping_city: string;
    shipping_province: string;
    shipping_postal_code?: string;
    shipping_phone: string;
    courier?: string;
    shipping_cost: number;
    payment_method: PaymentMethod;
    coupon_code?: string;
    notes?: string;
    shipping_notes?: string;
}

export interface OrderStatistics {
    total: number;
    pending: number;
    processing: number;
    shipped: number;
    completed: number;
    cancelled: number;
    total_revenue: number;
}
