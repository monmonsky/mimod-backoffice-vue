# Auto Logout on Session Expiry

Implementasi otomatis logout ketika session/token habis atau invalid.

## Arsitektur

Sistem menggunakan **3 layer protection** untuk memastikan user selalu logout ketika session tidak valid:

### 1. **API Interceptor** (Primary Protection) ✅
**File**: `app/plugins/api-interceptor.ts`

- Menangkap semua response API dengan status 401 (Unauthorized)
- Otomatis logout user dan redirect ke login
- Bekerja untuk semua API calls (`$fetch`, `useAsyncData`, `useFetch`)

**Cara Kerja**:
```typescript
// Intercept global $fetch
if (statusCode === 401) {
    authStore.logout(); // Auto logout
}
```

### 2. **Middleware Check** (Secondary Protection) ✅
**File**: `app/middleware/auth.ts`

- Check token expiry setiap kali navigasi halaman
- Logout user jika token sudah expired (berdasarkan timestamp)
- Fast check (no network request)

**Cara Kerja**:
```typescript
// Check di setiap navigasi
const isValid = authStore.checkAuth();
if (!isValid) {
    return navigateTo("/auth/login");
}
```

### 3. **Auth Store Validation** ✅
**File**: `app/stores/auth.ts`

- Menyimpan token expiry timestamp di cookie
- Method `checkAuth()` untuk validasi
- Method `isTokenExpired` computed property

**Properties**:
- `token` - Bearer token
- `user` - User data
- `tokenExpiry` - Expiry timestamp (milliseconds)
- `isTokenExpired` - Computed: apakah token sudah expired
- `checkAuth()` - Method untuk validasi full authentication

## Flow Diagram

```
User Login
    ↓
Store token + expiry time
    ↓
User navigate page ──→ Middleware check expiry ──→ Expired? ──→ Logout
    ↓                                                    ↓
    No                                                  Yes
    ↓                                                    ↓
Load page                                          Redirect to login
    ↓
User hit API ──→ API returns 401? ──→ Interceptor catches ──→ Logout
    ↓                                                              ↓
   No                                                    Redirect to login
    ↓
Continue
```

## Files Modified

### 1. `app/stores/auth.ts`
**Added**:
- `tokenExpiry` cookie untuk simpan expiry timestamp
- `isTokenExpired` computed property
- `setToken()` sekarang accept `expiresIn` parameter (seconds)
- `setTokenExpiry()` method untuk manual set expiry
- `checkAuth()` method untuk validasi authentication + expiry

### 2. `app/middleware/auth.ts`
**Updated**:
- Sekarang call `authStore.checkAuth()` instead of hanya check `isAuthenticated`
- Auto logout jika token expired

### 3. `app/plugins/api-interceptor.ts`
**Already Exists** ✅:
- Sudah handle 401 dengan baik
- Support TOKEN_INVALID, TOKEN_EXPIRED, dan Unauthorized

### 4. `app/pages/auth/login/index.vue`
**Updated**:
- Pass `expiresIn` ke `authStore.setToken()`
- Ambil dari `data.expires_in` atau `data.token_expires_in` dari backend

## Backend Requirements

Backend harus return token expiry di response login:

```json
{
  "status": true,
  "data": {
    "token": "...",
    "user": {...},
    "expires_in": 3600  // In seconds (1 hour = 3600 seconds)
  }
}
```

**Note**:
- Backend session expired: **1 hour (3600 seconds)**
- Jika backend tidak return `expires_in`, default expiry adalah **1 jam** dari login.

## Testing

### Test 1: Token Expired via Timestamp
1. Login ke aplikasi
2. Buka DevTools > Application > Cookies
3. Edit `auth_token_expiry` ke timestamp yang sudah lewat (e.g., `1609459200000`)
4. Navigate ke halaman lain
5. **Expected**: Auto logout dan redirect ke login

### Test 2: API Returns 401
1. Login ke aplikasi
2. Buka DevTools > Network
3. Manually revoke token di backend (atau tunggu token expired)
4. Click action yang hit API (e.g., refresh table)
5. **Expected**: API returns 401, auto logout, redirect ke login

### Test 3: Normal Flow
1. Login dengan credentials valid
2. Navigate multiple pages
3. Perform actions (CRUD operations)
4. **Expected**: Tidak ada logout, semua berjalan normal

## Cookies Created

1. `auth_token` - Bearer token string
2. `auth_user` - User object (JSON)
3. `auth_token_expiry` - Expiry timestamp (number, milliseconds)

**Max Age**: 7 days (tapi expiry diatur berdasarkan backend response)

## Error Handling

- **401 Unauthorized**: Auto logout via interceptor
- **TOKEN_INVALID**: Auto logout via interceptor
- **TOKEN_EXPIRED**: Auto logout via interceptor
- **Token expired (timestamp)**: Auto logout via middleware
- **Logout API failed**: Still clear local state dan redirect

## Security Notes

1. ✅ **Double validation**: Client-side (timestamp) + Server-side (API 401)
2. ✅ **No silent failures**: Semua error 401 di-handle
3. ✅ **Toast notification**: User diberi notif "Session expired"
4. ✅ **Clean state**: Semua cookies di-clear saat logout
5. ✅ **Redirect preservation**: URL redirect saved di query parameter

## Future Improvements

- [ ] Refresh token implementation (auto-renew token sebelum expired)
- [ ] Warning notification 5 menit sebelum token expired
- [ ] Activity-based session extension (reset expiry on user action)
- [ ] Remember me functionality (extended expiry)
