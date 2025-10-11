export interface Customer {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    province: string;
    postal_code: string;
    country: string;
    image: string | null;
    status: "active" | "inactive";
    created_at: string;
    updated_at: string;
}

export interface CustomerFormData {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    province: string;
    postal_code: string;
    country: string;
    image?: string;
    status: "active" | "inactive";
}

export interface CustomerStatistics {
    total: number;
    active: number;
    inactive: number;
}
