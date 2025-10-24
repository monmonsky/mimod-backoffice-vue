export interface ProductAttribute {
    id: number;
    name: string;
    slug: string;
    type: 'select' | 'color' | 'radio' | 'checkbox';
    description: string | null;
    is_required: boolean;
    is_active: boolean;
    sort_order: number;
    values_count?: number;
    created_at: string;
    updated_at: string;
    values?: ProductAttributeValue[];
}

export interface ProductAttributeValue {
    id: number;
    product_attribute_id: number;
    value: string;
    slug: string;
    meta: Record<string, any> | null;
    is_active: boolean;
    sort_order: number;
    attribute_name?: string;
    attribute_slug?: string;
    created_at?: string;
    updated_at?: string;
}

export interface ProductAttributeFormData {
    name: string;
    slug?: string;
    type: 'select' | 'color' | 'radio' | 'checkbox';
    description?: string;
    is_required?: boolean;
    is_active?: boolean;
    sort_order?: number;
}

export interface ProductAttributeValueFormData {
    product_attribute_id: number;
    value: string;
    slug?: string;
    meta?: Record<string, any> | null;
    is_active?: boolean;
    sort_order?: number;
}

export interface BulkAttributeValuesFormData {
    product_attribute_id: number;
    values: string[] | Array<{
        value: string;
        slug?: string;
        meta?: Record<string, any> | null;
        sort_order?: number;
    }>;
}
