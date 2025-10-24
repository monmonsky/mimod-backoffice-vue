import type {
    ProductAttributeFormData,
    ProductAttributeValueFormData,
    BulkAttributeValuesFormData,
    AttributeCreateResponse,
    AttributeUpdateResponse,
    AttributeDeleteResponse,
    AttributeValueCreateResponse,
    AttributeValueBulkCreateResponse,
    AttributeValueUpdateResponse,
    AttributeValueDeleteResponse,
} from '~/types/catalogs/attributes';

export const useAttributes = () => {
    const config = useRuntimeConfig();
    const authStore = useAuthStore();

    // Attributes CRUD
    const createAttribute = async (data: ProductAttributeFormData) => {
        return $fetch<AttributeCreateResponse>(`/catalog/attributes`, {
            baseURL: config.public.apiBase,
            method: 'POST',
            headers: {
                Authorization: `Bearer ${authStore.token}`,
            },
            body: data,
        });
    };

    const updateAttribute = async (attributeId: number, data: Partial<ProductAttributeFormData>) => {
        return $fetch<AttributeUpdateResponse>(`/catalog/attributes/${attributeId}`, {
            baseURL: config.public.apiBase,
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${authStore.token}`,
            },
            body: data,
        });
    };

    const deleteAttribute = async (attributeId: number) => {
        return $fetch<AttributeDeleteResponse>(`/catalog/attributes/${attributeId}`, {
            baseURL: config.public.apiBase,
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${authStore.token}`,
            },
        });
    };

    // Attribute Values CRUD
    const createAttributeValue = async (data: ProductAttributeValueFormData) => {
        return $fetch<AttributeValueCreateResponse>(`/catalog/attribute-values`, {
            baseURL: config.public.apiBase,
            method: 'POST',
            headers: {
                Authorization: `Bearer ${authStore.token}`,
            },
            body: data,
        });
    };

    const createAttributeValuesBulk = async (data: BulkAttributeValuesFormData) => {
        return $fetch<AttributeValueBulkCreateResponse>(`/catalog/attribute-values/bulk`, {
            baseURL: config.public.apiBase,
            method: 'POST',
            headers: {
                Authorization: `Bearer ${authStore.token}`,
            },
            body: data,
        });
    };

    const updateAttributeValue = async (valueId: number, data: Partial<ProductAttributeValueFormData>) => {
        return $fetch<AttributeValueUpdateResponse>(`/catalog/attribute-values/${valueId}`, {
            baseURL: config.public.apiBase,
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${authStore.token}`,
            },
            body: data,
        });
    };

    const deleteAttributeValue = async (valueId: number) => {
        return $fetch<AttributeValueDeleteResponse>(`/catalog/attribute-values/${valueId}`, {
            baseURL: config.public.apiBase,
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${authStore.token}`,
            },
        });
    };

    return {
        createAttribute,
        updateAttribute,
        deleteAttribute,
        createAttributeValue,
        createAttributeValuesBulk,
        updateAttributeValue,
        deleteAttributeValue,
    };
};
