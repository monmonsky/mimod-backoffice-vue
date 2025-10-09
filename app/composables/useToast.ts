export interface Toast {
    id: string;
    type: "success" | "error" | "info" | "warning";
    message: string;
    duration: number;
}

const toasts = ref<Toast[]>([]);

export const useToast = () => {
    const addToast = (type: Toast["type"], message: string, duration = 3000) => {
        const id = Math.random().toString(36).substring(2, 9);
        const toast: Toast = { id, type, message, duration };

        toasts.value.push(toast);

        setTimeout(() => {
            removeToast(id);
        }, duration);

        return id;
    };

    const removeToast = (id: string) => {
        const index = toasts.value.findIndex((t) => t.id === id);
        if (index > -1) {
            toasts.value.splice(index, 1);
        }
    };

    const success = (message: string, duration?: number) => {
        return addToast("success", message, duration);
    };

    const error = (message: string, duration?: number) => {
        return addToast("error", message, duration);
    };

    const info = (message: string, duration?: number) => {
        return addToast("info", message, duration);
    };

    const warning = (message: string, duration?: number) => {
        return addToast("warning", message, duration);
    };

    return {
        toasts: readonly(toasts),
        success,
        error,
        info,
        warning,
        removeToast,
    };
};
