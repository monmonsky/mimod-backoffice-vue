<template>
    <div>
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div class="card bg-base-100 shadow">
                <div class="card-body">
                    <div class="card-title">Basic Information</div>
                    <div class="fieldset mt-2 grid grid-cols-1 gap-4 lg:grid-cols-2">
                        <div class="space-y-2">
                            <label class="fieldset-label" for="name"> Name </label>
                            <input id="name" type="text" class="input w-full" placeholder="Name" />
                        </div>
                        <div class="space-y-2">
                            <label class="fieldset-label">Seller</label>
                            <select class="select w-full" aria-label="Select seller">
                                <option value="" disabled>Select seller</option>
                                <option>Anthony S. Amaya</option>
                                <option>Crystal R. Taylor</option>
                                <option>Jeremy M. Simon</option>
                                <option>Jane B. Bush</option>
                                <option>Francis A. Bisson</option>
                                <option>Lydia P. Barnett</option>
                                <option>John B. Lopez</option>
                            </select>
                        </div>
                        <div class="space-y-2">
                            <label class="fieldset-label" for="mobile"> Mobile </label>
                            <input id="mobile" type="tel" class="input w-full" placeholder="(098) 765 4321" />
                        </div>
                        <div class="space-y-2">
                            <label class="fieldset-label" for="email"> Email </label>
                            <input id="email" type="email" class="input w-full" placeholder="Email" />
                        </div>
                        <div class="col-span-1 space-y-2 lg:col-span-2">
                            <label class="fieldset-label" for="description"> Description </label>
                            <textarea id="description" placeholder="Description" class="textarea w-full" />
                        </div>
                    </div>
                </div>
            </div>
            <div class="card bg-base-100 h-fit shadow">
                <div class="card-body">
                    <div class="card-title">Address</div>
                    <div class="fieldset mt-2 grid grid-cols-1 gap-4 lg:grid-cols-2">
                        <div class="space-y-2">
                            <label class="fieldset-label" for="street-address"> Street Address </label>
                            <input id="street-address" type="text" class="input w-full" placeholder="Street Address" />
                        </div>
                        <div class="space-y-2">
                            <label class="fieldset-label" for="city"> City </label>
                            <input id="city" type="text" class="input w-full" placeholder="City" />
                        </div>
                        <div class="space-y-2">
                            <label class="fieldset-label" for="state"> State </label>
                            <input id="state" type="text" class="input w-full" placeholder="State" />
                        </div>
                        <div class="space-y-2">
                            <label class="fieldset-label" for="postal-code"> Postal Code </label>
                            <input id="postal-code" type="text" class="input w-full" placeholder="564-879" />
                        </div>
                        <div class="flex items-center gap-3">
                            <input id="set-as-active" class="checkbox checkbox-sm" type="checkbox" />
                            <label class="label" for="set-as-active"> Set as active </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="mt-6 flex justify-end gap-3">
            <NuxtLink class="btn btn-sm btn-ghost" href="/apps/ecommerce/shops">
                <span class="iconify lucide--x size-4" />
                Cancel
            </NuxtLink>
            <NuxtLink class="btn btn-sm btn-primary" href="/apps/ecommerce/shops">
                <span class="iconify lucide--check size-4" />
                Save
            </NuxtLink>
        </div>
    </div>
</template>
