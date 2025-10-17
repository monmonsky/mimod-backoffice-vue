export const useAISeo = () => {
    const config = useRuntimeConfig();
    const authStore = useAuthStore();

    interface GenerateSeoParams {
        name: string;
        description: string;
        brand_name?: string;
        categories?: string[];
        tags?: string[];
        age_min?: number;
        age_max?: number;
    }

    interface GenerateSeoResponse {
        status: boolean;
        statusCode: number;
        message: string;
        data: {
            title: string;
            description: string;
            keywords: string;
        };
    }

    const generateSeo = async (params: GenerateSeoParams) => {
        return await $fetch<GenerateSeoResponse>("/ai/generate-seo", {
            method: "POST",
            baseURL: config.public.apiBase,
            headers: {
                Authorization: `Bearer ${authStore.token}`,
            },
            body: params,
        });
    };

    return {
        generateSeo,
    };
};
