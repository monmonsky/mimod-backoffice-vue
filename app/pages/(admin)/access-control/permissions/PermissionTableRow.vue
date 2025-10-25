<script setup lang="ts">
import type { IPermissionTableRow } from "~/types/access-control/permissions";
import { getActiveBadgeClass } from "~/utils/statusHelpers";

defineProps<IPermissionTableRow>();
</script>

<template>
    <tr>
        <td>
            <div class="font-medium">{{ display_name }}</div>
        </td>
        <td>
            <code class="text-xs text-base-content/70">{{ name }}</code>
        </td>
        <td>
            <div class="badge badge-outline badge-sm">{{ module }}</div>
        </td>
        <td>
            <div class="badge badge-outline badge-sm">{{ action }}</div>
        </td>
        <td>
            <div class="badge badge-sm" :class="getActiveBadgeClass(is_active)">
                {{ is_active ? "Active" : "Inactive" }}
            </div>
        </td>
        <td>
            <div class="text-sm text-base-content/70">{{ description || "-" }}</div>
        </td>
    </tr>
</template>
