import type {
    CouponsListResponse,
    CouponDetailResponse,
    CouponCreateResponse,
    CouponUpdateResponse,
    CouponDeleteResponse,
    CouponValidateResponse,
    CouponFormData,
    ValidateCouponRequest,
} from "~/types/marketing/coupons";
import type { PaginationParams } from "./usePagination";

export const useCoupons = () => {
    const config = useRuntimeConfig();
    const authStore = useAuthStore();
    const { buildPaginationParams } = usePagination();

    const getCoupons = (params?: Partial<PaginationParams>, options?: { watch?: any[] }) => {
        // Apply default pagination params (per_page: 20)
        const paginationParams = buildPaginationParams(params);

        return useAsyncData<CouponsListResponse>(
            "coupons",
            () =>
                $fetch("/marketing/coupons", {
                    baseURL: config.public.apiBase,
                    headers: {
                        Authorization: `Bearer ${authStore.token}`,
                    },
                    params: paginationParams,
                }),
            {
                watch: options?.watch || [],
            },
        );
    };

    const getCoupon = (id: number) => {
        return useAsyncData<CouponDetailResponse>(`coupon-${id}`, () =>
            $fetch(`/marketing/coupons/${id}`, {
                baseURL: config.public.apiBase,
                headers: {
                    Authorization: `Bearer ${authStore.token}`,
                },
            }),
        );
    };

    const createCoupon = async (data: Partial<CouponFormData>) => {
        return await $fetch<CouponCreateResponse>("/marketing/coupons", {
            method: "POST",
            baseURL: config.public.apiBase,
            headers: {
                Authorization: `Bearer ${authStore.token}`,
            },
            body: data,
        });
    };

    const updateCoupon = async (id: number, data: Partial<CouponFormData>) => {
        return await $fetch<CouponUpdateResponse>(`/marketing/coupons/${id}`, {
            method: "PUT",
            baseURL: config.public.apiBase,
            headers: {
                Authorization: `Bearer ${authStore.token}`,
            },
            body: data,
        });
    };

    const deleteCoupon = async (id: number) => {
        return await $fetch<CouponDeleteResponse>(`/marketing/coupons/${id}`, {
            method: "DELETE",
            baseURL: config.public.apiBase,
            headers: {
                Authorization: `Bearer ${authStore.token}`,
            },
        });
    };

    const validateCoupon = async (data: ValidateCouponRequest) => {
        return await $fetch<CouponValidateResponse>("/marketing/coupons/validate", {
            method: "POST",
            baseURL: config.public.apiBase,
            headers: {
                Authorization: `Bearer ${authStore.token}`,
            },
            body: data,
        });
    };

    return {
        getCoupons,
        getCoupon,
        createCoupon,
        updateCoupon,
        deleteCoupon,
        validateCoupon,
    };
};
