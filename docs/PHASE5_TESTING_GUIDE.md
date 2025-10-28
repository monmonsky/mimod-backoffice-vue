# Phase 5 Migration - Testing Guide

## 📋 Overview

This guide will help you test all 5 components migrated in Phase 5 to ensure everything works correctly.

**Dev Server**: http://localhost:3003/
**Status**: ✅ Running (no errors)

---

## ✅ Testing Checklist

### Component 1: ModuleTable.vue
**URL**: http://localhost:3003/access-control/modules
**Priority**: 🔴 HIGH (Complex component with drag & drop)

#### What to Test:
1. **Page Load**
   - [ ] Table loads without errors
   - [ ] All modules display in groups
   - [ ] No console errors

2. **Badge Display** (8 total badge uses)
   - [ ] Parent modules show **Active** badge (green) when `is_active = true`
   - [ ] Parent modules show **Inactive** badge (yellow/warning) when `is_active = false`
   - [ ] Parent modules show **Visible** badge (blue/info) when `is_visible = true`
   - [ ] Parent modules show **Hidden** badge (gray/ghost) when `is_visible = false`
   - [ ] Child modules show **Active** badge (green) when `is_active = true`
   - [ ] Child modules show **Inactive** badge (yellow/warning) when `is_active = false`
   - [ ] Child modules show **Visible** badge (blue/info) when `is_visible = true`
   - [ ] Child modules show **Hidden** badge (gray/ghost) when `is_visible = false`

3. **Filtering**
   - [ ] Search by module name works
   - [ ] Filter by Active Status (All/Active/Inactive) works
   - [ ] Filter by Visible Status (All/Visible/Hidden) works

4. **Drag & Drop** (Critical - ensure helpers didn't break this)
   - [ ] Drag groups up/down works
   - [ ] Drag modules between groups works
   - [ ] Drag modules within same group works
   - [ ] Drag child modules works
   - [ ] "Save Order" button appears after drag
   - [ ] Click "Save Order" saves successfully
   - [ ] Success toast shows: "Module order updated successfully!"
   - [ ] No error toasts appear

5. **Error Handling**
   - [ ] If save fails, error message shows (uses `getErrorMessage()` helper)
   - [ ] Error toast is user-friendly (not raw API error)

**Expected Badge Colors**:
- `getActiveBadgeClass(true)` → `badge-success` (green)
- `getActiveBadgeClass(false)` → `badge-warning` (yellow)
- `getVisibleBadgeClass(true)` → `badge-info` (blue)
- `getVisibleBadgeClass(false)` → `badge-ghost` (gray)

---

### Component 2: brands/[id]/show.vue
**URL**: http://localhost:3003/catalogs/brands/[pick-any-id]
**Priority**: 🟡 MEDIUM (Detail page with nested data)

#### What to Test:
1. **Page Load**
   - [ ] Brand detail page loads
   - [ ] Brand name, slug, logo display correctly
   - [ ] No console errors

2. **Badge Display** (2 uses)
   - [ ] Brand shows **Active** badge (green) when `is_active = true`
   - [ ] Brand shows **Inactive** badge (yellow/warning) when `is_active = false`
   - [ ] Products list shows **Active** badge (green) for active products
   - [ ] Products list shows **Inactive** badge (yellow/warning) for inactive products

3. **Data Display** (uses response helpers)
   - [ ] Brand description shows (if exists)
   - [ ] Brand statistics show (product count)
   - [ ] Products list shows (up to 10 products)
   - [ ] Product images, names, SKUs display correctly

4. **Formatter Helpers**
   - [ ] Created At date shows in Indonesian format (e.g., "25 Oktober 2025, 16:30")
   - [ ] Last Updated date shows in Indonesian format
   - [ ] Dates are readable (not raw ISO strings)

5. **Navigation**
   - [ ] "Edit" button links to edit page
   - [ ] "Back to List" button returns to brands table

**Expected Badge Colors**:
- `getActiveBadgeClass(true)` → `badge-success` (green)
- `getActiveBadgeClass(false)` → `badge-warning` (yellow)

---

### Component 3: categories/[id]/show.vue
**URL**: http://localhost:3003/catalogs/categories/[pick-any-id]
**Priority**: 🟡 MEDIUM (Detail page with nested data)

#### What to Test:
1. **Page Load**
   - [ ] Category detail page loads
   - [ ] Category name, slug, image display correctly
   - [ ] No console errors

2. **Badge Display** (2 uses)
   - [ ] Category shows **Active** badge (green) when `is_active = true`
   - [ ] Category shows **Inactive** badge (yellow/warning) when `is_active = false`
   - [ ] Products list shows **Active** badge (green) for active products
   - [ ] Products list shows **Inactive** badge (yellow/warning) for inactive products

3. **Data Display** (uses response helpers)
   - [ ] Category description shows (if exists)
   - [ ] Category statistics show (product count)
   - [ ] Products list shows (up to 10 products)
   - [ ] Sort order badge shows
   - [ ] Parent category info shows (if exists)

4. **Formatter Helpers**
   - [ ] Created At date shows in Indonesian format
   - [ ] Last Updated date shows in Indonesian format

5. **Navigation**
   - [ ] "Edit" button links to edit page
   - [ ] "Back to List" button returns to categories table

**Expected Badge Colors**:
- `getActiveBadgeClass(true)` → `badge-success` (green)
- `getActiveBadgeClass(false)` → `badge-warning` (yellow)

---

### Component 4: modules/[id]/show.vue
**URL**: http://localhost:3003/access-control/modules/[pick-any-id]
**Priority**: 🟢 LOW (Simple detail page)

#### What to Test:
1. **Page Load**
   - [ ] Module detail page loads
   - [ ] Module name, display name, icon display correctly
   - [ ] No console errors

2. **Badge Display** (2 uses)
   - [ ] Module shows **Active** badge (green) when `is_active = true`
   - [ ] Module shows **Inactive** badge (yellow/warning) when `is_active = false`
   - [ ] Module shows **Visible** badge (blue/info) when `is_visible = true`
   - [ ] Module shows **Hidden** badge (gray/ghost) when `is_visible = false`

3. **Data Display**
   - [ ] Description shows
   - [ ] Route shows
   - [ ] Component shows
   - [ ] Permission name shows
   - [ ] Group name shows
   - [ ] Sort order badge shows
   - [ ] Created At shows

4. **Child Modules** (if parent has children)
   - [ ] Child modules list shows
   - [ ] Links to child module pages work

5. **Navigation**
   - [ ] "Edit Module" button works
   - [ ] "Back to Modules" button works
   - [ ] "Delete Module" button shows (don't click)

**Expected Badge Colors**:
- `getActiveBadgeClass(true)` → `badge-success` (green)
- `getActiveBadgeClass(false)` → `badge-warning` (yellow)
- `getVisibleBadgeClass(true)` → `badge-info` (blue)
- `getVisibleBadgeClass(false)` → `badge-ghost` (gray)

---

### Component 5: roles/[id]/show.vue
**URL**: http://localhost:3003/access-control/roles/[pick-any-id]
**Priority**: 🟢 LOW (Simple detail page)

#### What to Test:
1. **Page Load**
   - [ ] Role detail page loads
   - [ ] Role name, display name display correctly
   - [ ] No console errors

2. **Badge Display** (2 uses)
   - [ ] Role shows **System** badge (blue/info) when `is_system = true`
   - [ ] Role shows **Custom** badge (gray/ghost) when `is_system = false`
   - [ ] Role shows **Active** badge (green) when `is_active = true`
   - [ ] Role shows **Inactive** badge (yellow/warning) when `is_active = false`

3. **Data Display**
   - [ ] Description shows
   - [ ] Priority badge shows
   - [ ] Total permissions count shows
   - [ ] Created At shows

4. **Permissions List**
   - [ ] Permissions grouped by module show
   - [ ] Each permission has check icon
   - [ ] Permission display names show
   - [ ] Permission code names show

5. **Navigation**
   - [ ] "Edit Permissions" button works
   - [ ] "Back to Roles" button works
   - [ ] "Delete Role" button disabled for system roles

**Expected Badge Colors**:
- `getSystemBadgeClass(true)` → `badge-info` (blue) - System role
- `getSystemBadgeClass(false)` → `badge-ghost` (gray) - Custom role
- `getActiveBadgeClass(true)` → `badge-success` (green)
- `getActiveBadgeClass(false)` → `badge-warning` (yellow)

---

## 🔍 General Testing Checklist

### For ALL Components:

1. **TypeScript Errors**
   - [ ] No TypeScript errors in browser console
   - [ ] No TypeScript errors in terminal

2. **Runtime Errors**
   - [ ] No JavaScript errors in browser console
   - [ ] No unhandled promise rejections

3. **Import Errors**
   - [ ] All helper imports resolve correctly
   - [ ] `getActiveBadgeClass` imported from `~/utils/statusHelpers`
   - [ ] `getVisibleBadgeClass` imported from `~/utils/statusHelpers`
   - [ ] `formatDate` imported from `~/utils/formatters`
   - [ ] `extractListData` imported from `~/utils/responseHelpers`
   - [ ] `extractNestedValue` imported from `~/utils/responseHelpers`
   - [ ] `getErrorMessage` imported from `~/utils/errorHandlers`

4. **Visual Consistency**
   - [ ] All badges use daisyUI classes correctly
   - [ ] Badge colors match expected values
   - [ ] Badge sizes are consistent (badge-sm, badge-xs)
   - [ ] No broken layouts

5. **Hot Reload**
   - [ ] Make a small change to any component
   - [ ] Save the file
   - [ ] Page reloads without errors
   - [ ] Changes reflect immediately

---

## 🎯 Priority Testing Order

1. **Start with ModuleTable** (most complex, highest risk)
2. **Then brands/show and categories/show** (test response helpers)
3. **Finally modules/show and roles/show** (simple, low risk)

---

## 🐛 Common Issues to Watch For

### Issue 1: Badge Color Wrong
**Symptom**: Badge shows wrong color (e.g., red instead of green)
**Cause**: Helper function returns wrong class
**Fix**: Check helper implementation in `statusHelpers.ts`

### Issue 2: Data Not Loading
**Symptom**: Empty page or "No data found"
**Cause**: Response helper not extracting data correctly
**Fix**: Check response structure in browser DevTools Network tab

### Issue 3: Format Date Shows Raw ISO String
**Symptom**: "2025-10-25T12:00:00.000Z" instead of "25 Oktober 2025, 12:00"
**Cause**: `formatDate()` not being called or imported incorrectly
**Fix**: Check import and usage of `formatDate()`

### Issue 4: Drag & Drop Broken
**Symptom**: Can't drag modules, or drag doesn't work
**Cause**: Badge helper interfering with event handlers
**Fix**: This shouldn't happen - report immediately if it does

### Issue 5: Import Error
**Symptom**: "Cannot find module" or similar
**Cause**: Wrong import path or helper not exported
**Fix**: Check import paths and `utils/index.ts` exports

---

## 📊 Test Results Template

Copy this template and fill it out as you test:

```markdown
# Phase 5 Testing Results

**Date**: [Your Date]
**Tester**: [Your Name]

## ModuleTable.vue
- [ ] ✅ All tests passed
- [ ] ⚠️ Issues found (list below)
- [ ] ❌ Major issues (describe below)

**Issues**:
- [List any issues]

## brands/[id]/show.vue
- [ ] ✅ All tests passed
- [ ] ⚠️ Issues found (list below)
- [ ] ❌ Major issues (describe below)

**Issues**:
- [List any issues]

## categories/[id]/show.vue
- [ ] ✅ All tests passed
- [ ] ⚠️ Issues found (list below)
- [ ] ❌ Major issues (describe below)

**Issues**:
- [List any issues]

## modules/[id]/show.vue
- [ ] ✅ All tests passed
- [ ] ⚠️ Issues found (list below)
- [ ] ❌ Major issues (describe below)

**Issues**:
- [List any issues]

## roles/[id]/show.vue
- [ ] ✅ All tests passed
- [ ] ⚠️ Issues found (list below)
- [ ] ❌ Major issues (describe below)

**Issues**:
- [List any issues]

## Overall Assessment
- **Total Components Tested**: 5/5
- **Components Passed**: [Number]/5
- **Components with Issues**: [Number]/5
- **Ready for Production**: [ ] Yes / [ ] No

**Summary**:
[Your overall assessment]
```

---

## 🚀 After Testing

### If All Tests Pass:
1. Mark Phase 5 as fully complete ✅
2. Continue to Phase 6 (50% milestone - 5 more components)
3. Update `PROJECT_IMPROVEMENTS_SUMMARY.md`

### If Issues Found:
1. Document issues in test results template
2. Fix critical issues immediately
3. Re-test after fixes
4. Continue only when all critical issues resolved

---

## 📝 Quick Testing Commands

```bash
# Check dev server status
curl http://localhost:3003

# Watch for TypeScript errors in terminal
# (Already running with npm run dev)

# Open browser DevTools
# Press F12 in browser

# Check console for errors
# Look for red errors in Console tab

# Check network requests
# Look at Network tab, filter by XHR/Fetch
```

---

## ✅ Expected Results Summary

All components should:
- ✅ Load without errors
- ✅ Display correct badge colors
- ✅ Show data properly
- ✅ Have working navigation
- ✅ Use helpers correctly
- ✅ Format dates/prices consistently
- ✅ Handle errors gracefully

**Estimated Testing Time**: 15-20 minutes for thorough testing

---

**Good luck with testing!** 🎉

If you find any issues, document them and we'll fix them before continuing to Phase 6.
