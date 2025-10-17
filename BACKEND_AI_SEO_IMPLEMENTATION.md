# Backend Implementation: AI SEO Generation

## Overview
Implementasi endpoint untuk generate SEO metadata menggunakan Google Gemini API.

---

## 1. Setup Gemini API Key

### Dapatkan API Key:
1. Buka: https://aistudio.google.com/
2. Login dengan Google Account
3. Klik "Get API Key"
4. Copy API key

### Tambahkan ke `.env`:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

---

## 2. Install HTTP Client (Guzzle)

Jika belum ada, install Guzzle:
```bash
composer require guzzlehttp/guzzle
```

---

## 3. Create Controller

**File:** `app/Http/Controllers/Api/AiSeoController.php`

```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Validator;

class AiSeoController extends Controller
{
    public function generateSeo(Request $request)
    {
        // Validation
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'brand_name' => 'nullable|string',
            'categories' => 'nullable|array',
            'tags' => 'nullable|array',
            'age_min' => 'nullable|integer',
            'age_max' => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'statusCode' => 422,
                'message' => 'Validation error',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            // Prepare data
            $name = $request->input('name');
            $description = $request->input('description');
            $brandName = $request->input('brand_name', '');
            $categories = $request->input('categories', []);
            $tags = $request->input('tags', []);
            $ageMin = $request->input('age_min', 0);
            $ageMax = $request->input('age_max', 0);

            // Build age range string
            $ageRange = '';
            if ($ageMin > 0 && $ageMax > 0) {
                $ageRange = "{$ageMin}-{$ageMax} tahun";
            }

            // Build categories string
            $categoriesStr = !empty($categories) ? implode(', ', $categories) : 'General';

            // Build tags string
            $tagsStr = !empty($tags) ? implode(', ', $tags) : '';

            // Build prompt for Gemini
            $prompt = $this->buildPrompt($name, $description, $brandName, $categoriesStr, $tagsStr, $ageRange);

            // Call Gemini API
            $apiKey = config('services.gemini.api_key'); // or env('GEMINI_API_KEY')

            $response = Http::timeout(30)
                ->post("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={$apiKey}", [
                    'contents' => [
                        [
                            'parts' => [
                                ['text' => $prompt]
                            ]
                        ]
                    ],
                    'generationConfig' => [
                        'temperature' => 0.7,
                        'topK' => 40,
                        'topP' => 0.95,
                        'maxOutputTokens' => 1024,
                    ]
                ]);

            if ($response->failed()) {
                throw new \Exception('Failed to generate SEO from AI: ' . $response->body());
            }

            $result = $response->json();

            // Extract text from response
            $generatedText = $result['candidates'][0]['content']['parts'][0]['text'] ?? '';

            // Parse JSON from generated text
            $seoData = $this->parseGeneratedSeo($generatedText);

            return response()->json([
                'status' => true,
                'statusCode' => 200,
                'message' => 'SEO generated successfully',
                'data' => $seoData,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'statusCode' => 500,
                'message' => 'Failed to generate SEO',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Build prompt for Gemini AI
     */
    private function buildPrompt($name, $description, $brandName, $categories, $tags, $ageRange)
    {
        $prompt = "Generate SEO metadata untuk produk e-commerce dengan detail berikut:\n\n";
        $prompt .= "Nama Produk: {$name}\n";
        $prompt .= "Brand: {$brandName}\n";
        $prompt .= "Deskripsi: {$description}\n";
        $prompt .= "Kategori: {$categories}\n";

        if (!empty($tags)) {
            $prompt .= "Tags: {$tags}\n";
        }

        if (!empty($ageRange)) {
            $prompt .= "Rentang Usia: {$ageRange}\n";
        }

        $prompt .= "\nRequirements:\n";
        $prompt .= "1. SEO Title: Maksimal 60 karakter, include brand dan main keywords, menarik untuk diklik\n";
        $prompt .= "2. Meta Description: 120-160 karakter, persuasif dan include call-to-action (misal: 'Beli sekarang', 'Dapatkan diskon', dll)\n";
        $prompt .= "3. Keywords: 5-10 relevant keywords, comma-separated, fokus pada search intent\n\n";
        $prompt .= "PENTING: Return HANYA valid JSON dalam format ini, tanpa markdown atau text tambahan:\n";
        $prompt .= '{"title": "...", "description": "...", "keywords": "..."}';
        $prompt .= "\n\nBahasa: Indonesian (Bahasa Indonesia)";

        return $prompt;
    }

    /**
     * Parse generated SEO from AI response
     */
    private function parseGeneratedSeo($text)
    {
        // Remove markdown code blocks if any
        $text = preg_replace('/```json\s*/', '', $text);
        $text = preg_replace('/```\s*/', '', $text);
        $text = trim($text);

        // Try to decode JSON
        $decoded = json_decode($text, true);

        if (json_last_error() === JSON_ERROR_NONE) {
            return [
                'title' => $decoded['title'] ?? '',
                'description' => $decoded['description'] ?? '',
                'keywords' => $decoded['keywords'] ?? '',
            ];
        }

        // Fallback if JSON parsing fails
        throw new \Exception('Failed to parse AI response. Invalid JSON format.');
    }
}
```

---

## 4. Add Route

**File:** `routes/api.php`

```php
use App\Http\Controllers\Api\AiSeoController;

// Protected routes (requires authentication)
Route::middleware(['auth:sanctum'])->group(function () {
    // AI SEO Generation
    Route::post('/ai/generate-seo', [AiSeoController::class, 'generateSeo']);
});
```

---

## 5. Add Config (Optional)

**File:** `config/services.php`

```php
return [
    // ... existing services

    'gemini' => [
        'api_key' => env('GEMINI_API_KEY'),
    ],
];
```

---

## 6. Test Endpoint

### Request Example:
```bash
curl -X POST http://api-local.minimoda.id/api/ai/generate-seo \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mainan Edukasi Puzzle Kayu Anak",
    "description": "Puzzle kayu berkualitas tinggi untuk mengembangkan kemampuan kognitif dan motorik anak. Terbuat dari bahan ramah lingkungan.",
    "brand_name": "SmartKids",
    "categories": ["Mainan", "Edukasi", "Puzzle"],
    "tags": ["kayu", "eco-friendly", "edukasi", "puzzle"],
    "age_min": 3,
    "age_max": 7
  }'
```

### Response Example:
```json
{
  "status": true,
  "statusCode": 200,
  "message": "SEO generated successfully",
  "data": {
    "title": "Puzzle Kayu Edukasi Anak SmartKids - Ramah Lingkungan",
    "description": "Mainan puzzle kayu berkualitas tinggi dari SmartKids. Kembangkan kemampuan kognitif anak usia 3-7 tahun. Bahan eco-friendly & aman. Beli sekarang!",
    "keywords": "puzzle kayu anak, mainan edukasi, smartkids, puzzle eco-friendly, mainan kayu, edukasi anak, cognitive development, mainan usia 3-7 tahun"
  }
}
```

---

## 7. Testing & Monitoring

### Rate Limits (Gemini Free Tier):
- 15 requests per minute
- 1,500 requests per day

### Handle Rate Limiting:
Tambahkan retry logic atau queue jika diperlukan.

### Error Handling:
- Timeout: 30 seconds
- Fallback: Jika AI gagal, bisa return template-based SEO atau error message

---

## 8. Security Notes

1. **Never expose API key** di frontend
2. **Validate input** dengan baik
3. **Add rate limiting** di Laravel (throttle middleware)
4. **Log errors** untuk monitoring

---

## 9. Optional Improvements

### a. Add Caching
Cache hasil generate SEO untuk product yang sama:
```php
use Illuminate\Support\Facades\Cache;

$cacheKey = 'seo_' . md5($name . $description);
$seoData = Cache::remember($cacheKey, 3600, function() use ($prompt, $apiKey) {
    // Call Gemini API
});
```

### b. Queue Jobs
Untuk avoid timeout, pakai queue:
```php
dispatch(new GenerateSeoJob($productId, $data));
```

### c. Fallback Template
Jika AI gagal, gunakan template:
```php
if ($response->failed()) {
    return [
        'title' => "{$name} - {$brandName} | Toko Online",
        'description' => "Beli {$name} dari {$brandName}. {$description}",
        'keywords' => "{$name}, {$brandName}, " . implode(', ', $tags),
    ];
}
```

---

## 10. Frontend Integration

Frontend sudah ready dengan:
- Composable: `useAISeo.ts`
- Button di create form
- Button di edit form
- Loading state & error handling

Tinggal test setelah backend endpoint sudah aktif!

---

## Troubleshooting

### Issue: "API key not valid"
- Cek API key di `.env`
- Pastikan tidak ada spasi atau karakter hidden

### Issue: "Rate limit exceeded"
- Tunggu 1 menit
- Implementasikan rate limiting di Laravel

### Issue: "Invalid JSON response"
- Cek prompt, pastikan AI return JSON
- Lihat response raw di log

### Issue: "Timeout"
- Increase timeout di Http::timeout()
- Atau pakai queue untuk background processing

---

## Production Checklist

- [ ] API key stored securely in `.env`
- [ ] Rate limiting enabled
- [ ] Error logging implemented
- [ ] Input validation complete
- [ ] CORS configured for frontend
- [ ] Test with real data
- [ ] Monitor API usage & costs

---

**Done!** Backend implementation guide complete. Test dan monitor hasilnya! 🚀
