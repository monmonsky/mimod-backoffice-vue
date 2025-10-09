<template>
    <div>
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div class="card bg-base-100 shadow">
                <div class="card-body">
                    <div class="card-title">Basic Information</div>
                    <div class="fieldset mt-2 grid grid-cols-1 gap-4 lg:grid-cols-2">
                        <div class="space-y-2">
                            <label class="fieldset-label" for="name"> Name </label>
                            <input
                                id="name"
                                type="text"
                                class="input w-full"
                                placeholder="Name"
                                value="Urban Chic Boutique" />
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
                            <input
                                id="mobile"
                                type="tel"
                                class="input w-full"
                                placeholder="(098) 765 4321"
                                value="402-788-1602" />
                        </div>
                        <div class="space-y-2">
                            <label class="fieldset-label" for="email"> Email </label>
                            <input
                                id="email"
                                type="email"
                                class="input w-full"
                                placeholder="Email"
                                value="urban.chic@yahoo.com" />
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
                            <input
                                id="street-address"
                                type="text"
                                class="input w-full"
                                placeholder="Street Address"
                                value="3701 Clay Products Dr" />
                        </div>
                        <div class="space-y-2">
                            <label class="fieldset-label" for="city"> City </label>
                            <input id="city" type="text" class="input w-full" placeholder="City" value="Anchorage" />
                        </div>
                        <div class="space-y-2">
                            <label class="fieldset-label" for="state"> State </label>
                            <input id="state" type="text" class="input w-full" placeholder="State" value="Alaska" />
                        </div>
                        <div class="space-y-2">
                            <label class="fieldset-label" for="postal-code"> Postal Code </label>
                            <input
                                id="postal-code"
                                type="text"
                                class="input w-full"
                                placeholder="564-879"
                                value="995-417" />
                        </div>
                        <div class="flex items-center gap-3">
                            <input id="set-as-active" class="checkbox checkbox-sm" type="checkbox" checked />
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
                <span class="iconify lucide--arrow-up-from-line size-4" />
                Update
            </NuxtLink>
        </div>
    </div>
</template>
