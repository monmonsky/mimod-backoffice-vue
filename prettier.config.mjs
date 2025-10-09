export default {
    printWidth: 120,
    tabWidth: 4,
    semi: true,
    bracketSpacing: true,
    arrowParens: "always",
    bracketSameLine: true,
    importOrder: ["<THIRD_PARTY_MODULES>", "^@/(.*)$", "^[./]"],
    importOrderGroupNamespaceSpecifiers: true,
    plugins: ["@trivago/prettier-plugin-sort-imports", "prettier-plugin-tailwindcss"],
    importOrderSeparation: true,
    importOrderSortSpecifiers: true,
};
