/**
 * Badge Helper Functions
 *
 * Centralized helper functions for badge classes across the application.
 * Used in payment methods, shipping methods, and their configuration pages.
 */

/**
 * Get badge class for payment method type
 */
export const getPaymentTypeBadgeClass = (typeValue: string): string => {
    const classes: Record<string, string> = {
        bank_transfer: "badge-primary",
        virtual_account: "badge-info",
        e_wallet: "badge-success",
        qris: "badge-warning",
        credit_card: "badge-secondary",
        cod: "badge-accent",
    };
    return classes[typeValue] || "badge-ghost";
};

/**
 * Get label for payment method type
 */
export const getPaymentTypeLabel = (typeValue: string): string => {
    const types: Record<string, string> = {
        bank_transfer: "Bank Transfer",
        virtual_account: "Virtual Account",
        e_wallet: "E-Wallet",
        qris: "QRIS",
        credit_card: "Credit Card",
        cod: "Cash on Delivery",
    };
    return types[typeValue] || typeValue;
};

/**
 * Get badge class for payment provider
 */
export const getPaymentProviderBadgeClass = (providerValue: string): string => {
    const classes: Record<string, string> = {
        manual: "badge-ghost",
        midtrans: "badge-info",
        xendit: "badge-primary",
    };
    return classes[providerValue] || "badge-ghost";
};

/**
 * Get badge class for shipping method type
 */
export const getShippingTypeBadgeClass = (typeValue: string): string => {
    const classes: Record<string, string> = {
        manual: "badge-primary",
        custom: "badge-info",
        rajaongkir: "badge-secondary",
    };
    return classes[typeValue] || "badge-ghost";
};

/**
 * Get label for shipping method type
 */
export const getShippingTypeLabel = (typeValue: string): string => {
    const types: Record<string, string> = {
        manual: "Manual",
        custom: "Custom",
        rajaongkir: "RajaOngkir",
    };
    return types[typeValue] || typeValue;
};

/**
 * Get badge class for shipping provider
 */
export const getShippingProviderBadgeClass = (providerValue: string): string => {
    const classes: Record<string, string> = {
        jne: "badge-error",
        jnt: "badge-warning",
        sicepat: "badge-info",
        pos: "badge-secondary",
        gosend: "badge-success",
        grab: "badge-success",
        custom: "badge-ghost",
        rajaongkir: "badge-primary",
    };
    return classes[providerValue] || "badge-ghost";
};
