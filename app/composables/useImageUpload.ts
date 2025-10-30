export type ImageUploadType = "product";  // Only "product" is used in temp/move flow

export interface UploadImageOptions {
    type: ImageUploadType;
    maxSizeMB?: number;
    allowedTypes?: string[];
}

export interface TempUploadResponse {
    status: boolean;
    statusCode: string;
    message: string;
    data: {
        images: Array<{
            url: string;
            path: string;
            filename: string;
            temp: boolean;
            media_type?: string;
            thumbnail_url?: string;
            duration?: number;
            file_size?: number;
        }>;
        count: number;
        type: string;
        session_id: string;
        note: string;
    };
}

export interface MoveImageRequest {
    temp_paths: string[];
    type: string;
    product_id?: number;
    variant_id?: number;
    metadata?: Array<{
        media_type: string;
        duration?: number;
        file_size?: number;
        thumbnail_url?: string;
    }>;
}

export interface MoveImageResponse {
    status?: boolean;
    statusCode?: string;
    message?: string;
    data?: {
        images: Array<{
            id: number;
            url: string;
            path: string;
            is_primary: boolean;
            sort_order: number;
        }>;
        count: number;
        type: string;
        product_id?: number;
        variant_id?: number;
    };
    // Legacy format support
    images?: Array<{
        id: number;
        url: string;
        path: string;
        is_primary: boolean;
        sort_order: number;
    }>;
    count?: number;
    product_id?: number;
}

export const useImageUpload = () => {
    const config = useRuntimeConfig();
    const authStore = useAuthStore();
    const { success, error: showError } = useToast();

    // NOTE: Single image upload (/upload/image) and bulk upload (/upload/image/bulk)
    // are NOT used in composable. Brand and Category pages use direct $fetch calls.
    // Keeping interfaces for reference but removing unused functions to reduce bundle size.

    /**
     * Upload images to temporary folder
     * @param files - Files to upload
     * @param options - Upload options
     * @param sessionId - Optional session ID for grouping temp images
     * @returns Promise with temp upload response
     */
    const uploadTempImages = async (files: File[], options: UploadImageOptions, sessionId?: string): Promise<TempUploadResponse> => {
        const { type, maxSizeMB = 2, allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"] } = options;

        // Validate all files
        for (const file of files) {
            // Validate file type
            if (!allowedTypes.includes(file.type)) {
                const allowedExtensions = allowedTypes.map((type) => type.split("/")[1]).join(", ");
                throw new Error(`Please upload valid files (${allowedExtensions})`);
            }

            // Validate file size (per file)
            const maxSizeBytes = maxSizeMB * 1024 * 1024;
            if (file.size > maxSizeBytes) {
                const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
                throw new Error(`File "${file.name}" is ${fileSizeMB}MB. Each file must be less than ${maxSizeMB}MB`);
            }
        }

        // Prepare form data
        const formData = new FormData();
        files.forEach((file) => {
            formData.append("images[]", file);
        });
        formData.append("type", type);
        if (sessionId) {
            formData.append("session_id", sessionId);
        }

        try {
            const response = await $fetch<TempUploadResponse>("/upload/temp", {
                baseURL: config.public.apiBase,
                method: "POST",
                headers: {
                    Authorization: `Bearer ${authStore.token}`,
                },
                body: formData,
            });

            // Fix URLs to use storage_base instead of api_base
            const storageBase = (config.public.storageBase || config.public.apiBase.replace('/api', '')) as string;

            response.data.images = response.data.images.map((image) => {
                // Helper function to fix URL
                const fixUrl = (url: string) => {
                    if (!url) return url;

                    // If already absolute URL with http/https, extract path
                    if (url.startsWith('http')) {
                        // Extract path after domain (e.g., /temp/... or temp/...)
                        const pathMatch = url.match(/\/?(temp\/.+)$/);
                        if (pathMatch) {
                            return `${storageBase}/${pathMatch[1]}`;
                        }
                    }

                    // If relative path, prepend storage_base
                    return `${storageBase}/${url.replace(/^\/+/, '')}`;
                };

                return {
                    ...image,
                    url: fixUrl(image.url),
                    thumbnail_url: image.thumbnail_url ? fixUrl(image.thumbnail_url) : undefined,
                };
            });

            return response;
        } catch (err: any) {
            console.error("=== TEMP UPLOAD ERROR ===");
            console.error("Error:", err);
            console.error("Message:", err?.data?.message);
            console.error("=========================");

            throw new Error(err?.data?.message || "Failed to upload temporary images");
        }
    };

    /**
     * Move images from temp to permanent location
     * @param request - Move request with temp paths and IDs
     * @returns Promise with moved images info
     */
    const moveImages = async (request: MoveImageRequest): Promise<MoveImageResponse> => {
        console.log("=== MOVE IMAGES REQUEST ===");
        console.log("URL:", `${config.public.apiBase}/upload/move`);
        console.log("Request Body:", JSON.stringify(request, null, 2));
        console.log("Temp Paths Count:", request.temp_paths.length);
        console.log("Temp Paths:", request.temp_paths);
        console.log("Type:", request.type);
        console.log("Product ID:", request.product_id);
        console.log("Variant ID:", request.variant_id);

        if (request.metadata) {
            console.log("Metadata Count:", request.metadata.length);
            request.metadata.forEach((meta, index) => {
                console.log(`Metadata[${index}]:`, {
                    media_type: meta.media_type,
                    duration: meta.duration,
                    file_size: meta.file_size,
                    has_thumbnail: !!meta.thumbnail_url,
                    thumbnail_url: meta.thumbnail_url
                });
            });
        }

        console.log("Authorization Token:", authStore.token ? `${authStore.token.substring(0, 20)}...` : "MISSING");
        console.log("===========================");

        try {
            const response = await $fetch<MoveImageResponse>("/upload/move", {
                baseURL: config.public.apiBase,
                method: "POST",
                headers: {
                    Authorization: `Bearer ${authStore.token}`,
                },
                body: request,
            });

            console.log("=== MOVE IMAGES RESPONSE ===");
            console.log("Full Response:", JSON.stringify(response, null, 2));

            // Handle both response formats
            const images = response.data?.images || response.images || [];
            const count = response.data?.count || response.count || 0;
            const productId = response.data?.product_id || response.product_id;

            console.log("Images Array:", images);
            console.log("Images Count:", count);
            console.log("Actual Images Length:", images.length);
            console.log("Product ID:", productId);
            console.log("Message:", response.message);
            console.log("Status:", response.status);

            if (count === 0) {
                console.warn("⚠️ WARNING: API returned 0 images moved!");
                console.warn("This might indicate a backend issue.");
            }

            console.log("============================");

            return response;
        } catch (err: any) {
            console.error("=== MOVE IMAGE ERROR ===");
            console.error("Error:", err);
            console.error("Status:", err?.status);
            console.error("Status Code:", err?.statusCode);
            console.error("Message:", err?.data?.message);
            console.error("Data:", err?.data);
            console.error("Full Error:", JSON.stringify(err, null, 2));
            console.error("========================");

            throw new Error(err?.data?.message || "Failed to move images");
        }
    };

    return {
        // Only export functions that are actually used
        uploadTempImages,  // Used by: Products, Variants
        moveImages,        // Used by: Products, Variants
    };
};
