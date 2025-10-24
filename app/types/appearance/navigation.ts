export interface Menu {
    id: number;
    title: string;
    link_type: 'static' | 'category' | 'product' | 'brand' | 'external';
    url?: string;
    category_id?: number;
    product_id?: number;
    brand_id?: number;
    parent_id?: number;
    order: number;
    is_clickable: boolean;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    category?: {
        id: number;
        name: string;
        slug: string;
    };
    product?: {
        id: number;
        name: string;
        slug: string;
    };
    brand?: {
        id: number;
        name: string;
        slug: string;
    };
    children?: Menu[];
    has_children?: boolean;
    menu_locations?: MenuLocation[];
}

export interface MenuLocation {
    id: number;
    menu_id: number;
    location: 'header' | 'footer' | 'mobile';
    created_at: string;
    updated_at: string;
}

export interface MenuFormData {
    title: string;
    link_type: 'static' | 'category' | 'product' | 'brand' | 'external';
    url?: string;
    category_id?: number;
    product_id?: number;
    brand_id?: number;
    parent_id?: number;
    order: number;
    is_clickable: boolean;
    is_active: boolean;
    menu_locations: ('header' | 'footer' | 'mobile')[];
}

export interface BulkCreateCategoriesData {
    parent_id?: number;
    categories: number[];
    auto_title: boolean;
    is_clickable: boolean;
    is_active: boolean;
    menu_locations: ('header' | 'footer' | 'mobile')[];
}

export interface BulkCreateBrandsData {
    parent_id?: number;
    brands: number[];
    auto_title: boolean;
    is_clickable: boolean;
    is_active: boolean;
    menu_locations: ('header' | 'footer' | 'mobile')[];
}

export interface ReorderMenusData {
    orders: {
        id: number;
        order: number;
    }[];
}

export interface MenuStatistics {
    total_menus: number;
    active_menus: number;
    inactive_menus: number;
    header_menus: number;
    footer_menus: number;
    mobile_menus: number;
    parent_menus: number;
    child_menus: number;
}

export interface MenusListResponse {
    status: boolean;
    message: string;
    data: {
        menus: {
            data: Menu[];
            current_page: number;
            last_page: number;
            per_page: number;
            total: number;
            from: number;
            to: number;
        };
        statistics: MenuStatistics;
    };
}

export interface MenuDetailResponse {
    status: boolean;
    message: string;
    data: {
        menu: Menu;
    };
}

export interface MenuCreateResponse {
    status: boolean;
    message: string;
    data: {
        menu: Menu;
    };
}

export interface MenuUpdateResponse {
    status: boolean;
    message: string;
    data: {
        menu: Menu;
    };
}

export interface MenuDeleteResponse {
    status: boolean;
    message: string;
}

export interface MenuReorderResponse {
    status: boolean;
    message: string;
}

export interface BulkCreateCategoriesResponse {
    status: boolean;
    message: string;
    data: {
        menus: Menu[];
        count: number;
    };
}

export interface BulkCreateBrandsResponse {
    status: boolean;
    message: string;
    data: {
        menus: Menu[];
        count: number;
    };
}
