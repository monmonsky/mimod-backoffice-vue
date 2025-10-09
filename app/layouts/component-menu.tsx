import type { ISidebarMenuItem } from "~/components/admin-layout/SidebarMenuItem.vue";

type ISubMenuItem = ISidebarMenuItem & { preview?: VNode };

type IComponentMenuItem = Omit<ISidebarMenuItem, "children"> & {
    children?: ISubMenuItem[];
};

export const componentsMenuItems: IComponentMenuItem[] = [
    {
        id: "base-label",
        isTitle: true,
        label: "Base",
    },
    {
        id: "foundations",
        icon: "lucide--shapes",
        label: "Foundations",
        children: [
            {
                id: "foundations-text",
                label: "Text",
                url: "/components/foundations/text",
                preview: (
                    <div class="space-y-1">
                        <div class="bg-base-content/15 h-1 w-5 rounded-xs"></div>
                        <div class="bg-base-content/20 h-2 w-10 rounded-xs"></div>
                        <div class="bg-base-content/30 h-2.5 w-15 rounded-xs"></div>
                        <div class="bg-base-content/30 h-3 w-20 rounded-xs"></div>
                    </div>
                ),
            },
            {
                id: "foundations-display",
                label: "Display",
                url: "/components/foundations/display",
                preview: (
                    <div class="grid grid-cols-3 gap-2">
                        {Array.from({ length: 9 }).map((_, i) => (
                            <div key={i} class="bg-base-content/20 size-6 rounded-xs"></div>
                        ))}
                    </div>
                ),
            },
            {
                id: "foundations-effects",
                label: "Effects",
                url: "/components/foundations/effects",
                preview: (
                    <div class="grid grid-cols-2 gap-2">
                        <div class="bg-base-content/15 size-8 rounded-xs"></div>
                        <div class="bg-base-content/15 size-8 rounded-xs blur-sm"></div>
                        <div class="bg-primary size-8 rounded-xs brightness-125"></div>
                        <div class="bg-secondary size-8 rounded-xs contrast-125"></div>
                    </div>
                ),
            },
            {
                id: "foundations-shadows",
                label: "Shadows",
                url: "/components/foundations/shadows",
                preview: (
                    <div class="grid grid-cols-2 gap-2">
                        <div class="bg-base-content/20 size-8 rounded-xs shadow-xs"></div>
                        <div class="bg-base-content/20 size-8 rounded-xs shadow-sm"></div>
                        <div class="bg-base-content/20 size-8 rounded-xs shadow-lg"></div>
                        <div class="bg-base-content/20 size-8 rounded-xs shadow-xl"></div>
                    </div>
                ),
            },
        ],
    },
    {
        id: "blocks",
        icon: "lucide--blocks",
        label: "Blocks",
        children: [
            {
                id: "blocks-stats",
                label: "Dashboard Stats",
                url: "/components/blocks/stats",
                preview: (
                    <div class="grid grid-cols-2 gap-2">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div
                                key={i}
                                class="bg-base-content/10 flex items-start justify-between gap-1 rounded-xs px-2 py-2">
                                <div class="bg-base-content/15 size-3 rounded-xs"></div>
                                <div class="space-y-0.5">
                                    <div class="bg-base-content/30 h-1.5 w-6 rounded-xs"></div>
                                    <div class="bg-base-content/25 h-1.5 w-3 rounded-xs"></div>
                                </div>
                                <div class="bg-base-content/20 size-1"></div>
                            </div>
                        ))}
                    </div>
                ),
            },
            {
                id: "blocks-prompt-bar",
                label: "Prompt Bar",
                url: "/components/blocks/prompt-bar",
                preview: (
                    <div class="border-base-300 w-3/5 rounded-xs border">
                        <div class="h-12 p-1">
                            <p class="text-base-content/50 text-xs">Type your request</p>
                        </div>
                        <div class="bg-base-content/10 flex items-center gap-1 px-2 py-1.5">
                            <div class="bg-base-content/20 h-2 w-3 rounded-xs"></div>
                            <div class="bg-base-content/20 h-2 w-4 rounded-xs"></div>
                            <div class="bg-base-content/20 ms-auto h-1.5 w-5 rounded-xs"></div>
                            <div class="bg-base-content/25 ms-auto size-2 rounded-xs"></div>
                            <div class="bg-base-content/30 size-2 rounded-xs"></div>
                        </div>
                    </div>
                ),
            },
        ],
    },
    {
        id: "layouts",
        icon: "lucide--layout-panel-left",
        label: "Layouts",
        children: [
            {
                id: "layouts-skeleton",
                label: "Skeleton",
                url: "/components/layouts/skeleton",
                preview: (
                    <div class="w-3/4 space-y-2.5 sm:w-3/5">
                        <div class="grid grid-cols-4 gap-2">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} class="border-base-content/30 h-4 rounded-xs border border-dashed"></div>
                            ))}
                        </div>
                        <div class="grid grid-cols-5 gap-2">
                            <div class="border-base-content/30 bg-base-content/10 col-span-3 h-10 rounded-xs border border-dashed"></div>
                            <div class="border-base-content/30 col-span-2 h-10 rounded-xs border border-dashed"></div>
                        </div>
                        <div class="grid grid-cols-3 gap-2">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} class="border-base-content/30 h-6 rounded-xs border border-dashed"></div>
                            ))}
                        </div>
                    </div>
                ),
            },
            {
                id: "layouts-sidebar",
                label: "Sidebar",
                url: "/components/layouts/sidebar",
                preview: (
                    <div class="border-base-300 flex h-24 w-3/4 rounded-xs border sm:w-3/5">
                        <div class="bg-base-content/20 w-8 rounded-s-xs"></div>
                        <div class="flex grow flex-col">
                            <div class="border-base-300 h-4 border-b border-dashed"></div>
                            <div class="text-base-content/50 flex grow items-center justify-center text-xs">
                                Content
                            </div>
                            <div class="border-base-300 h-2 border-t border-dashed"></div>
                        </div>
                    </div>
                ),
            },
            {
                id: "layouts-topbar",
                label: "Topbar",
                url: "/components/layouts/topbar",
                preview: (
                    <div class="border-base-300 flex h-24 w-3/4 rounded-xs border sm:w-3/5">
                        <div class="border-base-300 w-8 border-e border-dashed"></div>
                        <div class="flex grow flex-col">
                            <div class="bg-base-content/20 h-4"></div>
                            <div class="text-base-content/50 flex grow items-center justify-center text-xs">
                                Content
                            </div>
                            <div class="border-base-300 h-2 border-t border-dashed"></div>
                        </div>
                    </div>
                ),
            },
            {
                id: "layouts-footer",
                label: "Footer",
                url: "/components/layouts/footer",
                preview: (
                    <div class="border-base-300 flex h-24 w-3/4 rounded-xs border sm:w-3/5">
                        <div class="border-base-300 w-8 border-e border-dashed"></div>
                        <div class="flex grow flex-col">
                            <div class="border-base-300 h-4 border-b border-dashed"></div>
                            <div class="text-base-content/50 flex grow items-center justify-center text-xs">
                                Content
                            </div>
                            <div class="bg-base-content/20 h-2"></div>
                        </div>
                    </div>
                ),
            },
            {
                id: "layouts-profile-menu",
                label: "Profile Menu",
                url: "/components/layouts/profile-menu",
                preview: (
                    <div class="w-1/2 space-y-1.5 sm:w-1/3">
                        <div class="flex items-center justify-end">
                            <div class="bg-base-content/20 size-5 rounded-full"></div>
                        </div>
                        <div class="border-base-300 w-full space-y-1 rounded-xs border p-2">
                            <div class="flex items-center gap-1.5">
                                <div class="bg-base-content/25 size-5 rounded-full"></div>
                                <div class="space-y-0.5">
                                    <div class="bg-base-content/25 h-2 w-8 rounded-xs"></div>
                                    <div class="bg-base-content/15 h-1.5 w-4 rounded-xs"></div>
                                </div>
                            </div>

                            <div class="border-base-300 mt-2 rounded-xs border p-0.5">
                                <div class="bg-base-content/20 h-1.5 w-6 rounded-xs"></div>
                            </div>
                            <div class="border-base-300 rounded-xs border p-0.5">
                                <div class="bg-base-content/20 h-1.5 w-8 rounded-xs"></div>
                            </div>
                        </div>
                    </div>
                ),
            },
            {
                id: "layouts-search",
                label: "Search",
                url: "/components/layouts/search",
                preview: (
                    <div class="w-1/2 space-y-1 sm:w-1/3">
                        <div class="border-base-300 text-base-content/50 rounded-xs border px-1 py-0.5 text-xs">
                            Search...
                        </div>
                        <div class="border-base-300 w-full space-y-1 rounded-xs border p-1.5">
                            <div class="border-base-300 rounded-xs border border-dashed p-1">
                                <div class="bg-base-content/20 skeleton h-1 w-6 rounded-xs"></div>
                            </div>
                            <div class="border-base-300 rounded-xs border border-dashed p-1">
                                <div class="bg-base-content/20 skeleton h-1 w-8 rounded-xs"></div>
                            </div>
                            <div class="border-base-300 rounded-xs border border-dashed p-1">
                                <div class="bg-base-content/20 skeleton h-1 w-4 rounded-xs"></div>
                            </div>
                        </div>
                    </div>
                ),
            },
            {
                id: "layouts-notification",
                label: "Notification",
                url: "/components/layouts/notification",
                preview: (
                    <div class="w-1/2 space-y-1 sm:w-1/3">
                        <div class="flex items-center justify-end">
                            <div class="bg-base-content/20 size-5 rounded-full"></div>
                        </div>
                        <div class="border-base-300 w-full space-y-1 rounded-xs border p-1.5">
                            <div class="border-base-300 rounded-xs border p-1">
                                <div class="bg-base-content/25 h-1 w-5 rounded-xs"></div>
                            </div>
                            <div class="border-base-300 rounded-xs border p-1">
                                <div class="bg-base-content/25 h-1 w-6 rounded-xs"></div>
                            </div>
                            <div class="border-base-300 rounded-xs border p-1">
                                <div class="bg-base-content/20 h-1 w-8 rounded-xs"></div>
                            </div>
                        </div>
                    </div>
                ),
            },
            {
                id: "layouts-page-title",
                label: "Page Title",
                url: "/components/layouts/page-title",
                preview: (
                    <div class="flex w-3/4 items-center gap-2 sm:w-3/5">
                        <div class="space-y-1">
                            <div class="bg-base-content/30 h-3 w-10 rounded-xs"></div>
                            <div class="bg-base-content/25 h-1.5 w-5 rounded-xs"></div>
                        </div>
                        <div class="ms-auto flex flex-col items-end gap-1">
                            <div class="flex gap-1">
                                <div class="border-base-300 size-4 rounded-xs border max-sm:hidden"></div>
                                <div class="bg-base-content/25 size-4 rounded-xs"></div>
                                <div class="bg-base-content/30 h-4 w-8 rounded-xs"></div>
                            </div>
                            <div class="bg-base-content/15 h-0.5 w-12"></div>
                        </div>
                    </div>
                ),
            },
        ],
    },
    {
        id: "advanced-label",
        isTitle: true,
        label: "Dynamics",
    },
    {
        id: "interactions",
        icon: "lucide--layers-3",
        label: "Interactions",
        children: [
            {
                id: "interactions-carousel",
                label: "Carousel",
                url: "/components/interactions/carousel",
                preview: (
                    <div class="space-y-2.5">
                        <div class="flex items-center justify-between gap-1.5">
                            <div class="to-base-content/15 h-10 w-8 rounded-xs bg-linear-to-r from-transparent to-[80%]"></div>
                            <div class="bg-base-content/25 h-10 w-12 rounded-xs"></div>
                            <div class="bg-base-content/25 h-10 w-12 rounded-xs max-sm:hidden"></div>
                            <div class="to-base-content/15 h-10 w-8 rounded-xs bg-linear-to-l from-transparent to-[80%]"></div>
                        </div>
                        <div class="flex justify-between gap-2">
                            <div class="bg-base-content/10 text-base-content/80 flex items-center justify-center rounded-full p-1">
                                <span class="iconify lucide--chevron-left size-3"></span>
                            </div>
                            <div class="flex items-center gap-[3px]">
                                <div class="bg-base-content/15 size-1.5 rounded-full"></div>
                                <div class="bg-base-content/15 size-1.5 rounded-full"></div>
                                <div class="bg-base-content/30 size-1.5 rounded-full"></div>
                                <div class="bg-base-content/15 size-1.5 rounded-full"></div>
                                <div class="bg-base-content/15 size-1.5 rounded-full"></div>
                            </div>
                            <div class="bg-base-content/10 text-base-content/80 flex items-center justify-center rounded-full p-1">
                                <span class="iconify lucide--chevron-right size-3"></span>
                            </div>
                        </div>
                    </div>
                ),
            },
            {
                id: "interactions-clipboard",
                label: "Clipboard",
                url: "/components/interactions/clipboard",
                preview: (
                    <div class="border-base-300 text-base-content/70 bg-base-content/3 w-3/4 space-y-1.5 rounded-xs border p-2 text-xs sm:w-3/5">
                        <p>Write and copy instantly</p>
                        <div class="mt-3 flex items-center justify-end gap-1.5">
                            <span class="iconify lucide--copy size-3.5"></span>
                        </div>
                    </div>
                ),
            },
            {
                id: "interactions-datatables",
                label: "Data Tables",
                url: "/components/interactions/datatables",
                preview: (
                    <div class="w-3/4 sm:w-1/2">
                        <div class="flex items-center gap-1">
                            <div class="bg-base-content/25 h-2 w-8 rounded-xs"></div>
                            <div class="bg-base-content/20 ms-auto size-2 rounded-xs"></div>
                            <div class="bg-base-content/20 size-2 rounded-xs"></div>
                        </div>
                        <div class="border-base-300 divide-base-200 mt-1.5 divide-y rounded-xs border">
                            <div class="grid grid-cols-3 gap-1 p-1">
                                <div class="bg-base-content/25 h-1.5 w-4 rounded-xs"></div>
                                <div class="bg-base-content/25 h-1.5 w-6 rounded-xs"></div>
                                <div class="bg-base-content/25 h-1.5 w-6 rounded-xs"></div>
                            </div>
                            <div class="grid grid-cols-3 gap-1 p-1">
                                <div class="bg-base-content/15 h-1.5 w-4 rounded-xs"></div>
                                <div class="bg-base-content/15 h-1.5 w-6 rounded-xs"></div>
                                <div class="bg-base-content/15 h-1.5 w-8 rounded-xs"></div>
                            </div>
                            <div class="grid grid-cols-3 gap-1 p-1">
                                <div class="bg-base-content/15 h-1.5 w-4 rounded-xs"></div>
                                <div class="bg-base-content/15 h-1.5 w-7 rounded-xs"></div>
                                <div class="bg-base-content/15 h-1.5 w-3 rounded-xs"></div>
                            </div>
                            <div class="grid grid-cols-3 gap-1 p-1">
                                <div class="bg-base-content/15 h-1.5 w-4 rounded-xs"></div>
                                <div class="bg-base-content/15 h-1.5 w-5 rounded-xs"></div>
                                <div class="bg-base-content/15 h-1.5 w-8 rounded-xs"></div>
                            </div>
                        </div>
                        <div class="mt-1.5 flex items-center gap-0.5">
                            <div class="bg-base-content/15 h-1.5 w-5 rounded-xs"></div>
                            <div class="bg-base-content/25 ms-auto size-1.5 rounded-xs"></div>
                            <div class="bg-base-content/15 size-1.5 rounded-xs"></div>
                            <div class="bg-base-content/15 size-1.5 rounded-xs"></div>
                            <div class="bg-base-content/15 size-1.5 rounded-xs"></div>
                            <div class="bg-base-content/25 size-1.5 rounded-xs"></div>
                        </div>
                    </div>
                ),
            },
            {
                id: "interactions-fab",
                label: "FAB",
                url: "/components/interactions/fab",
                preview: (
                    <div class="flex flex-col items-end justify-end space-y-1.5">
                        <div class="flex items-end gap-1">
                            <div class="bg-base-content/25 size-2 rounded-full"></div>
                            <div class="bg-base-content/15 h-2 w-12 rounded-xs"></div>
                        </div>
                        <div class="flex items-end gap-1">
                            <div class="bg-base-content/25 size-2 rounded-full"></div>
                            <div class="bg-base-content/15 h-2 w-16 rounded-xs"></div>
                        </div>
                        <div class="flex items-end gap-1">
                            <div class="bg-base-content/25 size-2 rounded-full"></div>
                            <div class="bg-base-content/15 h-2 w-10 rounded-xs"></div>
                        </div>
                        <div class="bg-base-content/25 size-6 rounded-full shadow-lg"></div>
                    </div>
                ),
            },
            {
                id: "interactions-file-upload",
                label: "File Upload",
                url: "/components/interactions/file-upload",
                preview: (
                    <div class="border-base-300 w-3/4 rounded-xs border border-dashed sm:w-3/5">
                        <div class="text-base-content/70 flex flex-col items-center justify-center gap-1 pt-5 pb-3 text-xs">
                            <span class="iconify lucide--upload"></span>
                            Add Files
                        </div>
                        <div class="bg-base-content/10 m-1.5 flex items-center gap-1.5 rounded-xs p-1.5">
                            <div class="bg-base-content/25 size-3 rounded-full"></div>
                            <div class="space-y-0.5">
                                <div class="bg-base-content/30 h-1.5 w-8 rounded-xs"></div>
                                <div class="bg-base-content/20 h-1 w-4 rounded-xs"></div>
                            </div>
                            <span class="iconify lucide--x text-base-content/50 ms-auto size-2.5"></span>
                        </div>
                    </div>
                ),
            },
            {
                id: "interactions-flatpickr",
                label: "Flatpickr",
                url: "/components/interactions/flatpickr",
                preview: (
                    <div>
                        <div class="border-base-300 text-base-content/70 rounded-xs border px-1.5 py-0.5 text-[9px]">
                            DD/MM/YY
                        </div>
                        <div class="border-base-300 mt-1.5 rounded-xs border p-1.5">
                            <div class="flex items-center justify-between">
                                <div class="bg-base-content/20 size-2 rounded-xs"></div>
                                <div class="bg-base-content/25 h-2 w-8 rounded-xs"></div>
                                <div class="bg-base-content/20 size-2 rounded-xs"></div>
                            </div>
                            <div class="mt-2 grid grid-cols-7 gap-1">
                                <div></div>
                                <div></div>
                                {Array.from({ length: 14 }).map((_, i) => (
                                    <div key={i} class="bg-base-content/15 size-2 rounded-xs"></div>
                                ))}
                                <div class="bg-base-content/60 size-2 rounded-xs"></div>
                                {Array.from({ length: 15 }).map((_, i) => (
                                    <div key={i} class="bg-base-content/15 size-2 rounded-xs"></div>
                                ))}
                            </div>
                        </div>
                    </div>
                ),
            },
            {
                id: "interactions-form-validations",
                label: "Form Validations",
                url: "/components/interactions/form-validations",
                preview: (
                    <div class="w-3/4 sm:w-1/2">
                        <div class="flex items-center justify-between gap-1">
                            <div class="bg-base-content/15 h-1.5 w-6 rounded-xs"></div>
                            <div class="bg-base-content/15 h-1.5 w-6 rounded-xs"></div>
                        </div>
                        <div class="border-base-300 text-base-content/70 mt-1 flex items-center justify-between gap-1 rounded-xs border px-1.5 py-0.5 text-xs">
                            <div class="bg-base-content/10 h-1.5 w-6 rounded-xs"></div>
                            <span class="iconify lucide--circle-alert text-base-content/50 size-3"></span>
                        </div>
                        <div class="bg-base-content/15 mt-1 h-1.5 w-12 rounded-xs"></div>
                    </div>
                ),
            },
            {
                id: "interactions-input-spinner",
                label: "Input Spinner",
                url: "/components/interactions/input-spinner",
                preview: (
                    <div class="text-base-content/70 flex items-center gap-2.5">
                        <div class="bg-base-content/20 flex items-center justify-center rounded-full p-1.5">
                            <span class="iconify lucide--minus size-4"></span>
                        </div>
                        <div class="border-base-300 w-18 rounded-xs border px-2 py-1 text-sm">45</div>
                        <div class="bg-base-content/20 flex items-center justify-center rounded-full p-1.5">
                            <span class="iconify lucide--plus size-4"></span>
                        </div>
                    </div>
                ),
            },
            {
                id: "interactions-password-meter",
                label: "Password Meter",
                url: "/components/interactions/password-meter",
                preview: (
                    <div class="w-3/4 space-y-1.5 sm:w-3/5">
                        <div class="border-base-300 flex items-center gap-0.5 rounded-xs border px-2 py-1.5">
                            <div class="bg-base-content/25 size-1.5 rounded-full"></div>
                            <div class="bg-base-content/25 size-1.5 rounded-full"></div>
                            <div class="bg-base-content/25 size-1.5 rounded-full"></div>
                            <div class="bg-base-content/25 size-1.5 rounded-full"></div>
                            <div class="bg-base-content/25 size-1.5 rounded-full"></div>
                            <div class="bg-base-content/25 size-1.5 rounded-full"></div>
                            <span class="iconify lucide--eye-off text-base-content/50 ms-auto size-3.5"></span>
                        </div>
                        <div class="flex items-center gap-1">
                            <div class="bg-base-content/25 h-1.5 grow rounded-full"></div>
                            <div class="bg-base-content/25 h-1.5 grow rounded-full"></div>
                            <div class="bg-base-content/25 h-1.5 grow rounded-full"></div>
                            <div class="bg-base-content/10 h-1.5 grow rounded-full"></div>
                            <div class="bg-base-content/10 h-1.5 grow rounded-full"></div>
                        </div>
                        <div class="mt-2.5 space-y-0.5">
                            <div class="text-base-content/60 flex items-center gap-1.5">
                                <span class="iconify lucide--check size-2.5"></span>
                                <div class="bg-base-content/25 h-1.5 w-12 rounded-xs"></div>
                            </div>
                            <div class="text-base-content/60 flex items-center gap-1.5">
                                <span class="iconify lucide--check size-2.5"></span>
                                <div class="bg-base-content/25 h-1.5 w-16 rounded-xs"></div>
                            </div>
                            <div class="text-base-content/40 flex items-center gap-1.5">
                                <span class="iconify lucide--check size-2.5"></span>
                                <div class="bg-base-content/10 h-1.5 w-10 rounded-xs"></div>
                            </div>
                        </div>
                    </div>
                ),
            },
            {
                id: "interactions-select",
                label: "Select",
                url: "/components/interactions/select",
                preview: (
                    <div class="border-base-300 w-3/4 rounded-xs border sm:w-1/2">
                        <div class="text-base-content/70 border-base-300 flex items-center gap-2 border-b p-1.5 text-[10px]">
                            <div class="bg-base-content/15 rounded-full px-1.5 py-0.5">Design</div>
                            <p class="grow">Select</p>
                            <span class="iconify lucide--chevron-down size-3"></span>
                        </div>
                        <div class="space-y-1.5 p-1.5">
                            <div class="bg-base-content/20 h-2 w-8 rounded-xs"></div>
                            <div class="bg-base-content/30 h-2 w-12 rounded-xs"></div>
                            <div class="bg-base-content/20 h-2 w-10 rounded-xs"></div>
                            <div class="bg-base-content/20 h-2 w-14 rounded-xs"></div>
                        </div>
                    </div>
                ),
            },
            {
                id: "interactions-sortable",
                label: "Sortable",
                url: "/components/interactions/sortable",
                preview: (
                    <div class="text-base-content/60 space-y-2.5">
                        <div class="bg-base-content/15 flex h-4 w-20 items-center justify-end rounded-xs">
                            <span class="iconify lucide--grip-vertical size-3"></span>
                        </div>
                        <div class="border-base-content/20 bg-base-content/5 relative h-4 rounded-xs border border-dashed">
                            <div class="bg-base-content/35 absolute inset-0 start-2.5 -top-1.5 flex h-4 w-20 items-center justify-end rounded-xs">
                                <span class="iconify lucide--grip-vertical size-3"></span>
                            </div>
                        </div>
                        <div class="bg-base-content/15 flex h-4 w-20 items-center justify-end rounded-xs">
                            <span class="iconify lucide--grip-vertical size-3"></span>
                        </div>
                        <div class="bg-base-content/15 flex h-4 w-20 items-center justify-end rounded-xs">
                            <span class="iconify lucide--grip-vertical size-3"></span>
                        </div>
                    </div>
                ),
            },
            {
                id: "interactions-text-editor",
                label: "Text Editor",
                url: "/components/interactions/text-editor",
                preview: (
                    <div class="border-base-300 w-3/4 rounded-xs border sm:w-3/5">
                        <div class="bg-base-content/10 flex items-center gap-1 p-1">
                            <div class="bg-base-content/25 size-2 rounded-xs"></div>
                            <div class="bg-base-content/35 size-2 rounded-xs"></div>
                            <div class="bg-base-content/25 size-2 rounded-xs"></div>
                            <div class="bg-base-content/25 mx-0.5 h-2 w-px" />
                            <div class="bg-base-content/25 size-2 rounded-xs"></div>
                            <div class="bg-base-content/15 size-2 rounded-xs"></div>
                            <div class="bg-base-content/25 ms-auto size-2 rounded-xs"></div>
                            <div class="bg-base-content/25 size-2 rounded-xs"></div>
                        </div>
                        <div class="text-base-content/70 bg-base-content/3 h-16 p-2 text-sm">
                            <p class="font-medium">Hello World</p>
                            <p class="text-xs italic">Write anything</p>
                        </div>
                    </div>
                ),
            },
            {
                id: "interactions-wizard",
                label: "Wizard",
                url: "/components/interactions/wizard",
                preview: (
                    <div class="w-3/4 space-y-2 sm:w-3/5">
                        <div class="flex items-center gap-1.5">
                            <div class="bg-base-content/30 size-2 rounded-full"></div>
                            <div class="bg-base-content/20 h-1.5 w-5 rounded-xs"></div>
                            <div class="bg-base-content/30 size-2 rounded-full"></div>
                            <div class="bg-base-content/20 h-1.5 w-5 rounded-xs"></div>
                            <div class="bg-base-content/30 size-2 rounded-full"></div>
                            <div class="bg-base-content/20 h-1.5 w-5 rounded-xs"></div>
                        </div>
                        <div class="bg-base-content/5 h-12 w-full rounded-xs"></div>
                        <div class="flex items-center justify-between gap-1.5">
                            <div class="bg-base-content/25 h-3 w-6 rounded-xs"></div>
                            <div class="bg-base-content/30 h-3 w-6 rounded-xs"></div>
                        </div>
                    </div>
                ),
            },
        ],
    },
    {
        id: "apex-charts",
        label: "Apex Charts",
        icon: "lucide--chart-bar",
        children: [
            {
                id: "apex-charts-area",
                label: "Area",
                url: "/components/apex-charts/area",
                preview: (
                    <svg viewBox="0 0 150 100" class="w-4/5 sm:w-3/5">
                        <line x1="20" y1="10" x2="20" y2="90" class="stroke-base-content/20" stroke-width="1.5" />
                        <line x1="20" y1="90" x2="140" y2="90" class="stroke-base-content/20" stroke-width="1.5" />
                        <path
                            d="M20 90 L35 70 Q42 60, 50 65 T65 50 Q72 40, 80 45 T95 30 Q102 25, 110 30 L125 20 L125 90 L20 90 Z"
                            class="fill-base-content/20"
                        />
                        <path
                            d="M20 90 L35 70 Q42 60, 50 65 T65 50 Q72 40, 80 45 T95 30 Q102 25, 110 30 L125 20"
                            class="stroke-base-content/30"
                            fill="none"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                    </svg>
                ),
            },
            {
                id: "apex-charts-bar",
                label: "Bar",
                url: "/components/apex-charts/bar",
                preview: (
                    <svg viewBox="0 0 150 100" class="w-4/5 sm:w-3/5">
                        <line x1="20" y1="95" x2="140" y2="95" class="stroke-base-content/20" stroke-width="1.5" />

                        <line x1="20" y1="10" x2="20" y2="95" class="stroke-base-content/20" stroke-width="1.5" />

                        <rect x="20" y="15" width="70" height="12" rx="1" class="fill-base-content/30" />
                        <rect x="20" y="35" width="40" height="12" rx="1" class="fill-base-content/30" />
                        <rect x="20" y="55" width="90" height="12" rx="1" class="fill-base-content/30" />
                        <rect x="20" y="75" width="55" height="12" rx="1" class="fill-base-content/30" />
                    </svg>
                ),
            },
            {
                id: "apex-charts-column",
                label: "Column",
                url: "/components/apex-charts/column",
                preview: (
                    <svg viewBox="0 0 150 100" class="w-4/5 sm:w-3/5">
                        <line x1="20" y1="10" x2="20" y2="90" class="stroke-base-content/20" stroke-width="1.5" />

                        <line x1="20" y1="90" x2="140" y2="90" class="stroke-base-content/20" stroke-width="1.5" />

                        <rect x="30" y="70" width="14" height="20" rx="2" class="fill-base-content/50" />
                        <rect x="30" y="50" width="14" height="20" rx="2" class="fill-base-content/35" />
                        <rect x="30" y="30" width="14" height="20" rx="2" class="fill-base-content/20" />

                        <rect x="55" y="60" width="14" height="30" rx="2" class="fill-base-content/50" />
                        <rect x="55" y="40" width="14" height="20" rx="2" class="fill-base-content/35" />
                        <rect x="55" y="25" width="14" height="15" rx="2" class="fill-base-content/20" />

                        <rect x="80" y="65" width="14" height="25" rx="2" class="fill-base-content/50" />
                        <rect x="80" y="45" width="14" height="20" rx="2" class="fill-base-content/35" />
                        <rect x="80" y="30" width="14" height="15" rx="2" class="fill-base-content/20" />

                        <rect x="105" y="75" width="14" height="15" rx="2" class="fill-base-content/50" />
                        <rect x="105" y="60" width="14" height="15" rx="2" class="fill-base-content/35" />
                        <rect x="105" y="45" width="14" height="15" rx="2" class="fill-base-content/20" />
                    </svg>
                ),
            },
            {
                id: "apex-charts-line",
                label: "Line",
                url: "/components/apex-charts/line",
                preview: (
                    <svg viewBox="0 0 150 100" class="w-4/5 sm:w-3/5">
                        <line x1="20" y1="90" x2="140" y2="90" class="stroke-base-content/20" stroke-width="1.5" />
                        <line x1="20" y1="10" x2="20" y2="90" class="stroke-base-content/20" stroke-width="1.5" />
                        <polyline
                            fill="none"
                            class="stroke-base-content/40"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="miter"
                            points="20,80 45,60 70,40 95,55 120,35"
                        />
                        <path
                            d="M20,50 C35,45 55,40 70,45 S110,55 140,50"
                            fill="none"
                            class="stroke-base-content/20"
                            stroke-width="2"
                            stroke-linecap="round"
                        />
                        <path
                            d="M20,70 C35,65 55,60 70,65 S110,75 140,70"
                            fill="none"
                            class="stroke-base-content/20"
                            stroke-width="2"
                            stroke-linecap="round"
                        />
                    </svg>
                ),
            },
            {
                id: "apex-charts-pie",
                label: "Pie",
                url: "/components/apex-charts/pie",
                preview: (
                    <div>
                        <svg class="size-24" viewBox="0 0 120 120">
                            <g
                                transform="translate(60,60)"
                                class="stroke-base-100/60"
                                stroke-width="2.5"
                                stroke-linejoin="round">
                                <path d=" M 0 0 L 0 -58 A 58 58 0 0 1 34.8 -49.3 Z " class="fill-base-content/60" />
                                <path d=" M 0 0 L 34.8 -49.3 A 58 58 0 0 1 57.6 9.3 Z " class="fill-base-content/15" />
                                <path
                                    d=" M 0 0 L 57.6 9.3 A 58 58 0 0 1 17.4 55.4 Z "
                                    fill="#f59e0b"
                                    class="fill-base-content/35"
                                />
                                <path
                                    d=" M 0 0 L 17.4 55.4 A 58 58 0 0 1 -44.7 38.6 Z "
                                    fill="#ef4444"
                                    class="fill-base-content/55"
                                />
                                <path
                                    d=" M 0 0 L -44.7 38.6 A 58 58 0 0 1 0 -58 Z "
                                    fill="#8b5cf6"
                                    class="fill-base-content/45"
                                />
                            </g>
                        </svg>
                    </div>
                ),
            },
        ],
    },
];
