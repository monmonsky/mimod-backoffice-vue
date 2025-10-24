<script setup lang="ts">
const { locale, setLocale } = useI18n();

const languages = [
    { code: 'id', name: 'Indonesia', flag: 'https://flagcdn.com/id.svg' },
    { code: 'en', name: 'English', flag: 'https://flagcdn.com/us.svg' }
];

const currentLanguage = computed(() => {
    return languages.find((l) => l.code === locale.value) || languages[0];
});

const switchLanguage = (code: string) => {
    setLocale(code as 'id' | 'en');
};
</script>

<template>
    <div class="dropdown dropdown-bottom dropdown-center">
        <div tabindex="0" class="btn btn-ghost btn-circle btn-sm cursor-pointer">
            <img :src="currentLanguage?.flag" :alt="currentLanguage?.name" class="rounded-box size-4.5 object-cover" />
        </div>
        <div tabindex="0" class="dropdown-content bg-base-100 rounded-box mt-2 w-40 shadow z-[1]">
            <ul class="menu w-full p-2">
                <li v-for="lang in languages" :key="lang.code">
                    <a
                        @click="switchLanguage(lang.code)"
                        :class="{ 'active bg-primary/10': locale === lang.code }"
                        class="flex items-center gap-2">
                        <img
                            :src="lang.flag"
                            :alt="lang.name"
                            class="rounded-box size-4.5 cursor-pointer object-cover" />
                        <span>{{ lang.name }}</span>
                        <span v-if="locale === lang.code" class="iconify lucide--check size-4 ml-auto text-primary" />
                    </a>
                </li>
            </ul>
        </div>
    </div>
</template>
