/**
 * Composable to handle media URLs with storage_base
 */
export const useMediaUrl = () => {
    const config = useRuntimeConfig();

    /**
     * Get full media URL with storage_base
     * @param url - URL or path to media
     * @returns Full URL with storage_base prepended if needed
     */
    const getMediaUrl = (url: string | undefined | null): string => {
        if (!url) return "";

        // If already absolute URL with http/https, return as is
        if (url.startsWith("http://") || url.startsWith("https://")) {
            return url;
        }

        // If relative path, prepend storage_base
        const storageBase = (config.public.storageBase || config.public.apiBase.replace("/api", "")) as string;
        return `${storageBase}/${url.replace(/^\/+/, "")}`;
    };

    /**
     * Get thumbnail URL for video
     * @param thumbnailUrl - Thumbnail URL or path
     * @returns Full thumbnail URL
     */
    const getThumbnailUrl = (thumbnailUrl: string | undefined | null): string => {
        return getMediaUrl(thumbnailUrl);
    };

    /**
     * Check if URL is a video
     * @param url - Media URL
     * @returns true if video, false otherwise
     */
    const isVideo = (url: string | undefined | null): boolean => {
        if (!url) return false;
        const videoExtensions = [".mp4", ".mov", ".avi", ".webm", ".mkv", ".flv"];
        return videoExtensions.some((ext) => url.toLowerCase().endsWith(ext));
    };

    /**
     * Check if URL is an image
     * @param url - Media URL
     * @returns true if image, false otherwise
     */
    const isImage = (url: string | undefined | null): boolean => {
        if (!url) return false;
        const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".bmp"];
        return imageExtensions.some((ext) => url.toLowerCase().endsWith(ext));
    };

    return {
        getMediaUrl,
        getThumbnailUrl,
        isVideo,
        isImage,
    };
};
