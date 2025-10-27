# AI SEO Generator - Testing Examples

## Format Response Minimoda

Semua response mengikuti format Minimoda:

**SEO Title Format:**
```
{Product Name} - {Brand} | Minimoda
```

**Meta Description Format (Bahasa Indonesia):**
```
Beli {Product Name} dari {Brand}. {Description singkat} Belanja sekarang di Minimoda!
```

**Keywords Format:**
```
{Product Name}, {Brand}, {Categories}, pakaian anak, fashion anak, baju anak berkualitas
```

**Response Format:**
- `statusCode` adalah **string**, bukan number: `"200"`, `"400"`, `"500"`
- Message bisa menunjukkan source: "using AI" atau "using template"

---

## Test Cases

### Test Case 1: Complete Product Data

**Request:**
```json
{
  "name": "LEGO Classic Creative Building Set",
  "description": "A creative building set with 1000 colorful bricks for endless imagination. Perfect for developing motor skills, creativity, and problem-solving abilities. Includes instruction booklet with 20+ building ideas.",
  "brand_name": "LEGO",
  "categories": ["Building Toys", "Educational Toys"],
  "tags": ["creative", "educational", "construction", "stem"],
  "age_min": 5,
  "age_max": 10
}
```

**Expected Response:**
```json
{
  "status": true,
  "statusCode": "200",
  "message": "SEO generated successfully (using AI)",
  "data": {
    "title": "LEGO Classic Creative Building Set - LEGO | Minimoda",
    "description": "Beli LEGO Classic Creative Building Set dari LEGO. Set 1000 brick kreatif untuk mengembangkan motorik & kreativitas anak. Belanja sekarang di Minimoda!",
    "keywords": "LEGO Classic Creative Building Set, LEGO, Building Toys, Educational Toys, mainan edukasi, pakaian anak, fashion anak, baju anak berkualitas"
  }
}
```

---

### Test Case 2: Minimal Product Data (Example dari user)

**Request:**
```json
{
  "name": "Premium Cotton T-Shirt",
  "description": "High quality cotton t-shirt",
  "brand_name": "Fashion Brand",
  "categories": ["Clothing"]
}
```

**Expected Response:**
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

### Test Case 3: Product with Multiple Categories

**Request:**
```json
{
  "name": "STEM Robot Building Kit",
  "description": "Advanced robotics kit with 500+ parts, motors, sensors, and programmable controller. Build and code your own robots. Compatible with LEGO.",
  "brand_name": "Makeblock",
  "categories": ["Robotics", "STEM Toys", "Educational Toys", "Building Toys"],
  "tags": ["robotics", "coding", "stem", "programming", "engineering"],
  "age_min": 8,
  "age_max": 14
}
```

**Expected Response:**
```json
{
  "status": true,
  "statusCode": 200,
  "message": "SEO generated successfully",
  "data": {
    "title": "Makeblock STEM Robot Kit - Build & Code 500+ Parts Ages 8-14",
    "description": "Advanced Makeblock robotics kit with 500+ parts, motors & sensors. Build and program your own robots with this educational STEM toy. LEGO compatible. Perfect for ages 8-14.",
    "keywords": "robot building kit, stem robotics, programmable robot, coding toys, makeblock robot, educational robotics, engineering toys, stem toys ages 8-14"
  }
}
```

---

### Test Case 4: Toy with Specific Age Range

**Request:**
```json
{
  "name": "Baby Soft Blocks",
  "description": "Set of 12 soft fabric blocks with different colors, textures, and sounds. Safe for babies and toddlers. Machine washable.",
  "brand_name": "Fisher-Price",
  "categories": ["Baby Toys", "Soft Toys"],
  "tags": ["baby", "soft", "sensory", "washable"],
  "age_min": 0,
  "age_max": 2
}
```

**Expected Response:**
```json
{
  "status": true,
  "statusCode": 200,
  "message": "SEO generated successfully",
  "data": {
    "title": "Fisher-Price Baby Soft Blocks - 12pc Sensory Toy Ages 0-2",
    "description": "Safe, soft fabric blocks by Fisher-Price. 12 colorful blocks with textures & sounds for sensory development. Machine washable baby toy perfect for ages 0-2 years.",
    "keywords": "baby soft blocks, fisher-price toys, sensory toys for babies, fabric blocks, infant toys, toddler blocks, washable baby toys, baby development toys"
  }
}
```

---

### Test Case 5: Board Game

**Request:**
```json
{
  "name": "Monopoly Junior",
  "description": "The classic Monopoly game designed for younger players. Simplified rules, colorful board, and fun tokens. Learn about money and strategy.",
  "brand_name": "Hasbro",
  "categories": ["Board Games", "Family Games", "Educational Games"],
  "tags": ["board game", "strategy", "family fun", "money skills"],
  "age_min": 5,
  "age_max": 12
}
```

**Expected Response:**
```json
{
  "status": true,
  "statusCode": 200,
  "message": "SEO generated successfully",
  "data": {
    "title": "Monopoly Junior by Hasbro - Kids Board Game Ages 5-12",
    "description": "Hasbro's Monopoly Junior brings classic fun for younger players. Simplified rules, colorful board & fun tokens teach money skills & strategy. Perfect family game for ages 5-12.",
    "keywords": "monopoly junior, hasbro board games, family board games, strategy games for kids, educational board games, money skills games, kids board games age 5-12"
  }
}
```

---

### Test Case 6: Arts & Crafts

**Request:**
```json
{
  "name": "Ultimate Art Supplies Set",
  "description": "Complete art set with 150+ pieces including colored pencils, markers, crayons, watercolors, brushes, and paper. Portable carrying case included.",
  "brand_name": "Crayola",
  "categories": ["Arts & Crafts", "Drawing & Painting"],
  "tags": ["art supplies", "drawing", "painting", "creative", "portable"],
  "age_min": 6,
  "age_max": 14
}
```

**Expected Response:**
```json
{
  "status": true,
  "statusCode": 200,
  "message": "SEO generated successfully",
  "data": {
    "title": "Crayola Ultimate Art Set - 150pc Drawing & Painting Kit",
    "description": "Complete Crayola art supplies set with 150+ pieces. Includes colored pencils, markers, crayons, watercolors & brushes in portable case. Perfect creative gift for ages 6-14.",
    "keywords": "crayola art set, kids art supplies, drawing kit, painting set, colored pencils, art gift set, portable art case, creative toys ages 6-14"
  }
}
```

---

### Test Case 7: Outdoor Toy

**Request:**
```json
{
  "name": "Kids Trampoline with Safety Net",
  "description": "6-foot outdoor trampoline with safety enclosure net, padded poles, and rust-resistant frame. Weight capacity 150 lbs. Easy assembly.",
  "brand_name": "Skywalker",
  "categories": ["Outdoor Toys", "Sports & Active Play"],
  "tags": ["trampoline", "outdoor", "active play", "exercise"],
  "age_min": 3,
  "age_max": 10
}
```

**Expected Response:**
```json
{
  "status": true,
  "statusCode": 200,
  "message": "SEO generated successfully",
  "data": {
    "title": "Skywalker Kids Trampoline 6ft with Safety Net Ages 3-10",
    "description": "Safe outdoor fun with Skywalker 6ft trampoline. Includes safety net, padded poles & rust-resistant frame. 150 lbs capacity. Perfect active play for kids ages 3-10. Easy assembly.",
    "keywords": "kids trampoline, outdoor trampoline, trampoline with safety net, skywalker trampoline, outdoor toys, active play equipment, backyard trampoline, kids exercise"
  }
}
```

---

### Test Case 8: Electronic Toy

**Request:**
```json
{
  "name": "Interactive Learning Tablet",
  "description": "Educational tablet with 100+ learning activities covering math, reading, science, and more. Touch screen, kid-safe design, and parental controls.",
  "brand_name": "LeapFrog",
  "categories": ["Electronic Toys", "Educational Toys", "Learning Tablets"],
  "tags": ["tablet", "electronic", "learning", "educational", "interactive"],
  "age_min": 4,
  "age_max": 8
}
```

**Expected Response:**
```json
{
  "status": true,
  "statusCode": 200,
  "message": "SEO generated successfully",
  "data": {
    "title": "LeapFrog Learning Tablet - 100+ Activities Ages 4-8",
    "description": "LeapFrog interactive tablet with 100+ educational activities. Covers math, reading & science with touch screen & parental controls. Safe, educational fun for ages 4-8.",
    "keywords": "leapfrog tablet, kids learning tablet, educational tablet, interactive learning toy, electronic learning toy, kids tablet ages 4-8, educational electronics"
  }
}
```

---

## Error Test Cases

### Error 1: Missing Required Field
**Request:**
```json
{
  "description": "Some description"
}
```

**Expected Response:**
```json
{
  "status": false,
  "statusCode": "400",
  "message": "Product name and description are required",
  "data": null
}
```

---

### Error 2: Empty Name
**Request:**
```json
{
  "name": "",
  "description": "Some description"
}
```

**Expected Response:**
```json
{
  "status": false,
  "statusCode": "400",
  "message": "Product name and description are required",
  "data": null
}
```

---

### Error 3: Unauthorized
**Request:**
```bash
# Without Authorization header
```

**Expected Response:**
```json
{
  "status": false,
  "statusCode": "401",
  "message": "Unauthorized",
  "data": null
}
```

---

## Performance Expectations

| Metric | Expected Value |
|--------|---------------|
| Response Time | < 5 seconds |
| Success Rate | > 95% |
| Title Length | 50-60 characters |
| Description Length | 120-160 characters |
| Keywords Count | 5-10 keywords |
| Rate Limit | 10 requests/minute |

---

## SEO Quality Checklist

Generated SEO should meet these criteria:

### Title
- ✅ 50-60 characters
- ✅ Includes product name
- ✅ Includes brand name (if provided)
- ✅ Includes key feature or USP
- ✅ Includes age range (if relevant)
- ✅ Natural and readable

### Description
- ✅ 120-160 characters
- ✅ Compelling and informative
- ✅ Includes key features
- ✅ Includes target age (if relevant)
- ✅ Call-to-action friendly
- ✅ Natural and readable

### Keywords
- ✅ 5-10 relevant keywords
- ✅ Comma-separated
- ✅ Mix of short-tail and long-tail
- ✅ Includes brand name
- ✅ Includes product category
- ✅ Includes target audience
- ✅ No keyword stuffing

---

## Testing with Postman

### Collection Variables
```json
{
  "base_url": "http://localhost:8000/api",
  "auth_token": "your_bearer_token_here"
}
```

### Pre-request Script
```javascript
// Auto-generate test data
const names = [
  "LEGO Classic Building Set",
  "Wooden Puzzle ABC",
  "Robot Building Kit"
];

const descriptions = [
  "A creative building set with colorful bricks",
  "Colorful wooden alphabet puzzle for learning",
  "Advanced robotics kit with programmable controller"
];

const randomIndex = Math.floor(Math.random() * names.length);

pm.collectionVariables.set("test_name", names[randomIndex]);
pm.collectionVariables.set("test_description", descriptions[randomIndex]);
```

### Test Script
```javascript
pm.test("Status code is 200", function() {
    pm.response.to.have.status(200);
});

pm.test("Response has correct structure", function() {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('status');
    pm.expect(jsonData).to.have.property('data');
    pm.expect(jsonData.data).to.have.property('title');
    pm.expect(jsonData.data).to.have.property('description');
    pm.expect(jsonData.data).to.have.property('keywords');
});

pm.test("Title length is 50-60 characters", function() {
    var jsonData = pm.response.json();
    var titleLength = jsonData.data.title.length;
    pm.expect(titleLength).to.be.within(40, 65);
});

pm.test("Description length is 120-160 characters", function() {
    var jsonData = pm.response.json();
    var descLength = jsonData.data.description.length;
    pm.expect(descLength).to.be.within(100, 170);
});

pm.test("Keywords are comma-separated", function() {
    var jsonData = pm.response.json();
    pm.expect(jsonData.data.keywords).to.include(',');
});

pm.test("Response time is less than 10s", function() {
    pm.expect(pm.response.responseTime).to.be.below(10000);
});
```

---

## Mock Server for Frontend Testing

Jika backend belum siap, gunakan mock server:

### Using JSON Server
```javascript
// db.json
{
  "seo": {
    "status": true,
    "statusCode": 200,
    "message": "SEO generated successfully",
    "data": {
      "title": "Test Product - Sample SEO Title for Testing",
      "description": "This is a sample meta description generated for testing purposes. It demonstrates the expected format and length of SEO descriptions.",
      "keywords": "test, sample, seo, product, keywords, testing, mock"
    }
  }
}
```

```bash
# Start mock server
json-server --watch db.json --port 3001
```

### Using MSW (Mock Service Worker)
```typescript
// mocks/handlers.ts
import { rest } from 'msw';

export const handlers = [
  rest.post('/api/ai/generate-seo', (req, res, ctx) => {
    return res(
      ctx.delay(2000), // Simulate network delay
      ctx.status(200),
      ctx.json({
        status: true,
        statusCode: 200,
        message: 'SEO generated successfully',
        data: {
          title: 'Mock Product Title - Generated by AI',
          description: 'This is a mock SEO description generated for testing. It contains relevant keywords and compelling copy to demonstrate the feature.',
          keywords: 'mock, test, seo, product, ai-generated'
        }
      })
    );
  })
];
```
