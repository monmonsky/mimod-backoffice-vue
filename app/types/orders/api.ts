import type { Order, OrderStatistics } from "./types";

export interface OrdersListResponse {
    status: boolean;
    statusCode: number;
    message: string;
    data: {
        orders: {
            current_page: number;
            data: Order[];
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
        statistics: OrderStatistics;
    };
}

export interface OrderDetailResponse {
    status: boolean;
    statusCode: number;
    message: string;
    data: Order;
}

export interface OrderCreateResponse {
    status: boolean;
    statusCode: number;
    message: string;
    data: Order;
}

export interface OrderUpdateResponse {
    status: boolean;
    statusCode: number;
    message: string;
    data: Order;
}

export interface OrderDeleteResponse {
    status: boolean;
    statusCode: number;
    message: string;
}
