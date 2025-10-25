📋 Fungsi File .mdc (Markdown Context)
File .mdc adalah context files yang dibaca oleh AI assistant (Claude Code, Claude AI) untuk:
🎯 1. Memahami Project
Struktur folder dan file
Teknologi yang digunakan (Nuxt 4, Vue 3, TypeScript, daisyUI 5)
Fitur-fitur yang sudah ada
Coding standards & best practices
🔌 2. Mengetahui API Endpoints
Daftar semua endpoint yang tersedia
Request/response format
Upload flow pattern
Error handling
🎨 3. Styling dengan Benar
daisyUI component reference
Class names & modifiers
Color system
Design patterns
💡 Manfaat Menggunakan Context Files
Tanpa Context	Dengan Context
❌ AI tidak tahu struktur project	✅ AI tahu semua folder & file
❌ Saran generic, bisa salah	✅ Saran spesifik & akurat
❌ Code style tidak konsisten	✅ Code konsisten dengan project
❌ Harus jelaskan ulang setiap kali	✅ AI sudah tahu context
❌ Tebak-tebak API endpoint	✅ AI tahu endpoint yang tepat
❌ Pakai CSS framework lain	✅ AI pakai daisyUI dengan benar
🚀 Cara Menggunakan
Di Claude Code (VSCode Extension)
File-file ini otomatis dibaca oleh Claude Code. Tidak perlu konfigurasi tambahan! Contoh:
User: "Buatkan component untuk list products dengan pagination"

Claude: 
✅ Membaca project-overview.mdc → Tahu pakai Composition API + TypeScript
✅ Membaca API_ENDPOINTS.mdc → Tahu endpoint GET /catalog/products
✅ Membaca daisyui.mdc → Tahu pakai daisyUI table component
✅ Generate code yang 100% sesuai dengan project pattern!
Update Context Files
Update file-file ini ketika:
✏️ Menambah fitur/API baru
✏️ Mengubah struktur project
✏️ Update dependencies
📁 File Details
1️⃣ project-overview.mdc (9.5 KB)
✅ Project info (Nuxt 4.1.3, Vue 3.5.22, TypeScript, daisyUI 5.1.29)
✅ Complete directory structure
✅ All composables explained
✅ Development workflow
✅ Best practices & coding standards
✅ Recent changes & fixes
2️⃣ API_ENDPOINTS.mdc (9.4 KB)
✅ 106 API endpoints organized by module
✅ HTTP methods (GET, POST, PUT, PATCH, DELETE)
✅ Request/response examples
✅ Upload flow pattern (temp → move)
✅ Pagination pattern
✅ Error handling
3️⃣ daisyui.mdc (50.7 KB)
✅ Complete daisyUI 5 reference
✅ All components (button, modal, table, form, dll)
✅ Class names & modifiers
✅ Color system
✅ Size variants
✅ Usage rules
4️⃣ README.md (7.1 KB)
✅ Penjelasan fungsi context files
✅ Cara menggunakan
✅ Contoh penggunaan
✅ Tips & best practices
🎓 Contoh Real-World
Scenario: Membuat fitur Bulk Edit Variants (yang barusan kita buat) Dengan Context Files:
User: "untuk edit buatkan bulk juga"

Claude:
1. Baca project-overview.mdc → Tahu BulkVariantGenerator pattern
2. Baca API_ENDPOINTS.mdc → Tahu endpoint PUT /catalog/products/variants/{id}
3. Baca daisyui.mdc → Tahu pakai modal, table, button components
4. Generate BulkEditVariants.vue dengan:
   ✅ TypeScript types yang benar
   ✅ Composition API pattern
   ✅ useImageUpload composable
   ✅ daisyUI components
   ✅ Konsisten dengan codebase
Tanpa Context Files:
User: "untuk edit buatkan bulk juga"

Claude:
❌ Mungkin pakai Options API
❌ Mungkin pakai Bootstrap/Material UI
❌ Tidak tahu composable yang tersedia
❌ Code style berbeda
❌ Harus banyak revisi
Sekarang Claude AI sudah punya full context tentang project Anda! 🎉 File-file ini akan membuat development dengan AI assistant menjadi jauh lebih cepat, akurat, dan konsisten.