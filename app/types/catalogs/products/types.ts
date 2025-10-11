import type { Brand } from "../brands/types";
import type { Category } from "../categories/types";

export interface ProductImage {
    id: number;
    product_id: number;
    url: string;
    alt_text: string | null;
    is_primary: boolean;
    sort_order: number;
    created_at: string;
}

export interface VariantImage {
    id: number;
    variant_id: number;
    url: string;
    alt_text: string | null;
    is_primary: boolean;
    sort_order: number;
    created_at: string;
}

export interface ProductVariant {
    id: number;
    product_id: number;
    sku: string;
    size: string;
    color: string;
    weight_gram: number;
    price: string;
    compare_at_price: string | null;
    stock_quantity: number;
    reserved_quantity: number;
    barcode: string | null;
    images: VariantImage[];
    created_at: string;
    updated_at: string;
}

export interface Product {
    id: number;
    name: string;
    slug: string;
    description: string;
    brand_id: number;
    brand_name?: string;
    brand?: Brand;
    categories?: Category[];
    age_min: number;
    age_max: number;
    tags: string; // JSON string
    status: "active" | "inactive" | "draft";
    seo_meta: string | null;
    view_count: number;
    is_featured: boolean;
    created_by: number | null;
    total_variants?: number;
    variants?: ProductVariant[];
    images?: ProductImage[]; // Array of image objects
    created_at: string;
    updated_at: string;
}

export interface ProductFormData {
    name: string;
    slug: string;
    description: string;
    brand_id: number | string;
    category_ids: number[];
    age_min: number;
    age_max: number;
    tags: string[];
    images: string[];
    status: "active" | "inactive" | "draft";
    is_featured: boolean;
}

export interface ProductStatistics {
    total: number;
    active: number;
    inactive: number;
    draft: number;
    featured: number;
    total_variants: number;
    total_stock: number;
    low_stock: number;
}
