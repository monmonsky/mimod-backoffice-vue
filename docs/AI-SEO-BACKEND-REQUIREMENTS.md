# AI SEO Generator - Backend Requirements

## Overview

Frontend sudah siap untuk fitur Generate SEO by AI. Backend perlu menyediakan endpoint untuk generate SEO metadata menggunakan AI (ChatGPT/Claude/Gemini).

## API Endpoint Required

### `POST /api/ai/generate-seo`

Generate SEO metadata (title, description, keywords) untuk product menggunakan AI.

---

## Request

### Headers
```http
Authorization: Bearer {token}
Content-Type: application/json
```

### Body
```json
{
  "name": "LEGO Classic Creative Building Set",
  "description": "A creative building set with 1000 colorful bricks for endless imagination...",
  "brand_name": "LEGO",
  "categories": ["Building Toys", "Educational Toys"],
  "tags": ["creative", "educational", "construction"],
  "age_min": 5,
  "age_max": 10
}
```

### Request Interface (TypeScript)
```typescript
interface GenerateSeoRequest {
  name: string;              // Required - Product name
  description: string;       // Required - Product description
  brand_name?: string;       // Optional - Brand name
  categories?: string[];     // Optional - Array of category names
  tags?: string[];          // Optional - Array of tags
  age_min?: number;         // Optional - Minimum age
  age_max?: number;         // Optional - Maximum age
}
```

---

## Response

### Success Response (200 OK)
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

### Response Interface (TypeScript)
```typescript
interface GenerateSeoResponse {
  status: boolean;
  statusCode: string;    // String format: "200"
  message: string;
  data: {
    title: string;        // Format: "{Product Name} - {Brand} | Minimoda"
    description: string;  // Bahasa Indonesia, include "Beli...dari...Belanja sekarang di Minimoda!"
    keywords: string;     // Mix English & Indonesian, comma-separated
  };
}
```

### Error Response (400 Bad Request)
```json
{
  "status": false,
  "statusCode": "400",
  "message": "Product name and description are required",
  "data": null
}
```

### Error Response (500 Internal Server Error)
```json
{
  "status": false,
  "statusCode": "500",
  "message": "Failed to generate SEO. AI service error.",
  "data": null
}
```

---

## Implementation Guide

### 1. AI Prompt Template

Berikut contoh prompt yang bisa digunakan untuk ChatGPT/Claude/Gemini:

```text
Generate SEO metadata untuk produk di toko online mainan anak "Minimoda" dengan detail:

Product Name: {name}
Description: {description}
Brand: {brand_name}
Categories: {categories}
Tags: {tags}
Age Range: {age_min}-{age_max} years

Aturan generate SEO:
1. SEO Title: Format "{Product Name} - {Brand} | Minimoda" (max 60 karakter)
2. Meta Description: Bahasa Indonesia, format "Beli {Product Name} dari {Brand}. {Description singkat} Belanja sekarang di Minimoda!" (120-160 karakter)
3. SEO Keywords: Mix bahasa Inggris & Indonesia, comma-separated (5-10 keywords relevan, tambahkan: pakaian anak, fashion anak, baju anak berkualitas)

Return dalam JSON format:
{
  "title": "...",
  "description": "...",
  "keywords": "..."
}
```

### 2. PHP/Laravel Example

```php
<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Http\Controllers\Controller;

class AiSeoController extends Controller
{
    public function generateSeo(Request $request)
    {
        // Validate request
        $validated = $request->validate([
            'name' => 'required|string',
            'description' => 'required|string',
            'brand_name' => 'nullable|string',
            'categories' => 'nullable|array',
            'tags' => 'nullable|array',
            'age_min' => 'nullable|integer',
            'age_max' => 'nullable|integer',
        ]);

        // Build prompt
        $prompt = $this->buildPrompt($validated);

        try {
            // Call OpenAI API
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . env('OPENAI_API_KEY'),
                'Content-Type' => 'application/json',
            ])->timeout(30)->post('https://api.openai.com/v1/chat/completions', [
                'model' => 'gpt-4-turbo-preview',
                'messages' => [
                    [
                        'role' => 'system',
                        'content' => 'You are an SEO expert specializing in e-commerce product optimization.'
                    ],
                    [
                        'role' => 'user',
                        'content' => $prompt
                    ]
                ],
                'temperature' => 0.7,
                'max_tokens' => 500,
                'response_format' => ['type' => 'json_object']
            ]);

            if (!$response->successful()) {
                return response()->json([
                    'status' => false,
                    'statusCode' => 500,
                    'message' => 'AI service error',
                    'data' => null
                ], 500);
            }

            $aiResponse = $response->json();
            $content = $aiResponse['choices'][0]['message']['content'];
            $seoData = json_decode($content, true);

            return response()->json([
                'status' => true,
                'statusCode' => '200',  // String format
                'message' => 'SEO generated successfully (using AI)',
                'data' => [
                    'title' => $seoData['title'] ?? '',
                    'description' => $seoData['description'] ?? '',
                    'keywords' => $seoData['keywords'] ?? '',
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'statusCode' => '500',  // String format
                'message' => 'Failed to generate SEO: ' . $e->getMessage(),
                'data' => null
            ], 500);
        }
    }

    private function buildPrompt(array $data): string
    {
        $prompt = "Generate SEO metadata untuk produk di toko online mainan anak \"Minimoda\":\n\n";
        $prompt .= "Product Name: {$data['name']}\n";
        $prompt .= "Description: {$data['description']}\n";

        if (!empty($data['brand_name'])) {
            $prompt .= "Brand: {$data['brand_name']}\n";
        }

        if (!empty($data['categories'])) {
            $prompt .= "Categories: " . implode(', ', $data['categories']) . "\n";
        }

        if (!empty($data['tags'])) {
            $prompt .= "Tags: " . implode(', ', $data['tags']) . "\n";
        }

        if (!empty($data['age_min']) && !empty($data['age_max'])) {
            $prompt .= "Age Range: {$data['age_min']}-{$data['age_max']} years\n";
        }

        $prompt .= "\nAturan generate SEO:\n";
        $prompt .= "1. SEO Title: Format \"{Product Name} - {Brand} | Minimoda\" (max 60 karakter)\n";
        $prompt .= "2. Meta Description: Bahasa Indonesia, format \"Beli {Product Name} dari {Brand}. {Description singkat} Belanja sekarang di Minimoda!\" (120-160 karakter)\n";
        $prompt .= "3. SEO Keywords: Mix bahasa Inggris & Indonesia, comma-separated (5-10 keywords, tambahkan: pakaian anak, fashion anak, baju anak berkualitas)\n\n";
        $prompt .= "Return dalam JSON format dengan keys: title, description, keywords";

        return $prompt;
    }
}
```

### 3. Node.js/Express Example

```javascript
const express = require('express');
const OpenAI = require('openai');
const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

router.post('/ai/generate-seo', async (req, res) => {
  try {
    const {
      name,
      description,
      brand_name,
      categories = [],
      tags = [],
      age_min,
      age_max
    } = req.body;

    // Validate required fields
    if (!name || !description) {
      return res.status(400).json({
        status: false,
        statusCode: 400,
        message: 'Product name and description are required',
        data: null
      });
    }

    // Build prompt
    let prompt = `Generate SEO metadata for an e-commerce product:\n\n`;
    prompt += `Product Name: ${name}\n`;
    prompt += `Description: ${description}\n`;

    if (brand_name) prompt += `Brand: ${brand_name}\n`;
    if (categories.length) prompt += `Categories: ${categories.join(', ')}\n`;
    if (tags.length) prompt += `Tags: ${tags.join(', ')}\n`;
    if (age_min && age_max) prompt += `Age Range: ${age_min}-${age_max} years\n`;

    prompt += `\nGenerate:\n`;
    prompt += `1. SEO Title (50-60 characters)\n`;
    prompt += `2. Meta Description (120-160 characters)\n`;
    prompt += `3. SEO Keywords (5-10 keywords, comma-separated)\n\n`;
    prompt += `Return as JSON with keys: title, description, keywords`;

    // Call OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are an SEO expert for e-commerce products.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 500,
      response_format: { type: 'json_object' }
    });

    const seoData = JSON.parse(completion.choices[0].message.content);

    res.json({
      status: true,
      statusCode: '200',  // String format
      message: 'SEO generated successfully (using AI)',
      data: {
        title: seoData.title || '',
        description: seoData.description || '',
        keywords: seoData.keywords || ''
      }
    });

  } catch (error) {
    console.error('AI SEO Error:', error);
    res.status(500).json({
      status: false,
      statusCode: '500',  // String format
      message: 'Failed to generate SEO',
      data: null
    });
  }
});

module.exports = router;
```

---

## Environment Variables

Tambahkan ke `.env`:

```env
# OpenAI
OPENAI_API_KEY=sk-...

# Or Claude (Anthropic)
ANTHROPIC_API_KEY=sk-ant-...

# Or Google Gemini
GOOGLE_AI_API_KEY=...
```

---

## Alternative AI Services

### 1. Claude (Anthropic)
```
Endpoint: https://api.anthropic.com/v1/messages
Model: claude-3-sonnet-20240229
```

### 2. Google Gemini
```
Endpoint: https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent
Model: gemini-pro
```

### 3. Local LLM (Ollama)
```
Endpoint: http://localhost:11434/api/generate
Model: llama2, mistral, etc.
```

---

## Testing

### cURL Example
```bash
curl -X POST http://localhost:8000/api/ai/generate-seo \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "LEGO Classic Creative Building Set",
    "description": "A creative building set with 1000 colorful bricks",
    "brand_name": "LEGO",
    "categories": ["Building Toys", "Educational"],
    "tags": ["creative", "educational"],
    "age_min": 5,
    "age_max": 10
  }'
```

---

## Frontend Integration (Already Done)

Frontend sudah implement di:
- ✅ `app/composables/useAISeo.ts` - API caller
- ✅ `app/pages/(admin)/catalogs/products/components/ProductSeoCard.vue` - UI component
- ✅ `app/pages/(admin)/catalogs/products/[id]/edit.vue` - Edit product page
- ✅ `app/pages/(admin)/catalogs/products/create/index.vue` - Create product page

User flow:
1. User isi product name & description
2. User klik "Generate by AI" button
3. Frontend kirim POST request ke `/api/ai/generate-seo`
4. Backend return SEO data
5. Form auto-fill dengan generated SEO

---

## Best Practices

### 1. Rate Limiting
Implement rate limiting untuk prevent abuse:
```php
// Laravel example
Route::post('/ai/generate-seo', [AiSeoController::class, 'generateSeo'])
    ->middleware('throttle:10,1'); // 10 requests per minute
```

### 2. Caching
Cache similar requests untuk save API costs:
```php
$cacheKey = 'seo_' . md5($request->name . $request->description);
return Cache::remember($cacheKey, 3600, function() use ($request) {
    return $this->callAiService($request);
});
```

### 3. Template Fallback (RECOMMENDED)
Jika AI service down atau untuk save costs, gunakan template approach:

```php
private function generateWithTemplate(array $data): array
{
    // Build title: "{Product Name} - {Brand} | Minimoda"
    $title = $data['name'];
    if (!empty($data['brand_name'])) {
        $title .= ' - ' . $data['brand_name'];
    }
    $title .= ' | Minimoda';

    // Limit to 60 characters
    if (strlen($title) > 60) {
        $title = substr($title, 0, 57) . '...';
    }

    // Build description: "Beli {Product Name} dari {Brand}. {Description} Belanja sekarang di Minimoda!"
    $description = 'Beli ' . $data['name'];
    if (!empty($data['brand_name'])) {
        $description .= ' dari ' . $data['brand_name'];
    }
    $description .= '. ' . $data['description'] . ' Belanja sekarang di Minimoda!';

    // Limit to 160 characters
    if (strlen($description) > 160) {
        $description = substr($description, 0, 157) . '...';
    }

    // Build keywords: Product Name, Brand, Categories, default keywords
    $keywords = [$data['name']];

    if (!empty($data['brand_name'])) {
        $keywords[] = $data['brand_name'];
    }

    if (!empty($data['categories'])) {
        $keywords = array_merge($keywords, $data['categories']);
    }

    // Add default Minimoda keywords
    $keywords[] = 'pakaian anak';
    $keywords[] = 'fashion anak';
    $keywords[] = 'baju anak berkualitas';

    return [
        'title' => $title,
        'description' => $description,
        'keywords' => implode(', ', $keywords),
    ];
}

// Usage with fallback
public function generateSeo(Request $request)
{
    // ... validation ...

    try {
        // Try AI first
        $seoData = $this->generateWithAI($validated);
        $message = 'SEO generated successfully (using AI)';
    } catch (\Exception $e) {
        // Fallback to template
        \Log::warning('AI SEO failed, using template: ' . $e->getMessage());
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

### 4. Validation
Validate AI response sebelum return:
```php
if (strlen($seoData['title']) > 60) {
    $seoData['title'] = substr($seoData['title'], 0, 60);
}
if (strlen($seoData['description']) > 160) {
    $seoData['description'] = substr($seoData['description'], 0, 160);
}
```

---

## Cost Estimation

### OpenAI GPT-4 Turbo
- ~300 tokens per request
- $0.01 per 1K tokens (input)
- ~$0.003 per SEO generation

### Claude Sonnet
- ~300 tokens per request
- $0.003 per 1K tokens (input)
- ~$0.001 per SEO generation

### Gemini Pro
- FREE tier: 60 requests per minute
- Paid: $0.0005 per 1K characters

---

## Support & Documentation

- OpenAI Docs: https://platform.openai.com/docs
- Claude Docs: https://docs.anthropic.com
- Gemini Docs: https://ai.google.dev/docs

---

**Frontend Status:** ✅ Ready
**Backend Status:** ⏳ Need Implementation
**Priority:** Medium
**Estimated Implementation Time:** 2-4 hours
