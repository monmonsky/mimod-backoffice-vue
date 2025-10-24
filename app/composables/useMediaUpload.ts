export type MediaUploadType = "product" | "brand" | "category" | "banner";
export type MediaType = "image" | "video";

export interface UploadMediaOptions {
    type: MediaUploadType;
    media_type?: MediaType;
    maxSizeMB?: number;
    allowedTypes?: string[];
    thumbnail?: File; // For video thumbnail
}

export interface MediaUploadResponse {
    status: boolean;
    statusCode: string;
    message: string;
    data: {
        url: string;
        path: string;
        filename: string;
        type: string;
        media_type: MediaType;
        file_size: number;
        mime_type: string;
        thumbnail_url?: string;
        duration?: number;
    };
}

export const useMediaUpload = () => {
    const config = useRuntimeConfig();
    const authStore = useAuthStore();
    const { success, error: showError } = useToast();

    /**
     * Upload media (image or video) to server
     * @param file - File to upload
     * @param options - Upload options
     * @returns Promise with uploaded media data
     */
    const uploadMedia = async (file: File, options: UploadMediaOptions): Promise<MediaUploadResponse> => {
        const {
            type,
            media_type,
            maxSizeMB = 50, // Default 50MB for videos
            allowedTypes,
            thumbnail,
        } = options;

        // Auto-detect media type from file if not specified
        const detectedMediaType: MediaType = media_type || (file.type.startsWith("video/") ? "video" : "image");

        // Default allowed types based on media type
        const defaultAllowedTypes =
            detectedMediaType === "video"
                ? ["video/mp4", "video/quicktime", "video/x-msvideo", "video/x-matroska"]
                : ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];

        const finalAllowedTypes = allowedTypes || defaultAllowedTypes;

        // Validate file type
        if (!finalAllowedTypes.includes(file.type)) {
            const allowedExtensions = finalAllowedTypes.map((type) => type.split("/")[1]).join(", ");
            throw new Error(`Please upload a valid ${detectedMediaType} file (${allowedExtensions})`);
        }

        // Validate file size
        const maxSizeBytes = maxSizeMB * 1024 * 1024;
        if (file.size > maxSizeBytes) {
            const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
            throw new Error(`File size is ${fileSizeMB}MB. Maximum size is ${maxSizeMB}MB`);
        }

        // Prepare form data
        const formData = new FormData();
        formData.append("file", file);
        formData.append("type", type);
        formData.append("media_type", detectedMediaType);

        // Add thumbnail if provided (for videos)
        if (thumbnail && detectedMediaType === "video") {
            formData.append("thumbnail", thumbnail);
        }

        try {
            const response = await $fetch<MediaUploadResponse>("/upload/media", {
                baseURL: config.public.apiBase,
                method: "POST",
                headers: {
                    Authorization: `Bearer ${authStore.token}`,
                },
                body: formData,
            });

            return response;
        } catch (err: any) {
            console.error("=== MEDIA UPLOAD ERROR ===");
            console.error("Error:", err);
            console.error("Message:", err?.data?.message);
            console.error("==========================");

            throw new Error(err?.data?.message || "Failed to upload media");
        }
    };

    /**
     * Handle file input change event and upload
     * @param event - Input change event
     * @param options - Upload options
     * @returns Promise with uploaded media data
     */
    const handleMediaUpload = async (event: Event, options: UploadMediaOptions): Promise<MediaUploadResponse | null> => {
        const target = event.target as HTMLInputElement;
        const file = target.files?.[0];

        if (!file) return null;

        try {
            const response = await uploadMedia(file, options);
            const mediaType = response.data.media_type;
            success(`${mediaType.charAt(0).toUpperCase() + mediaType.slice(1)} uploaded successfully!`);
            return response;
        } catch (err: any) {
            showError(err.message || "Failed to upload media");
            return null;
        }
    };

    /**
     * Validate video file
     * @param file - Video file to validate
     * @returns Promise<boolean>
     */
    const validateVideoFile = async (file: File): Promise<{ valid: boolean; error?: string; duration?: number }> => {
        return new Promise((resolve) => {
            if (!file.type.startsWith("video/")) {
                resolve({ valid: false, error: "File is not a video" });
                return;
            }

            const video = document.createElement("video");
            video.preload = "metadata";

            video.onloadedmetadata = () => {
                window.URL.revokeObjectURL(video.src);
                const duration = Math.round(video.duration);

                // Optional: Add duration limit (e.g., max 5 minutes)
                if (duration > 300) {
                    resolve({ valid: false, error: "Video duration must be less than 5 minutes", duration });
                } else {
                    resolve({ valid: true, duration });
                }
            };

            video.onerror = () => {
                resolve({ valid: false, error: "Invalid video file" });
            };

            video.src = URL.createObjectURL(file);
        });
    };

    /**
     * Generate video thumbnail from video file
     * @param file - Video file
     * @param timeInSeconds - Time to capture thumbnail (default: 1 second)
     * @returns Promise with thumbnail blob
     */
    const generateVideoThumbnail = async (file: File, timeInSeconds: number = 1): Promise<Blob> => {
        return new Promise((resolve, reject) => {
            const video = document.createElement("video");
            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");

            video.preload = "metadata";
            video.muted = true;

            video.onloadedmetadata = () => {
                video.currentTime = Math.min(timeInSeconds, video.duration);
            };

            video.onseeked = () => {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                context?.drawImage(video, 0, 0, canvas.width, canvas.height);

                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            resolve(blob);
                        } else {
                            reject(new Error("Failed to generate thumbnail"));
                        }
                        window.URL.revokeObjectURL(video.src);
                    },
                    "image/jpeg",
                    0.8,
                );
            };

            video.onerror = () => {
                reject(new Error("Failed to load video"));
            };

            video.src = URL.createObjectURL(file);
        });
    };

    return {
        uploadMedia,
        handleMediaUpload,
        validateVideoFile,
        generateVideoThumbnail,
    };
};
