<template>
    <div class="card card-border bg-base-100">
        <div class="card-body">
            <p class="bg-base-200 rounded-box px-3 py-2 font-medium">Customer Details</p>
            <div class="mt-3 flex items-center gap-3">
                <img src="/images/avatars/5.png" class="bg-base-200 mask mask-squircle size-10 p-0.5" alt="" />
                <div class="grow">
                    <p class="font-medium">James J. Herron</p>
                    <p class="text-base-content/80 text-sm">james@mail.com</p>
                </div>
            </div>
            <div class="mt-2 flex items-center justify-end gap-1">
                <button aria-label="call a customer" class="btn btn-ghost btn-sm btn-circle">
                    <span class="iconify lucide--phone size-4" />
                </button>
                <button aria-label="mail to customer" class="btn btn-ghost btn-sm btn-circle">
                    <span class="iconify lucide--mail size-4" />
                </button>
            </div>
        </div>
    </div>
</template>
