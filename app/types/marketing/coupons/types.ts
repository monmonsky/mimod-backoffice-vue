export type CouponType = "percentage" | "fixed" | "free_shipping";

export interface Coupon {
    id: number;
    code: string;
    name: string;
    description: string | null;
    type: CouponType;
    value: number;
    max_discount: number | null;
    min_purchase: number;
    usage_limit: number | null;
    usage_limit_per_customer: number | null;
    used_count: number;
    start_date: string;
    end_date: string;
    is_active: boolean;
    created_by: number | null;
    created_at: string;
    updated_at: string;
}

export interface CouponFormData {
    code: string;
    name: string;
    description?: string;
    type: CouponType;
    value: number;
    max_discount?: number;
    min_purchase: number;
    usage_limit?: number;
    usage_limit_per_customer?: number;
    start_date: string;
    end_date: string;
    is_active: boolean;
}

export interface CouponStatistics {
    total: number;
    active: number;
    inactive: number;
    expired: number;
    total_usage: number;
}

export interface CouponUsage {
    id: number;
    coupon_id: number;
    customer_id: number;
    order_id: number;
    discount_amount: number;
    used_at: string;
    customer_name?: string;
}

export interface ValidateCouponRequest {
    code: string;
    customer_id: number;
    cart_amount: number;
}

export interface ValidateCouponResponse {
    valid: boolean;
    message: string;
    discount_amount?: number;
    coupon?: Coupon;
}
