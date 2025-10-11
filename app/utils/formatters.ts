/**
 * Format price to Indonesian Rupiah format
 * @param value - The price value to format
 * @param includeSymbol - Whether to include Rp symbol (default: true)
 * @returns Formatted price string
 * @example formatPrice(1000000) => "Rp 1.000.000"
 */
export const formatPrice = (value: number | string, includeSymbol = true): string => {
    const numValue = typeof value === "string" ? parseFloat(value) : value;

    if (isNaN(numValue)) return includeSymbol ? "Rp 0" : "0";

    const formatted = new Intl.NumberFormat("id-ID", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(numValue);

    return includeSymbol ? `Rp ${formatted}` : formatted;
};

/**
 * Format date to Indonesian format
 * @param date - Date string or Date object
 * @param format - Format type: 'short', 'long', 'datetime', 'time' (default: 'short')
 * @returns Formatted date string
 * @example formatDate('2024-10-09') => "09 Okt 2024"
 * @example formatDate('2024-10-09', 'long') => "9 Oktober 2024"
 * @example formatDate('2024-10-09 10:30:00', 'datetime') => "09 Okt 2024, 10:30"
 */
export const formatDate = (
    date: string | Date | null | undefined,
    format: "short" | "long" | "datetime" | "time" = "short",
): string => {
    if (!date) return "-";

    const dateObj = typeof date === "string" ? new Date(date) : date;

    if (isNaN(dateObj.getTime())) return "-";

    const options: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Jakarta",
    };

    switch (format) {
        case "short":
            options.day = "2-digit";
            options.month = "short";
            options.year = "numeric";
            break;
        case "long":
            options.day = "numeric";
            options.month = "long";
            options.year = "numeric";
            break;
        case "datetime":
            options.day = "2-digit";
            options.month = "short";
            options.year = "numeric";
            options.hour = "2-digit";
            options.minute = "2-digit";
            break;
        case "time":
            options.hour = "2-digit";
            options.minute = "2-digit";
            break;
    }

    return new Intl.DateTimeFormat("id-ID", options).format(dateObj);
};

/**
 * Format relative time (e.g., "2 hours ago")
 * @param date - Date string or Date object
 * @returns Relative time string
 * @example formatRelativeTime('2024-10-09 10:00:00') => "2 jam yang lalu"
 */
export const formatRelativeTime = (date: string | Date | null | undefined): string => {
    if (!date) return "-";

    const dateObj = typeof date === "string" ? new Date(date) : date;

    if (isNaN(dateObj.getTime())) return "-";

    const now = new Date();
    const diffMs = now.getTime() - dateObj.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    const diffMonth = Math.floor(diffDay / 30);
    const diffYear = Math.floor(diffDay / 365);

    if (diffSec < 60) return "Baru saja";
    if (diffMin < 60) return `${diffMin} menit yang lalu`;
    if (diffHour < 24) return `${diffHour} jam yang lalu`;
    if (diffDay < 30) return `${diffDay} hari yang lalu`;
    if (diffMonth < 12) return `${diffMonth} bulan yang lalu`;
    return `${diffYear} tahun yang lalu`;
};

/**
 * Format file size to human readable format
 * @param bytes - File size in bytes
 * @returns Formatted file size
 * @example formatFileSize(1024) => "1 KB"
 * @example formatFileSize(1048576) => "1 MB"
 */
export const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Format number with thousand separator
 * @param value - Number to format
 * @returns Formatted number string
 * @example formatNumber(1000000) => "1.000.000"
 */
export const formatNumber = (value: number | string): string => {
    const numValue = typeof value === "string" ? parseFloat(value) : value;

    if (isNaN(numValue)) return "0";

    return new Intl.NumberFormat("id-ID").format(numValue);
};

/**
 * Format percentage
 * @param value - Number to format as percentage
 * @param decimals - Number of decimal places (default: 0)
 * @returns Formatted percentage string
 * @example formatPercentage(0.75) => "75%"
 * @example formatPercentage(0.7543, 2) => "75,43%"
 */
export const formatPercentage = (value: number, decimals = 0): string => {
    if (isNaN(value)) return "0%";

    return `${(value * 100).toFixed(decimals).replace(".", ",")}%`;
};

/**
 * Truncate text with ellipsis
 * @param text - Text to truncate
 * @param maxLength - Maximum length (default: 100)
 * @returns Truncated text
 * @example truncateText('Lorem ipsum...', 10) => "Lorem ipsu..."
 */
export const truncateText = (text: string, maxLength = 100): string => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return `${text.substring(0, maxLength)}...`;
};

/**
 * Format phone number to Indonesian format
 * @param phone - Phone number string
 * @returns Formatted phone number
 * @example formatPhone('081234567890') => "0812-3456-7890"
 */
export const formatPhone = (phone: string): string => {
    if (!phone) return "";

    // Remove all non-numeric characters
    const cleaned = phone.replace(/\D/g, "");

    // Format: 0812-3456-7890
    if (cleaned.length >= 10) {
        return cleaned.replace(/(\d{4})(\d{4})(\d+)/, "$1-$2-$3");
    }

    return phone;
};
