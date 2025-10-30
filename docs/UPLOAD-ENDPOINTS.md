# Upload Endpoints Documentation

## Overview

Aplikasi menggunakan beberapa endpoint upload untuk handle berbagai tipe media. Berikut dokumentasi lengkap semua endpoint upload yang digunakan.

---

## 📋 List of Upload Endpoints

| Endpoint | Method | Purpose | Used In |
|----------|--------|---------|---------|
| `/upload/image` | POST | Upload single image | Brands, Categories (single image) |
| `/upload/image/bulk` | POST | Upload multiple images | Not currently used |
| `/upload/temp` | POST | Upload to temporary storage | Products (create/edit) |
| `/upload/move` | POST | Move from temp to permanent | Products (after save) |
| `/upload/media` | POST | Upload image or video | Not currently implemented |

---

## 1. Single Image Upload

### Endpoint
```
POST /api/upload/image
```

### Used In
- **Brands**: Upload brand logo
- **Categories**: Upload category image
- **General**: Single image uploads

### Composable
```typescript
import { useImageUpload } from '~/composables/useImageUpload';
const { uploadImage, handleFileUpload } = useImageUpload();
```

### Request
```typescript
// Headers
Authorization: Bearer {token}
Content-Type: multipart/form-data

// Body (FormData)
{
  image: File,          // Required - Image file
  type: string          // Required - "brand" | "category" | "product" | "avatar" | "banner" | "thumbnail"
}
```

### Request Example
```typescript
const formData = new FormData();
formData.append('image', file);
formData.append('type', 'brand');

const response = await $fetch('/upload/image', {
  method: 'POST',
  body: formData,
});
```

### Response
```typescript
{
  data: {
    url: string,        // Full URL to uploaded image
    path?: string,      // Relative path
    filename?: string   // Original filename
  }
}
```

### Response Example
```json
{
  "data": {
    "url": "https://storage.minimoda.id/brands/brand-logo-123.jpg",
    "path": "brands/brand-logo-123.jpg",
    "filename": "brand-logo-123.jpg"
  }
}
```

### Validation
- **Allowed types**: `image/jpeg`, `image/jpg`, `image/png`, `image/gif`, `image/webp`
- **Max size**: 2MB (configurable)
- **Required fields**: `image`, `type`

### Usage Example
```vue
<script setup lang="ts">
const { uploadImage } = useImageUpload();

const handleUpload = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;

  try {
    const url = await uploadImage(file, {
      type: 'brand',
      maxSizeMB: 2
    });
    console.log('Uploaded:', url);
  } catch (error) {
    console.error('Upload failed:', error);
  }
};
</script>

<template>
  <input type="file" @change="handleUpload" accept="image/*" />
</template>
```

---

## 2. Bulk Image Upload

### Endpoint
```
POST /api/upload/image/bulk
```

### Used In
- Currently **not actively used** in the application
- Available for future bulk upload features

### Composable
```typescript
import { useImageUpload } from '~/composables/useImageUpload';
const { uploadBulkImages, handleBulkFileUpload } = useImageUpload();
```

### Request
```typescript
// Headers
Authorization: Bearer {token}
Content-Type: multipart/form-data

// Body (FormData)
{
  images[]: File[],     // Required - Array of image files
  type: string          // Required - Upload type
}
```

### Response
```typescript
{
  data: {
    images: Array<{
      url: string,
      path?: string,
      filename?: string
    }>
  }
}
```

### Validation
- Same as single image upload
- Each file validated individually
- All files must pass validation before upload

---

## 3. Temporary Upload (Temp Storage)

### Endpoint
```
POST /api/upload/temp
```

### Used In
- **Products**: Create product page
- **Products**: Edit product page
- **Variants**: Add/Edit product variants

### Purpose
Upload images/videos to temporary storage before product is saved. After product save, files are moved to permanent storage.

### Composable
```typescript
import { useImageUpload } from '~/composables/useImageUpload';
const { uploadTempImages } = useImageUpload();
```

### Request
```typescript
// Headers
Authorization: Bearer {token}
Content-Type: multipart/form-data

// Body (FormData)
{
  images[]: File[],       // Required - Array of files (images/videos)
  type: string,           // Required - "product"
  session_id?: string     // Optional - Session ID to group uploads
}
```

### Request Example
```typescript
const formData = new FormData();
files.forEach(file => formData.append('images[]', file));
formData.append('type', 'product');
formData.append('session_id', 'abc-123-def');

const response = await $fetch('/upload/temp', {
  method: 'POST',
  body: formData,
});
```

### Response
```typescript
{
  status: boolean,
  statusCode: string,
  message: string,
  data: {
    images: Array<{
      url: string,              // Full URL to temp image
      path: string,             // Temp path (e.g., "temp/abc-123/image.jpg")
      filename: string,         // Original filename
      temp: boolean,            // Always true
      media_type?: string,      // "image" | "video"
      thumbnail_url?: string,   // For videos
      duration?: number,        // Video duration in seconds
      file_size?: number        // File size in bytes
    }>,
    count: number,              // Number of uploaded files
    type: string,               // Upload type
    session_id: string,         // Session ID
    note: string                // Info message
  }
}
```

### Response Example
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

### Validation
- **Allowed types**: All image types + videos
- **Max size**: Configurable (default 2MB for images)
- **Session ID**: Auto-generated if not provided

### Usage Example
```vue
<script setup lang="ts">
const { uploadTempImages } = useImageUpload();
const sessionId = ref('');
const tempImages = ref([]);

const handleUpload = async (event: Event) => {
  const files = Array.from((event.target as HTMLInputElement).files || []);

  try {
    const response = await uploadTempImages(files,
      { type: 'product' },
      sessionId.value
    );

    sessionId.value = response.data.session_id;
    tempImages.value = response.data.images;
    console.log('Uploaded to temp:', response.data.images);
  } catch (error) {
    console.error('Upload failed:', error);
  }
};
</script>

<template>
  <input type="file" multiple @change="handleUpload" accept="image/*,video/*" />
</template>
```

---

## 4. Move Images (Temp to Permanent)

### Endpoint
```
POST /api/upload/move
```

### Used In
- **Products**: After creating new product
- **Products**: After updating product
- **Variants**: After adding/updating variants

### Purpose
Move files from temporary storage to permanent storage and associate with product/variant.

### Composable
```typescript
import { useImageUpload } from '~/composables/useImageUpload';
const { moveImages } = useImageUpload();
```

### Request
```typescript
// Headers
Authorization: Bearer {token}
Content-Type: application/json

// Body
{
  temp_paths: string[],       // Required - Array of temp paths
  type: string,               // Required - "product" | "variant"
  product_id?: number,        // Required if type="product"
  variant_id?: number,        // Required if type="variant"
  metadata?: Array<{          // Optional - Additional metadata
    media_type: string,       // "image" | "video"
    duration?: number,        // Video duration
    file_size?: number,       // File size
    thumbnail_url?: string    // Video thumbnail URL
  }>
}
```

### Request Example
```typescript
const request = {
  temp_paths: [
    'temp/abc-123/product-1.jpg',
    'temp/abc-123/product-2.jpg',
    'temp/abc-123/video-1.mp4'
  ],
  type: 'product',
  product_id: 456,
  metadata: [
    { media_type: 'image' },
    { media_type: 'image' },
    {
      media_type: 'video',
      duration: 30,
      file_size: 10485760,
      thumbnail_url: 'temp/abc-123/video-1-thumb.jpg'
    }
  ]
};

const response = await $fetch('/upload/move', {
  method: 'POST',
  body: request,
});
```

### Response
```typescript
{
  status?: boolean,
  statusCode?: string,
  message?: string,
  data?: {
    images: Array<{
      id: number,             // Database ID
      url: string,            // Permanent URL
      path: string,           // Permanent path
      is_primary: boolean,    // Is primary image
      sort_order: number      // Display order
    }>,
    count: number,            // Number of moved images
    type: string,             // "product" | "variant"
    product_id?: number,
    variant_id?: number
  }
}
```

### Response Example
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
        "url": "https://storage.minimoda.id/products/456/product-2.jpg",
        "path": "products/456/product-2.jpg",
        "is_primary": false,
        "sort_order": 1
      },
      {
        "id": 791,
        "url": "https://storage.minimoda.id/products/456/video-1.mp4",
        "path": "products/456/video-1.mp4",
        "is_primary": false,
        "sort_order": 2
      }
    ],
    "count": 3,
    "type": "product",
    "product_id": 456
  }
}
```

### Usage Example
```vue
<script setup lang="ts">
const { moveImages } = useImageUpload();

const saveProduct = async () => {
  // 1. Create product first
  const product = await createProduct(formData);

  // 2. Move temp images to permanent
  if (tempImagePaths.value.length > 0) {
    try {
      const response = await moveImages({
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

      console.log('Images moved:', response.data.images);
    } catch (error) {
      console.error('Failed to move images:', error);
    }
  }
};
</script>
```

---

## 5. Media Upload (Images + Videos)

### Endpoint
```
POST /api/upload/media
```

### Used In
- Currently **not actively used**
- Available for direct media upload without temp storage

### Composable
```typescript
import { useMediaUpload } from '~/composables/useMediaUpload';
const { uploadMedia, handleMediaUpload } = useMediaUpload();
```

### Request
```typescript
// Headers
Authorization: Bearer {token}
Content-Type: multipart/form-data

// Body (FormData)
{
  file: File,               // Required - Media file (image or video)
  type: string,             // Required - "product" | "brand" | "category" | "banner"
  media_type: string,       // Required - "image" | "video"
  thumbnail?: File          // Optional - Video thumbnail
}
```

### Response
```typescript
{
  status: boolean,
  statusCode: string,
  message: string,
  data: {
    url: string,
    path: string,
    filename: string,
    type: string,
    media_type: "image" | "video",
    file_size: number,
    mime_type: string,
    thumbnail_url?: string,
    duration?: number
  }
}
```

### Validation
- **Images**: `image/jpeg`, `image/jpg`, `image/png`, `image/gif`, `image/webp`
- **Videos**: `video/mp4`, `video/quicktime`, `video/x-msvideo`, `video/x-matroska`
- **Max size**: 50MB (configurable)
- **Video duration**: Max 5 minutes (300 seconds)

---

## 📊 Upload Flow Comparison

### Simple Upload (Brand/Category)
```
User selects file
    ↓
Upload to /upload/image
    ↓
Get permanent URL
    ↓
Save to database
```

### Product Upload (Temp + Move)
```
User selects files
    ↓
Upload to /upload/temp
    ↓
Get temp URLs (show preview)
    ↓
User fills product form
    ↓
User clicks Save
    ↓
Create product in database
    ↓
Move files via /upload/move
    ↓
Get permanent URLs
    ↓
Associate with product
```

---

## 🔧 Configuration

### Environment Variables
```env
# API Base URL
NUXT_PUBLIC_API_BASE=http://api-local.minimoda.id/api

# Storage Base URL (for serving uploaded files)
NUXT_PUBLIC_STORAGE_BASE=https://storage.minimoda.id
```

### Runtime Config
```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE,
      storageBase: process.env.NUXT_PUBLIC_STORAGE_BASE,
    }
  }
})
```

---

## 🎯 Best Practices

### 1. Use Temp Upload for Products
Always use temp upload + move for products to avoid orphaned files if user cancels.

### 2. Session ID
Use consistent session_id to group related temp uploads:
```typescript
const sessionId = ref(`product-${Date.now()}`);
```

### 3. Error Handling
Always handle upload errors gracefully:
```typescript
try {
  const response = await uploadTempImages(files, { type: 'product' });
  // Success
} catch (error) {
  console.error('Upload failed:', error.message);
  showError(error.message);
}
```

### 4. Clean Up
Backend should auto-clean temp files older than 24 hours.

### 5. Validation
Validate files on frontend before upload to save bandwidth:
```typescript
if (file.size > 2 * 1024 * 1024) {
  throw new Error('File too large');
}
```

---

## 🐛 Common Issues

### Issue 1: URL shows API base instead of Storage base
**Problem**: Images show `http://api.../temp/...` instead of storage URL

**Solution**: Frontend automatically fixes URLs in `uploadTempImages()`:
```typescript
const storageBase = config.public.storageBase || config.public.apiBase.replace('/api', '');
response.data.images = response.data.images.map(img => ({
  ...img,
  url: `${storageBase}/${img.path}`
}));
```

### Issue 2: Move fails after product create
**Problem**: Images not moved to permanent storage

**Debug**:
1. Check temp_paths are correct
2. Verify product_id is valid
3. Check backend logs for errors
4. Ensure temp files still exist (not expired)

### Issue 3: Video upload fails
**Problem**: Video file rejected or upload timeout

**Solutions**:
- Check max size limit (default 50MB)
- Check video duration (max 5 minutes)
- Increase timeout for large files
- Use temp upload instead of direct upload

---

## 📝 Backend Requirements

Backend API harus implement semua endpoint di atas dengan spesifikasi:

### 1. File Storage
- Store permanent files: `storage/products/{id}/`
- Store temp files: `storage/temp/{session_id}/`
- Auto-clean temp files > 24 hours

### 2. Database Schema
```sql
-- product_images table
id, product_id, url, path, is_primary, sort_order,
media_type, thumbnail_url, duration, file_size, created_at

-- variant_images table
id, variant_id, url, path, is_primary, sort_order,
media_type, thumbnail_url, duration, file_size, created_at
```

### 3. Response Format
Always use consistent response format:
```json
{
  "status": true,
  "statusCode": "200",
  "message": "Success message",
  "data": { ... }
}
```

---

## 🚀 Future Improvements

1. **Image Optimization**: Auto-resize/compress images
2. **CDN Integration**: Upload to CDN instead of local storage
3. **Progress Tracking**: Show upload progress for large files
4. **Batch Operations**: Delete multiple images at once
5. **Image Editing**: Crop, rotate, filters before upload

---

**Last Updated**: 2025-01-29
**Frontend Status**: ✅ Implemented
**Backend Status**: Check with backend team
