<template>
    <div class="card card-border bg-base-100">
        <div class="card-body">
            <p class="bg-base-200 rounded-box px-3 py-2 font-medium">Payment Information</p>
            <div class="mt-3 flex gap-3">
                <span class="iconify lucide--credit-card size-6" />
                <div class="grow">
                    <p class="font-medium">Ends with 2487</p>
                    <p class="text-base-content/80 text-sm">Expired at 08/27</p>
                </div>
                <div class="badge badge-success badge-sm badge-dash">Paid</div>
            </div>
            <div class="mt-2 text-end">
                <button class="btn btn-primary btn-soft btn-sm">
                    <span class="iconify lucide--arrow-left-right size-4" />
                    Transactions
                </button>
            </div>
        </div>
    </div>
</template>
