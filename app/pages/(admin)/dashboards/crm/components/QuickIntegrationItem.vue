<script setup lang="ts">
interface IQuickIntegrationItem {
    image: string;
    name: string;
    description: string;
    isConnected: boolean;
}

const props = defineProps<IQuickIntegrationItem>();

const connected = ref(props.isConnected);

const toggleConnection = () => {
    connected.value = !connected.value;
};
</script>
<template>
    <div class="flex items-center gap-3">
        <img :src="image" alt="chat" class="bg-base-200 mask mask-squircle size-11 p-2" />
        <div class="grow">
            <p class="leading-none font-medium">{{ name }}</p>
            <p class="text-base-content/80 line-clamp-1 text-sm">{{ description }}</p>
        </div>
        <button :class="['btn btn-xs btn-soft', connected ? 'btn-primary' : 'btn-error']" @click="toggleConnection">
            {{ connected ? "Disconnect" : "Connect" }}
        </button>
    </div>
</template>
