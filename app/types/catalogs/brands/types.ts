export interface Brand {
    id: number;
    name: string;
    slug: string;
    logo: string;
    description: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface BrandFormData {
    name: string;
    slug: string;
    logo: string;
    description: string;
    is_active: boolean;
}
