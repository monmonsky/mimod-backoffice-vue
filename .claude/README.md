# Claude AI Context Files

Folder `.claude` berisi file-file context untuk **Claude AI Assistant** (termasuk Claude Code di VSCode). File-file ini membantu AI memahami project dengan lebih baik dan memberikan saran yang lebih akurat.

## Fungsi File `.mdc`

File `.mdc` (Markdown Context) adalah file dokumentasi yang dibaca oleh AI assistant untuk memahami:
- Struktur project
- Teknologi yang digunakan
- Best practices
- API endpoints
- Aturan coding
- Design system

Ketika Anda menggunakan Claude AI (di VSCode, Cursor, atau web), AI akan membaca file-file ini sebagai **context** untuk memberikan jawaban yang lebih relevan dengan project Anda.

## File-file dalam `.claude/rules/`

### 1. `project-overview.mdc`
**Fungsi:** Memberikan gambaran lengkap tentang project Mimod Backoffice

**Isi:**
- Informasi project (framework, teknologi, package manager)
- Struktur direktori lengkap
- Penjelasan setiap folder dan file penting
- Fitur-fitur utama aplikasi
- Workflow development
- Best practices & coding standards
- Perubahan terbaru & issue yang sudah diperbaiki

**Kapan digunakan:**
- Saat AI perlu memahami arsitektur project
- Saat membuat component/page baru
- Saat debugging atau refactoring
- Saat menambah fitur baru

### 2. `API_ENDPOINTS.mdc`
**Fungsi:** Dokumentasi lengkap semua API endpoints yang digunakan

**Isi:**
- Daftar 106 API endpoints terorganisir per modul
- HTTP methods (GET, POST, PUT, PATCH, DELETE)
- Request/response examples
- Pagination pattern
- Upload flow (temp → move)
- Error handling patterns
- Cara menggunakan composables

**Kapan digunakan:**
- Saat membuat fitur yang memanggil API
- Saat debugging API calls
- Saat perlu tahu endpoint mana yang tersedia
- Saat membuat composable baru

### 3. `daisyui.mdc`
**Fungsi:** Referensi lengkap daisyUI 5 component library

**Isi:**
- Semua component daisyUI 5 (button, card, modal, table, dll.)
- Class names dan modifiers
- Color system
- Size variants
- Usage rules & best practices
- Tailwind CSS 4 integration

**Kapan digunakan:**
- Saat membuat UI component
- Saat styling dengan daisyUI
- Saat perlu referensi class names
- Saat debugging styling issues

## Cara Menggunakan

### Di Claude Code (VSCode Extension)
File-file ini **otomatis dibaca** oleh Claude Code extension. Anda tidak perlu melakukan apa-apa. Claude akan:
1. Membaca semua file `.mdc` di folder `.claude/rules/`
2. Menggunakan informasi ini sebagai context
3. Memberikan saran yang sesuai dengan project Anda

### Di Cursor AI
File-file di `.cursor/rules/` akan otomatis dibaca oleh Cursor.

### Di Claude Web/Desktop
Anda perlu **menyebutkan** file mana yang ingin dibaca:
```
"Baca context dari .claude/rules/project-overview.mdc dan bantu saya membuat fitur baru..."
```

## Contoh Penggunaan

### Contoh 1: Membuat Component Baru
**User:** "Buatkan component untuk menampilkan list products"

**Claude (dengan context):**
- ✅ Tahu struktur component Vue dengan TypeScript
- ✅ Tahu menggunakan `useProducts()` composable
- ✅ Tahu API endpoint `GET /catalog/products`
- ✅ Tahu menggunakan daisyUI table component
- ✅ Tahu pattern loading state & error handling
- ✅ Generate code yang konsisten dengan project

**Claude (tanpa context):**
- ❌ Bisa saja menggunakan Options API (bukan Composition API)
- ❌ Tidak tahu composable apa yang tersedia
- ❌ Tidak tahu API endpoint yang benar
- ❌ Menggunakan CSS framework lain (bukan daisyUI)
- ❌ Code style tidak konsisten

### Contoh 2: Debugging API Issue
**User:** "Kenapa upload image error?"

**Claude (dengan context):**
- ✅ Tahu flow: upload temp → move permanent
- ✅ Tahu endpoint `POST /upload/temp` dan `POST /upload/move`
- ✅ Tahu payload yang benar (temp_paths, product_id, metadata)
- ✅ Tahu composable `useImageUpload()`
- ✅ Langsung cek implementasi yang benar

**Claude (tanpa context):**
- ❌ Tidak tahu upload flow aplikasi ini
- ❌ Tebak-tebak endpoint dan payload
- ❌ Saran generic yang mungkin tidak sesuai

### Contoh 3: Styling Component
**User:** "Buatkan modal dialog untuk konfirmasi delete"

**Claude (dengan context):**
- ✅ Tahu menggunakan daisyUI modal component
- ✅ Tahu class names yang benar: `modal`, `modal-box`, `modal-action`
- ✅ Tahu color system: `btn-error`, `btn-ghost`
- ✅ Generate code dengan pattern yang konsisten

**Claude (tanpa context):**
- ❌ Bisa saja buat modal dari scratch dengan custom CSS
- ❌ Tidak konsisten dengan design system

## Update Context Files

File-file ini harus **diupdate** ketika:

### `project-overview.mdc`
- ✏️ Menambah fitur baru
- ✏️ Mengubah struktur folder
- ✏️ Update teknologi/dependencies
- ✏️ Menambah composable baru
- ✏️ Mengubah workflow/best practices

### `API_ENDPOINTS.mdc`
- ✏️ Menambah endpoint API baru
- ✏️ Mengubah request/response format
- ✏️ Menambah modul baru
- ✏️ Mengubah authentication method

### `daisyui.mdc`
- ✏️ Upgrade daisyUI ke versi baru (auto update dari official docs)
- ✏️ Biasanya tidak perlu manual edit

## Keuntungan Menggunakan Context Files

### 1. **Konsistensi Code**
AI akan generate code yang konsisten dengan pattern yang sudah ada di project.

### 2. **Lebih Cepat**
Tidak perlu jelaskan struktur project setiap kali. AI sudah tahu.

### 3. **Lebih Akurat**
AI tahu API endpoints, composables, dan components yang tersedia.

### 4. **Mengurangi Error**
AI tahu best practices dan pitfalls yang harus dihindari.

### 5. **Onboarding Developer Baru**
Developer baru bisa baca file-file ini untuk cepat memahami project.

## Struktur File yang Disarankan

```
.claude/
├── README.md (file ini)
└── rules/
    ├── project-overview.mdc (overview project)
    ├── API_ENDPOINTS.mdc (dokumentasi API)
    └── daisyui.mdc (referensi UI framework)
```

## Tips

1. **Keep it Updated:** Update context files seiring development
2. **Be Specific:** Tulis informasi yang spesifik dan actionable
3. **Use Examples:** Sertakan contoh code patterns yang benar
4. **Document Decisions:** Catat keputusan arsitektur dan alasannya
5. **Link Related Files:** Referensikan file/folder terkait dengan path lengkap

## Perbedaan `.claude` vs `.cursor`

| Aspect | `.claude` | `.cursor` |
|--------|-----------|-----------|
| **Untuk AI** | Claude AI, Claude Code | Cursor AI |
| **Format** | `.mdc` (Markdown Context) | `.mdc` atau `.cursorrules` |
| **Auto-load** | Ya (di Claude Code) | Ya (di Cursor) |
| **Isi** | Sama, bisa di-sync | Sama, bisa di-sync |

Anda bisa **sync** kedua folder agar kedua AI assistant dapat context yang sama:
```bash
# Copy dari .cursor ke .claude
cp .cursor/rules/*.mdc .claude/rules/

# Atau sebaliknya
cp .claude/rules/*.mdc .cursor/rules/
```

## Referensi

- [Claude AI Documentation](https://docs.anthropic.com/claude/docs)
- [daisyUI Documentation](https://daisyui.com)
- [Nuxt.js Documentation](https://nuxt.com)
- [Vue 3 Documentation](https://vuejs.org)
- [TypeScript Documentation](https://www.typescriptlang.org)

---

**Last Updated:** 2025-10-25
**Project:** Mimod Backoffice Vue
**Maintained by:** Development Team
