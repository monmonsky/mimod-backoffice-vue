# Upload Endpoints - Final Documentation

## 📋 Overview

Setelah cleanup, aplikasi hanya menggunakan **3 endpoint upload**:

1. **`POST /api/upload/image`** - Untuk Brand & Category (direct upload)
2. **`POST /api/upload/temp`** - Untuk Product & Variant (temp upload)
3. **`POST /api/upload/move`** - Untuk Product & Variant (move to permanent)

---

## 🎯 Upload Strategy by Module

| Module | Endpoint | Strategy | Files |
|--------|----------|----------|-------|
| **Brand** | `/upload/image` | Direct Upload | [create.vue](../app/pages/(admin)/catalogs/brands/create.vue#L65), [edit.vue](../app/pages/(admin)/catalogs/brands/[id]/edit.vue) |
| **Category** | `/upload/image` | Direct Upload | [create.vue](../app/pages/(admin)/catalogs/categories/create.vue#L85), [edit.vue](../app/pages/(admin)/catalogs/categories/[id]/edit.vue) |
| **Product** | `/upload/temp` + `/upload/move` | Temp → Move | [create.vue](../app/pages/(admin)/catalogs/products/create/index.vue), [edit.vue](../app/pages/(admin)/catalogs/products/[id]/edit.vue) |
| **Variant** | `/upload/temp` + `/upload/move` | Temp → Move | [ProductVariantsManager.vue](../app/pages/(admin)/catalogs/products/components/ProductVariantsManager.vue) |

---

## 1️⃣ Direct Upload - Brand & Category

### Endpoint
```
POST /api/upload/image
```

### Used By
- ✅ **Brand**: Logo upload
- ✅ **Category**: Image upload

### Implementation
**Direct `$fetch` call** (tidak pakai composable):

```typescript
// brands/create.vue & categories/create.vue
const handleFileUpload = async (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    // Validation
    if (!file.type.startsWith('image/')) {
        showError('Please upload an image file');
        return;
    }
    if (file.size > 2 * 1024 * 1024) {
        showError('Image size must be less than 2MB');
        return;
    }

    // Upload
    uploading.value = true;
    const formData = new FormData();
    formData.append('image', file);
    formData.append('type', 'brand'); // or 'category'

    const response = await $fetch('/upload/image', {
        baseURL: useRuntimeConfig().public.apiBase,
        method: 'POST',
        headers: {
            Authorization: `Bearer ${useAuthStore().token}`,
        },
        body: formData,
    });

    form.value.logo = response.data.url; // or form.value.image
    uploading.value = false;
};
```

### Request
```http
POST /api/upload/image
Authorization: Bearer {token}
Content-Type: multipart/form-data

Body (FormData):
{
  image: File,
  type: "brand" | "category"
}
```

### Response
```json
{
  "data": {
    "url": "https://storage.minimoda.id/brands/logo-123.jpg",
    "path": "brands/logo-123.jpg",
    "filename": "logo-123.jpg"
  }
}
```

### Validation
- **Allowed**: JPEG, JPG, PNG, GIF, WebP
- **Max size**: 2MB
- **Required**: `image`, `type`

### Why Direct Upload?
- ✅ Simple - hanya 1 gambar
- ✅ Langsung permanent - tidak perlu temp
- ✅ Save immediately - tidak ada cancel scenario
- ✅ Smaller bundle - tidak perlu composable

---

## 2️⃣ Temp Upload - Product & Variant

### Endpoint
```
POST /api/upload/temp
```

### Used By
- ✅ **Product**: Main product images/videos
- ✅ **Variant**: Variant-specific images
- ✅ **Bulk Variant Generator**: Multiple variant images

### Implementation
**Via composable**:

```typescript
import { useImageUpload } from '~/composables/useImageUpload';
const { uploadTempImages } = useImageUpload();

const handleUpload = async (event: Event) => {
    const files = Array.from((event.target as HTMLInputElement).files || []);

    const response = await uploadTempImages(
        files,
        { type: 'product', maxSizeMB: 2 },
        sessionId.value  // optional
    );

    sessionId.value = response.data.session_id;
    tempImages.value = response.data.images;
};
```

### Request
```http
POST /api/upload/temp
Authorization: Bearer {token}
Content-Type: multipart/form-data

Body (FormData):
{
  images[]: File[],
  type: "product",
  session_id?: "optional-session-id"
}
```

### Response
```json
{
  "status": true,
  "statusCode": "200",
  "message": "Files uploaded to temporary storage",
  "data": {
    "images": [
      {
        "url": "https://storage.minimoda.id/temp/abc-123/product-1.jpg",
        "path": "temp/abc-123/product-1.jpg",
        "filename": "product-1.jpg",
        "temp": true,
        "media_type": "image",
        "file_size": 524288
      },
      {
        "url": "https://storage.minimoda.id/temp/abc-123/video-1.mp4",
        "path": "temp/abc-123/video-1.mp4",
        "filename": "video-1.mp4",
        "temp": true,
        "media_type": "video",
        "thumbnail_url": "https://storage.minimoda.id/temp/abc-123/video-1-thumb.jpg",
        "duration": 30,
        "file_size": 10485760
      }
    ],
    "count": 2,
    "type": "product",
    "session_id": "abc-123",
    "note": "Files will be moved to permanent storage after product is saved"
  }
}
```

### Features
- ✅ Supports **images + videos**
- ✅ Auto-generates **session_id** for grouping
- ✅ Returns **thumbnail** for videos
- ✅ Returns **duration** for videos
- ✅ Returns **file_size**
- ✅ Auto-fixes URLs (uses `storageBase` instead of `apiBase`)

### Why Temp Upload?
- ✅ User can **preview** before save
- ✅ Prevents **orphaned files** if user cancels
- ✅ Better **UX** - can edit form after upload
- ✅ Auto **cleanup** temp files after 24h

---

## 3️⃣ Move to Permanent - Product & Variant

### Endpoint
```
POST /api/upload/move
```

### Used By
- ✅ **Product Create**: After product created
- ✅ **Product Edit**: After product updated
- ✅ **Variant Add**: After variant added
- ✅ **Variant Edit**: After variant updated
- ✅ **Bulk Variants**: After bulk variants created

### Implementation
**Via composable**:

```typescript
import { useImageUpload } from '~/composables/useImageUpload';
const { moveImages } = useImageUpload();

const saveProduct = async () => {
    // 1. Create/Update product first
    const product = await createProduct(formData);

    // 2. Move temp images to permanent
    if (tempImagePaths.value.length > 0) {
        await moveImages({
            temp_paths: tempImagePaths.value.map(img => img.path),
            type: 'product',
            product_id: product.id,
            metadata: tempImagePaths.value.map(img => ({
                media_type: img.media_type || 'image',
                duration: img.duration,
                file_size: img.file_size,
                thumbnail_url: img.thumbnail_url
            }))
        });
    }
};
```

### Request
```http
POST /api/upload/move
Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "temp_paths": [
    "temp/abc-123/product-1.jpg",
    "temp/abc-123/video-1.mp4"
  ],
  "type": "product",
  "product_id": 456,
  "metadata": [
    {
      "media_type": "image"
    },
    {
      "media_type": "video",
      "duration": 30,
      "file_size": 10485760,
      "thumbnail_url": "temp/abc-123/video-1-thumb.jpg"
    }
  ]
}
```

### Response
```json
{
  "status": true,
  "statusCode": "200",
  "message": "Images moved successfully",
  "data": {
    "images": [
      {
        "id": 789,
        "url": "https://storage.minimoda.id/products/456/product-1.jpg",
        "path": "products/456/product-1.jpg",
        "is_primary": true,
        "sort_order": 0
      },
      {
        "id": 790,
        "url": "https://storage.minimoda.id/products/456/video-1.mp4",
        "path": "products/456/video-1.mp4",
        "is_primary": false,
        "sort_order": 1
      }
    ],
    "count": 2,
    "type": "product",
    "product_id": 456
  }
}
```

### For Variants
Change `type` and add `variant_id`:

```json
{
  "temp_paths": [...],
  "type": "variant",
  "product_id": 456,
  "variant_id": 789,
  "metadata": [...]
}
```

---

## 📊 Complete Upload Flows

### Flow A: Brand/Category (Direct)
```
1. User selects image file
2. Frontend validates (type, size)
3. Upload to /api/upload/image
4. Get permanent URL
5. Set form.logo (or form.image)
6. User fills other fields
7. Submit form with logo URL
```

### Flow B: Product/Variant (Temp + Move)
```
1. User selects image/video files
2. Frontend validates (type, size)
3. Upload to /api/upload/temp
4. Get temp URLs & session_id
5. Show preview to user
6. User fills product form
7. User clicks Save
8. Create product in database
9. Move files via /api/upload/move
10. Get permanent URLs
11. Associate with product_id
```

---

## 🔧 Composable Usage

### useImageUpload.ts

**Exported Functions:**
```typescript
export const useImageUpload = () => {
    return {
        uploadTempImages,  // Upload to temp storage
        moveImages,        // Move temp to permanent
    };
};
```

**Import:**
```typescript
import { useImageUpload } from '~/composables/useImageUpload';
const { uploadTempImages, moveImages } = useImageUpload();
```

**Type:**
```typescript
export type ImageUploadType = "product";  // Only "product" supported

export interface UploadImageOptions {
    type: ImageUploadType;
    maxSizeMB?: number;
    allowedTypes?: string[];
}
```

---

## 🗑️ Removed/Unused

### Deleted Functions
- ❌ `uploadImage()` - Not used (Brand/Category use direct $fetch)
- ❌ `handleFileUpload()` - Not used
- ❌ `uploadBulkImages()` - Not used
- ❌ `handleBulkFileUpload()` - Not used

### Deleted Endpoints
- ❌ `POST /api/upload/image/bulk` - Not implemented/used
- ❌ `POST /api/upload/media` - Not implemented/used

### Deleted Composable
- ❌ `useMediaUpload.ts` - Completely unused

### Why Remove?
- ✅ **Reduce bundle size** - Remove ~150 lines unused code
- ✅ **Simpler codebase** - Less confusion
- ✅ **Clear patterns** - Only 2 upload patterns
- ✅ **Easier maintenance** - Less code to maintain

---

## 📝 Backend Requirements

### Storage Structure
```
storage/
├── brands/               # Brand logos (permanent)
│   └── brand-logo-123.jpg
├── categories/           # Category images (permanent)
│   └── category-img-456.jpg
├── products/{id}/        # Product images/videos (permanent)
│   ├── image-1.jpg
│   ├── image-2.jpg
│   └── video-1.mp4
├── variants/{id}/        # Variant images (permanent)
│   └── variant-img-1.jpg
└── temp/{session_id}/    # Temporary uploads (auto-clean after 24h)
    ├── product-1.jpg
    └── video-1.mp4
```

### Required Endpoints

#### 1. POST /api/upload/image
```
Body: FormData { image, type }
Response: { data: { url, path, filename } }
```

#### 2. POST /api/upload/temp
```
Body: FormData { images[], type, session_id? }
Response: { data: { images, count, session_id, ... } }
```

#### 3. POST /api/upload/move
```
Body: JSON { temp_paths, type, product_id?, variant_id?, metadata? }
Response: { data: { images, count, product_id, ... } }
```

### Database Tables

```sql
-- product_images
CREATE TABLE product_images (
    id BIGINT PRIMARY KEY,
    product_id BIGINT,
    url VARCHAR(255),
    path VARCHAR(255),
    is_primary BOOLEAN DEFAULT false,
    sort_order INT DEFAULT 0,
    media_type ENUM('image', 'video'),
    thumbnail_url VARCHAR(255),
    duration INT,
    file_size BIGINT,
    created_at TIMESTAMP
);

-- variant_images
CREATE TABLE variant_images (
    id BIGINT PRIMARY KEY,
    variant_id BIGINT,
    url VARCHAR(255),
    path VARCHAR(255),
    is_primary BOOLEAN DEFAULT false,
    sort_order INT DEFAULT 0,
    media_type ENUM('image', 'video'),
    thumbnail_url VARCHAR(255),
    duration INT,
    file_size BIGINT,
    created_at TIMESTAMP
);
```

---

## ✅ Summary

### Active Endpoints: 3
1. ✅ `/upload/image` - Brand & Category direct upload
2. ✅ `/upload/temp` - Product & Variant temp upload
3. ✅ `/upload/move` - Product & Variant move to permanent

### Inactive Endpoints: 2
1. ❌ `/upload/image/bulk` - Never implemented
2. ❌ `/upload/media` - Never implemented

### Composables: 1
1. ✅ `useImageUpload.ts` - Only exports `uploadTempImages` & `moveImages`
2. ❌ `useMediaUpload.ts` - Deleted (unused)

### Code Cleanup Results:
- 🗑️ Removed **~200 lines** of unused code
- 📦 Smaller **bundle size**
- 🎯 Clearer **patterns**
- ⚡ **Easier** to maintain

---

**Last Updated**: 2025-01-29
**Status**: ✅ Production Ready
