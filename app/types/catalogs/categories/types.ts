export interface Category {
    id: number;
    name: string;
    slug: string;
    image: string;
    description: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface CategoryFormData {
    name: string;
    slug: string;
    image: string;
    description: string;
    is_active: boolean;
}
