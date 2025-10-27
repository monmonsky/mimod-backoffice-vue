# AI SEO Generator - Quick Reference

## 📋 Overview

Frontend sudah siap. Backend perlu implement endpoint untuk generate SEO metadata.

---

## 🔌 API Endpoint

```
POST /api/ai/generate-seo
Authorization: Bearer {token}
```

---

## 📥 Request Body

```json
{
  "name": "Premium Cotton T-Shirt",           // Required
  "description": "High quality cotton t-shirt", // Required
  "brand_name": "Fashion Brand",               // Optional
  "categories": ["Clothing"],                  // Optional
  "tags": ["cotton", "premium"],               // Optional
  "age_min": 5,                                // Optional
  "age_max": 10                                // Optional
}
```

---

## 📤 Response Format

```json
{
  "status": true,
  "statusCode": "200",  // ⚠️ STRING bukan number
  "message": "SEO generated successfully (using template)",
  "data": {
    "title": "Premium Cotton T-Shirt - Fashion Brand | Minimoda",
    "description": "Beli Premium Cotton T-Shirt dari Fashion Brand. High quality cotton t-shirt Belanja sekarang di Minimoda!",
    "keywords": "Premium Cotton T-Shirt, Fashion Brand, Clothing, pakaian anak, fashion anak, baju anak berkualitas"
  }
}
```

---

## 🎯 Format Rules

### SEO Title
```
Format: {Product Name} - {Brand} | Minimoda
Max: 60 characters
Example: "Premium Cotton T-Shirt - Fashion Brand | Minimoda"
```

### Meta Description (Bahasa Indonesia)
```
Format: Beli {Product Name} dari {Brand}. {Description} Belanja sekarang di Minimoda!
Max: 160 characters
Example: "Beli Premium Cotton T-Shirt dari Fashion Brand. High quality cotton t-shirt Belanja sekarang di Minimoda!"
```

### Keywords
```
Format: {Product Name}, {Brand}, {Categories}, pakaian anak, fashion anak, baju anak berkualitas
Example: "Premium Cotton T-Shirt, Fashion Brand, Clothing, pakaian anak, fashion anak, baju anak berkualitas"
```

---

## 💡 Implementation Options

### Option 1: Template Only (Simple, No AI Cost)
```php
public function generateSeo(Request $request)
{
    $validated = $request->validate([
        'name' => 'required|string',
        'description' => 'required|string',
        'brand_name' => 'nullable|string',
        'categories' => 'nullable|array',
        'tags' => 'nullable|array',
        'age_min' => 'nullable|integer',
        'age_max' => 'nullable|integer',
    ]);

    // Build title
    $title = $validated['name'];
    if (!empty($validated['brand_name'])) {
        $title .= ' - ' . $validated['brand_name'];
    }
    $title .= ' | Minimoda';

    // Limit to 60 chars
    if (strlen($title) > 60) {
        $title = substr($title, 0, 57) . '...';
    }

    // Build description
    $description = 'Beli ' . $validated['name'];
    if (!empty($validated['brand_name'])) {
        $description .= ' dari ' . $validated['brand_name'];
    }
    $description .= '. ' . $validated['description'] . ' Belanja sekarang di Minimoda!';

    // Limit to 160 chars
    if (strlen($description) > 160) {
        $description = substr($description, 0, 157) . '...';
    }

    // Build keywords
    $keywords = [$validated['name']];
    if (!empty($validated['brand_name'])) {
        $keywords[] = $validated['brand_name'];
    }
    if (!empty($validated['categories'])) {
        $keywords = array_merge($keywords, $validated['categories']);
    }
    $keywords[] = 'pakaian anak';
    $keywords[] = 'fashion anak';
    $keywords[] = 'baju anak berkualitas';

    return response()->json([
        'status' => true,
        'statusCode' => '200',
        'message' => 'SEO generated successfully (using template)',
        'data' => [
            'title' => $title,
            'description' => $description,
            'keywords' => implode(', ', $keywords),
        ]
    ]);
}
```

### Option 2: AI + Template Fallback (Best Quality)
```php
public function generateSeo(Request $request)
{
    // ... validation ...

    try {
        // Try AI first (OpenAI/Claude/Gemini)
        $seoData = $this->generateWithAI($validated);
        $message = 'SEO generated successfully (using AI)';
    } catch (\Exception $e) {
        // Fallback to template
        Log::warning('AI SEO failed: ' . $e->getMessage());
        $seoData = $this->generateWithTemplate($validated);
        $message = 'SEO generated successfully (using template)';
    }

    return response()->json([
        'status' => true,
        'statusCode' => '200',
        'message' => $message,
        'data' => $seoData
    ]);
}
```

---

## 🤖 AI Prompt (Jika pakai AI)

```text
Generate SEO metadata untuk produk di toko online mainan anak "Minimoda":

Product Name: {name}
Description: {description}
Brand: {brand_name}
Categories: {categories}
Tags: {tags}
Age Range: {age_min}-{age_max} years

Aturan generate SEO:
1. SEO Title: Format "{Product Name} - {Brand} | Minimoda" (max 60 karakter)
2. Meta Description: Bahasa Indonesia, format "Beli {Product Name} dari {Brand}. {Description singkat} Belanja sekarang di Minimoda!" (120-160 karakter)
3. SEO Keywords: Mix bahasa Inggris & Indonesia, comma-separated (5-10 keywords, tambahkan: pakaian anak, fashion anak, baju anak berkualitas)

Return dalam JSON format dengan keys: title, description, keywords
```

---

## 🔑 Environment Variables (Jika pakai AI)

Pilih salah satu:

```env
# OpenAI (Recommended)
OPENAI_API_KEY=sk-...

# Claude (Anthropic)
ANTHROPIC_API_KEY=sk-ant-...

# Google Gemini (Free tier available)
GOOGLE_AI_API_KEY=...
```

---

## ⚡ Testing

### cURL Example
```bash
curl -X POST http://localhost:8000/api/ai/generate-seo \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Premium Cotton T-Shirt",
    "description": "High quality cotton t-shirt",
    "brand_name": "Fashion Brand",
    "categories": ["Clothing"]
  }'
```

### Expected Response
```json
{
  "status": true,
  "statusCode": "200",
  "message": "SEO generated successfully (using template)",
  "data": {
    "title": "Premium Cotton T-Shirt - Fashion Brand | Minimoda",
    "description": "Beli Premium Cotton T-Shirt dari Fashion Brand. High quality cotton t-shirt Belanja sekarang di Minimoda!",
    "keywords": "Premium Cotton T-Shirt, Fashion Brand, Clothing, pakaian anak, fashion anak, baju anak berkualitas"
  }
}
```

---

## ✅ Validation Rules

1. **Required Fields**: `name`, `description`
2. **statusCode**: MUST be string ("200", "400", "500")
3. **Title**: Max 60 characters, append "| Minimoda"
4. **Description**: Max 160 characters, Bahasa Indonesia format
5. **Keywords**: Always include default keywords (pakaian anak, fashion anak, baju anak berkualitas)

---

## 🎨 Frontend Integration (Already Done)

Frontend sudah implement:
- ✅ Composable: `useAISeo.ts`
- ✅ Component: `ProductSeoCard.vue`
- ✅ Pages: Create & Edit product

User flow:
1. User input product name & description
2. Click "Generate by AI" button
3. Frontend call API endpoint
4. Response auto-fill SEO fields

---

## 📚 Full Documentation

Lihat dokumentasi lengkap di:
- **Backend Requirements**: [AI-SEO-BACKEND-REQUIREMENTS.md](./AI-SEO-BACKEND-REQUIREMENTS.md)
- **Testing Examples**: [AI-SEO-TESTING-EXAMPLES.md](./AI-SEO-TESTING-EXAMPLES.md)

---

## 🚀 Quick Start

**Minimal Implementation (5 menit):**

1. Create route:
```php
Route::post('/ai/generate-seo', [AiSeoController::class, 'generateSeo'])
    ->middleware('auth:sanctum');
```

2. Copy template-only code dari Option 1 di atas

3. Test dengan cURL

4. Done! Frontend langsung bisa connect.

**Dengan AI (15 menit):**

1. Setup sama seperti di atas
2. Install AI SDK (OpenAI/Claude/Gemini)
3. Add environment variable
4. Implement AI call dengan fallback to template
5. Test & done!

---

## 💰 Cost Estimation (Jika pakai AI)

| Service | Cost per Request | Free Tier |
|---------|-----------------|-----------|
| OpenAI GPT-4 | ~$0.003 | No |
| Claude Sonnet | ~$0.001 | No |
| Gemini Pro | ~$0.0005 | Yes (60 req/min) |

**Recommendation**: Start dengan template only, upgrade ke AI jika perlu kualitas lebih baik.

---

## 🎯 Success Criteria

- ✅ Response time < 5 seconds
- ✅ statusCode format string
- ✅ Title 50-60 characters
- ✅ Description 120-160 characters (Bahasa Indonesia)
- ✅ Keywords include default Minimoda keywords
- ✅ Rate limit: 10 requests/minute
