# Template 3 Enhancements - Implementation Guide

## ✅ **Phase 1: Image Upload Backend (COMPLETED)**

### Server Actions Added:
- **`uploadImage()`** in `/src/app/actions.ts`
  - Uploads images to Supabase Storage (`portfolio-images` bucket)
  - Generates public URLs automatically
  - Updates resume data with image URLs
  - Supports both profile photos and project images

- **`getResumeFile()`** in `/src/app/actions.ts`
  - Retrieves original resume data for download

### Data Structure Updated:
- Extended `ResumeData` interface in `/src/lib/gemini.ts`:
  ```typescript
  personalInfo: {
    ...existing fields
    profileImageUrl?: string  // NEW
  }
  projects: [{
    ...existing fields
    imageUrl?: string  // NEW
  }]
  ```

---

## 🔨 **Phase 2: Supabase Storage Setup (ACTION REQUIRED)**

###To create the `portfolio-images` storage bucket in Supabase:

1. **Go to your Supabase Dashboard**
   - Navigate to: `https://supabase.com/dashboard/project/YOUR_PROJECT_ID`

2. **Access Storage**
   - Click on "Storage" in the left sidebar
   - Click "Create a new bucket"

3. **Create Bucket**
   - **Bucket name:** `portfolio-images`
   - **Public bucket:** ✅ Enable (images need to be publicly accessible)
   - Click "Create bucket"

4. **Configure Bucket Policies** (Optional but Recommended)
   Add an RLS policy to allow authenticated users to upload:
   
   ```sql
   -- Policy: Allow authenticated users to upload their own images
   CREATE POLICY "Users can upload their own images"
   ON storage.objects FOR INSERT
   TO authenticated
   WITH CHECK (bucket_id = 'portfolio-images' AND auth.uid()::text = (storage.foldername(name))[1]);

   -- Policy: Public read access
   CREATE POLICY "Public can view images"
   ON storage.objects FOR SELECT
   TO public
   USING (bucket_id = 'portfolio-images');

   -- Policy: Users can update their own images
   CREATE POLICY "Users can update their own images"
   ON storage.objects FOR UPDATE
   TO authenticated
   USING (bucket_id = 'portfolio-images' AND auth.uid()::text = (storage.foldername(name))[1]);
   ```

5. **Verify Setup**
   - Go to the bucket settings
   - Ensure "Public" is enabled
   - Test by uploading a sample image

---

## 📥 **Phase 3: PDF Download Enhancement (NEXT STEP)**

### Option 1: jsPDF (Lightweight, Client-Side)
**Pros:** Simple, no server required, works offline
**Cons:** Limited styling, text-based

```bash
pnpm add jspdf
```

### Option 2: @react-pdf/renderer (React Components → PDF)
**Pros:** Professional output, React-based, great for complex layouts
**Cons:** Larger bundle, more complex

```bash
pnpm add @react-pdf/renderer
```

### Option 3: Puppeteer (Server-Side, HTML → PDF)
**Pros:** Perfect pixel match to web view, full CSS support
**Cons:** Requires server, heavier resource usage

```bash
pnpm add puppeteer
```

---

## 💡 **Recommended Approach: @react-pdf/renderer**

This gives the best balance of quality and maintainability. Here's why:
- ✅ Professional PDF output
- ✅ React component-based (familiar)
- ✅ Full control over styling
- ✅ Can replicate your template designs

### Implementation Steps for PDF:

1. **Install the package:**
   ```bash
   pnpm add @react-pdf/renderer
   ```

2. **Create a PDF template component**
   (I can generate this for you based on Template3)

3. **Update the download handler**
   Replace the text file generation with PDF generation

---

## 🎯 **Current Status:**

✅ **Backend Actions:** Image upload & resume file retrieval
✅ **Frontend Components:** ImageUpload component created  
✅ **Data Models:** Extended to support images
✅ **Template Updates:** Template3 accepts resumeId and fileName
⏳ **Image Upload UI:** Ready to add (imports added)
⏳ **Supabase Bucket:** Needs manual creation
⏳ **PDF Generation:** Awaiting package selection

---

## 📝 **Next Steps:**

1. **Create the Supabase Storage bucket** following the guide above
2. **Choose PDF generation approach** (I recommend @react-pdf/renderer)
3. **Let me know when ready** and I'll:
   - Add the image upload UI to the settings panel
   - Implement PDF generation
   - Create a beautiful PDF template matching Template3

---

## 🆘 **Need Help?**

If you encounter any issues:
- Supabase bucket setup not working?
- Want help choosing the PDF library?
- Need the PDF template implemented?

Just let me know! 🚀
