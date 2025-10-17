import type { Coupon, CouponStatistics, CouponUsage, ValidateCouponResponse } from "./types";

export interface CouponsListResponse {
    status: boolean;
    statusCode: number;
    message: string;
    data: {
        coupons: {
            current_page: number;
            data: Coupon[];
            first_page_url: string;
            from: number;
            last_page: number;
            last_page_url: string;
            next_page_url: string | null;
            path: string;
            per_page: number;
            prev_page_url: string | null;
            to: number;
            total: number;
        };
        statistics: CouponStatistics;
    };
}

export interface CouponDetailResponse {
    status: boolean;
    statusCode: number;
    message: string;
    data: Coupon & {
        usage_history?: CouponUsage[];
    };
}

export interface CouponCreateResponse {
    status: boolean;
    statusCode: number;
    message: string;
    data: Coupon;
}

export interface CouponUpdateResponse {
    status: boolean;
    statusCode: number;
    message: string;
    data: Coupon;
}

export interface CouponDeleteResponse {
    status: boolean;
    statusCode: number;
    message: string;
}

export interface CouponValidateResponse {
    status: boolean;
    statusCode: number;
    message: string;
    data: ValidateCouponResponse;
}
