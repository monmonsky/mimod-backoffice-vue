# Utility Functions

Utility functions yang tersedia secara global di seluruh aplikasi. Semua functions ini auto-imported oleh Nuxt 3, jadi bisa langsung digunakan tanpa import.

## 📝 Formatters

Functions untuk formatting data.

### `formatPrice(value, includeSymbol?)`
Format angka ke format Rupiah.
```typescript
formatPrice(1000000)           // "Rp 1.000.000"
formatPrice(1000000, false)    // "1.000.000"
formatPrice("2500000")         // "Rp 2.500.000"
```

### `formatDate(date, format?)`
Format tanggal ke format Indonesia.
```typescript
formatDate('2024-10-09')                    // "09 Okt 2024"
formatDate('2024-10-09', 'long')            // "9 Oktober 2024"
formatDate('2024-10-09 10:30', 'datetime')  // "09 Okt 2024, 10:30"
formatDate('2024-10-09 10:30', 'time')      // "10:30"
```

### `formatRelativeTime(date)`
Format waktu relatif (berapa lama yang lalu).
```typescript
formatRelativeTime('2024-10-09 10:00')  // "2 jam yang lalu"
formatRelativeTime('2024-10-08')        // "1 hari yang lalu"
```

### `formatFileSize(bytes)`
Format ukuran file ke format human-readable.
```typescript
formatFileSize(1024)      // "1 KB"
formatFileSize(1048576)   // "1 MB"
formatFileSize(0)         // "0 Bytes"
```

### `formatNumber(value)`
Format angka dengan thousand separator.
```typescript
formatNumber(1000000)    // "1.000.000"
formatNumber("5000")     // "5.000"
```

### `formatPercentage(value, decimals?)`
Format ke persentase.
```typescript
formatPercentage(0.75)        // "75%"
formatPercentage(0.7543, 2)   // "75,43%"
```

### `truncateText(text, maxLength?)`
Potong teks dengan ellipsis.
```typescript
truncateText('Lorem ipsum dolor sit amet', 10)  // "Lorem ipsu..."
```

### `formatPhone(phone)`
Format nomor telepon Indonesia.
```typescript
formatPhone('081234567890')  // "0812-3456-7890"
```

---

## 🔤 String Utilities

Functions untuk manipulasi string.

### `generateSlug(text)`
Generate URL-friendly slug dari text.
```typescript
generateSlug('Hello World!')          // "hello-world"
generateSlug('Laptop Gaming 2024')    // "laptop-gaming-2024"
generateSlug('Product - Electronics') // "product-electronics"
```

### `capitalize(text)`
Capitalize setiap kata.
```typescript
capitalize('hello world')  // "Hello World"
```

### `capitalizeFirst(text)`
Capitalize huruf pertama saja.
```typescript
capitalizeFirst('hello world')  // "Hello world"
```

### `toTitleCase(text)`
Convert ke title case.
```typescript
toTitleCase('hello-world')      // "Hello World"
toTitleCase('my_product_name')  // "My Product Name"
```

### `randomString(length?)`
Generate random string.
```typescript
randomString()     // "a8f3k9x2" (8 karakter)
randomString(6)    // "p4j2k9"
```

### `getInitials(name)`
Extract initial dari nama.
```typescript
getInitials('John Doe')        // "JD"
getInitials('Muhammad Ali')    // "MA"
getInitials('SingleName')      // "S"
```

### `camelToKebab(text)`
Convert camelCase ke kebab-case.
```typescript
camelToKebab('helloWorld')     // "hello-world"
camelToKebab('myProductName')  // "my-product-name"
```

### `kebabToCamel(text)`
Convert kebab-case ke camelCase.
```typescript
kebabToCamel('hello-world')      // "helloWorld"
kebabToCamel('my-product-name')  // "myProductName"
```

### `maskEmail(email)`
Mask email address.
```typescript
maskEmail('john@example.com')  // "j***@example.com"
```

### `maskPhone(phone)`
Mask nomor telepon.
```typescript
maskPhone('081234567890')  // "0812****7890"
```

---

## ✅ Validators

Functions untuk validasi data.

### `isValidEmail(email)`
Validasi format email.
```typescript
isValidEmail('user@example.com')  // true
isValidEmail('invalid-email')     // false
```

### `isValidPhone(phone)`
Validasi nomor telepon Indonesia.
```typescript
isValidPhone('081234567890')  // true
isValidPhone('0812345')       // false
```

### `isValidUrl(url)`
Validasi format URL.
```typescript
isValidUrl('https://example.com')  // true
isValidUrl('not-a-url')            // false
```

### `validatePassword(password, minLength?)`
Validasi kekuatan password.
```typescript
validatePassword('Pass123!')
// { isValid: true, message: "Password is strong" }

validatePassword('weak')
// { isValid: false, message: "Password must be at least 8 characters" }
```

### `isValidNIK(nik)`
Validasi NIK (16 digit).
```typescript
isValidNIK('1234567890123456')  // true
isValidNIK('12345')             // false
```

### `isValidPostalCode(postalCode)`
Validasi kode pos Indonesia (5 digit).
```typescript
isValidPostalCode('12345')  // true
isValidPostalCode('123')    // false
```

### `isEmpty(value)`
Check apakah value kosong.
```typescript
isEmpty(null)        // true
isEmpty('')          // true
isEmpty([])          // true
isEmpty({})          // true
isEmpty('hello')     // false
```

### `isValidFileType(file, allowedTypes)`
Validasi tipe file.
```typescript
isValidFileType(file, ['image/png', 'image/jpeg'])  // true/false
```

### `isValidFileSize(file, maxSizeMB)`
Validasi ukuran file.
```typescript
isValidFileSize(file, 2)  // true jika file <= 2MB
```

---

## 🛠️ Helpers

Utility functions umum lainnya.

### `debounce(func, wait)`
Debounce function execution.
```typescript
const search = debounce((query) => {
  console.log('Searching:', query);
}, 500);

search('hello');  // Hanya execute setelah 500ms idle
```

### `throttle(func, limit)`
Throttle function execution.
```typescript
const handleScroll = throttle(() => {
  console.log('Scrolling');
}, 1000);

window.addEventListener('scroll', handleScroll);
```

### `deepClone(obj)`
Deep clone object.
```typescript
const original = { a: 1, b: { c: 2 } };
const cloned = deepClone(original);
```

### `getNestedValue(obj, path, defaultValue?)`
Get nested property value.
```typescript
const user = { profile: { address: { city: 'Jakarta' } } };
getNestedValue(user, 'profile.address.city')  // "Jakarta"
getNestedValue(user, 'profile.phone', 'N/A')  // "N/A"
```

### `groupBy(array, key)`
Group array by property.
```typescript
const products = [
  { category: 'Electronics', name: 'Laptop' },
  { category: 'Electronics', name: 'Phone' },
  { category: 'Clothing', name: 'Shirt' }
];

groupBy(products, 'category')
// {
//   Electronics: [{ category: 'Electronics', name: 'Laptop' }, ...],
//   Clothing: [{ category: 'Clothing', name: 'Shirt' }]
// }
```

### `unique(array, key?)`
Remove duplicates dari array.
```typescript
unique([1, 2, 2, 3, 3])  // [1, 2, 3]

const users = [
  { id: 1, name: 'John' },
  { id: 2, name: 'Jane' },
  { id: 1, name: 'John' }
];
unique(users, 'id')  // [{ id: 1, ... }, { id: 2, ... }]
```

### `sortBy(array, key, order?)`
Sort array by property.
```typescript
const products = [
  { name: 'B Product', price: 200 },
  { name: 'A Product', price: 100 }
];

sortBy(products, 'name', 'asc')   // Sorted by name A-Z
sortBy(products, 'price', 'desc') // Sorted by price high-low
```

### `sleep(ms)`
Delay/sleep execution.
```typescript
await sleep(1000);  // Wait 1 second
console.log('After 1 second');
```

### `randomNumber(min, max)`
Generate random number.
```typescript
randomNumber(1, 10)    // Random number between 1-10
randomNumber(100, 200) // Random number between 100-200
```

### `chunk(array, size)`
Split array into chunks.
```typescript
chunk([1, 2, 3, 4, 5], 2)  // [[1, 2], [3, 4], [5]]
```

### `copyToClipboard(text)`
Copy text ke clipboard.
```typescript
await copyToClipboard('Hello World');
// Returns true if successful
```

### `downloadFile(data, filename, type?)`
Download file.
```typescript
downloadFile('File content', 'document.txt');
downloadFile(blob, 'image.png', 'image/png');
```

### `parseQueryString(queryString)`
Parse query string ke object.
```typescript
parseQueryString('?name=John&age=25')
// { name: 'John', age: '25' }
```

### `buildQueryString(params)`
Build query string dari object.
```typescript
buildQueryString({ name: 'John', age: 25 })
// "name=John&age=25"
```

---

## 💡 Usage Examples

### Di Vue Components
```vue
<script setup lang="ts">
const price = ref(1000000);
const formattedPrice = computed(() => formatPrice(price.value));

const handleSearch = debounce((query: string) => {
  // Search logic
}, 500);
</script>

<template>
  <div>
    <p>Price: {{ formatPrice(price) }}</p>
    <p>Date: {{ formatDate(new Date()) }}</p>
  </div>
</template>
```

### Di Template Langsung
```vue
<template>
  <div>
    <h1>{{ capitalize(product.name) }}</h1>
    <p>{{ formatPrice(product.price) }}</p>
    <small>{{ formatRelativeTime(product.created_at) }}</small>
  </div>
</template>
```

### Di Composables
```typescript
export const useProduct = () => {
  const formatProductPrice = (price: number) => {
    return formatPrice(price);
  };

  const validateProductData = (data: any) => {
    if (isEmpty(data.name)) return false;
    if (!isValidUrl(data.image)) return false;
    return true;
  };

  return {
    formatProductPrice,
    validateProductData,
  };
};
```

---

## 📚 Notes

- Semua functions ini **auto-imported** oleh Nuxt 3
- Tidak perlu import manual, langsung bisa digunakan
- Tersedia di components, composables, pages, dan layouts
- Type-safe dengan TypeScript
- Format Indonesia (Rupiah, tanggal, dsb)
