export type ImageUploadType = "brand" | "category" | "product" | "avatar" | "banner" | "thumbnail";

export interface UploadImageOptions {
    type: ImageUploadType;
    maxSizeMB?: number;
    allowedTypes?: string[];
}

export interface UploadImageResponse {
    data: {
        url: string;
        path?: string;
        filename?: string;
    };
}

export interface BulkUploadImageResponse {
    data: {
        images: Array<{
            url: string;
            path?: string;
            filename?: string;
        }>;
    };
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
    images: Array<{
        id: number;
        url: string;
        path: string;
        is_primary: boolean;
        sort_order: number;
    }>;
    count: number;
    product_id?: number;
}

export const useImageUpload = () => {
    const config = useRuntimeConfig();
    const authStore = useAuthStore();
    const { success, error: showError } = useToast();

    /**
     * Upload image to server
     * @param file - File to upload
     * @param options - Upload options
     * @returns Promise with uploaded image URL
     */
    const uploadImage = async (file: File, options: UploadImageOptions): Promise<string> => {
        const { type, maxSizeMB = 2, allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"] } = options;

        // Validate file type
        if (!allowedTypes.includes(file.type)) {
            const allowedExtensions = allowedTypes.map((type) => type.split("/")[1]).join(", ");
            throw new Error(`Please upload a valid image file (${allowedExtensions})`);
        }

        // Validate file size
        const maxSizeBytes = maxSizeMB * 1024 * 1024;
        if (file.size > maxSizeBytes) {
            throw new Error(`Image size must be less than ${maxSizeMB}MB`);
        }

        // Prepare form data
        const formData = new FormData();
        formData.append("image", file);
        formData.append("type", type);

        try {
            const response = await $fetch<UploadImageResponse>("/upload/image", {
                baseURL: config.public.apiBase,
                method: "POST",
                headers: {
                    Authorization: `Bearer ${authStore.token}`,
                },
                body: formData,
            });

            return response.data.url;
        } catch (err: any) {
            console.error("=== UPLOAD ERROR ===");
            console.error("Error:", err);
            console.error("Message:", err?.data?.message);
            console.error("===================");

            throw new Error(err?.data?.message || "Failed to upload image");
        }
    };

    /**
     * Handle file input change event and upload
     * @param event - Input change event
     * @param options - Upload options
     * @returns Promise with uploaded image URL
     */
    const handleFileUpload = async (event: Event, options: UploadImageOptions): Promise<string | null> => {
        const target = event.target as HTMLInputElement;
        const file = target.files?.[0];

        if (!file) return null;

        try {
            const url = await uploadImage(file, options);
            success("Image uploaded successfully!");
            return url;
        } catch (err: any) {
            showError(err.message || "Failed to upload image");
            return null;
        }
    };

    /**
     * Upload multiple images to server
     * @param files - Files to upload
     * @param options - Upload options
     * @returns Promise with array of uploaded image URLs
     */
    const uploadBulkImages = async (files: File[], options: UploadImageOptions): Promise<string[]> => {
        const { type, maxSizeMB = 2, allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"] } = options;

        // Validate all files
        for (const file of files) {
            // Validate file type
            if (!allowedTypes.includes(file.type)) {
                const allowedExtensions = allowedTypes.map((type) => type.split("/")[1]).join(", ");
                throw new Error(`Please upload valid image files (${allowedExtensions})`);
            }

            // Validate file size (per file)
            const maxSizeBytes = maxSizeMB * 1024 * 1024;
            if (file.size > maxSizeBytes) {
                const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
                throw new Error(`File "${file.name}" is ${fileSizeMB}MB. Each image must be less than ${maxSizeMB}MB`);
            }
        }

        // Prepare form data
        const formData = new FormData();
        files.forEach((file) => {
            formData.append("images[]", file);
        });
        formData.append("type", type);

        try {
            const response = await $fetch<BulkUploadImageResponse>("/upload/image/bulk", {
                baseURL: config.public.apiBase,
                method: "POST",
                headers: {
                    Authorization: `Bearer ${authStore.token}`,
                },
                body: formData,
            });

            return response.data.images.map((img) => img.url);
        } catch (err: any) {
            console.error("=== BULK UPLOAD ERROR ===");
            console.error("Error:", err);
            console.error("Message:", err?.data?.message);
            console.error("========================");

            throw new Error(err?.data?.message || "Failed to upload images");
        }
    };

    /**
     * Handle multiple file input change event and upload
     * @param event - Input change event
     * @param options - Upload options
     * @returns Promise with array of uploaded image URLs
     */
    const handleBulkFileUpload = async (event: Event, options: UploadImageOptions): Promise<string[]> => {
        const target = event.target as HTMLInputElement;
        const files = target.files;

        if (!files || files.length === 0) return [];

        try {
            const fileArray = Array.from(files);
            const urls = await uploadBulkImages(fileArray, options);
            success(`${urls.length} image(s) uploaded successfully!`);
            return urls;
        } catch (err: any) {
            showError(err.message || "Failed to upload images");
            return [];
        }
    };

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
        try {
            const response = await $fetch<MoveImageResponse>("/upload/move", {
                baseURL: config.public.apiBase,
                method: "POST",
                headers: {
                    Authorization: `Bearer ${authStore.token}`,
                },
                body: request,
            });

            return response;
        } catch (err: any) {
            console.error("=== MOVE IMAGE ERROR ===");
            console.error("Error:", err);
            console.error("Message:", err?.data?.message);
            console.error("========================");

            throw new Error(err?.data?.message || "Failed to move images");
        }
    };

    return {
        uploadImage,
        handleFileUpload,
        uploadBulkImages,
        handleBulkFileUpload,
        uploadTempImages,
        moveImages,
    };
};
