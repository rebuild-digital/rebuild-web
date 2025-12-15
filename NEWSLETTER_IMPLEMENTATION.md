# Newsletter Form Implementation Guide - MailerLite

This guide walks you through deploying and testing the MailerLite newsletter integration.

## ✅ What's Been Completed

### Frontend Changes
- ✅ Newsletter form component configured for MailerLite
- ✅ Footer form redesigned with separate first/last name fields
- ✅ Interest dropdown added: "Keep me up to date as..." (entrepreneur, investor, public fund manager, media, curious individual)
- ✅ Hidden `consent` field added to footer form
- ✅ Duplicate event handlers prevented with `stopImmediatePropagation()`
- ✅ Global form handler updated with initialization flag to prevent double-init

### Backend (Bunny Edge Script)

- ✅ MailerLite integration implemented with API v2
- ✅ Interest field mapped to MailerLite custom field
- ✅ Uses Bunny SDK with middleware pattern (prevents infinite loops)
- ✅ 5-second deduplication window to prevent rapid duplicate submissions
- ✅ Proper error handling and validation
- ✅ Environment variables configured (`MAILERLITE_API_KEY`, `MAILERLITE_GROUP_ID`)

### Files Modified
- `bunny-edge-scripts/newsletter-handler.js` - Main MailerLite integration
- `bunny-edge-scripts/bunny-edge-scripts-no-loop.js` - Notion script with deduplication
- `src/_includes/components/footer.njk` - Footer newsletter form
- `src/_includes/components/forms/newsletter-form.njk` - Newsletter component
- `src/scripts/form-handler.js` - Global form handler
- `.env.example` - Environment variables documented

---

## 📋 Next Steps for Deployment

### Step 1: Get MailerLite API Key & Configure Custom Field

1. Log into your MailerLite account
2. Go to: <https://dashboard.mailerlite.com/integrations/api>
3. Copy your API key (starts with `eyJ...`)
4. **Create Custom Field for Interest:**
   - Go to **Subscribers** → **Fields**
   - Click **Create Field**
   - Field name: `interest`
   - Field type: **Text** (it will receive values like "entrepreneur", "investor", etc.)
   - Click **Save**
5. *Optional:* Get a Group ID if you want subscribers in a specific group:
   - Go to **Subscribers** → **Groups**
   - Click on a group, the ID is in the URL: `dashboard.mailerlite.com/groups/{GROUP_ID}/subscribers`

### Step 2: Update the Edge Script Origin

**IMPORTANT:** Before deploying, update the origin URL in the script:

**File:** `bunny-edge-scripts/newsletter-handler.js`

```javascript
// Line 26: Update this to your actual static site URL
BunnySDK.net.http.servePullZone({
  origin: "https://your-actual-domain.com", // ⚠️ CHANGE THIS
})
```

Replace with:
- **Staging:** `https://rebuild-staging.statichost.page`
- **Production:** Your production domain

### Step 3: Deploy to Bunny CDN

#### Option A: Deploy as Middleware (Recommended)

1. **Log into BunnyCDN Dashboard**
2. Go to **Pull Zones** → Select your pull zone
3. Click **Edge Scripts** tab
4. Create a new Edge Script:
   - **Name:** `Newsletter Handler - MailerLite`
   - **Type:** Middleware
   - **Code:** Copy entire contents of `bunny-edge-scripts/newsletter-handler.js`

5. **Set Environment Variables:**
   - Click **Environment Variables** tab
   - Add:
     ```
     MAILERLITE_API_KEY=eyJxxxxxxxxxxxxx
     MAILERLITE_GROUP_ID=12345 (optional)
     ```

6. **Enable the Script:**
   - Toggle the script to **Enabled**
   - Click **Save Changes**

#### Option B: Deploy via Bunny CLI (if you have it set up)

```bash
bunny edge-script deploy \
  --name "Newsletter Handler" \
  --file bunny-edge-scripts/newsletter-handler.js \
  --env MAILERLITE_API_KEY=eyJxxxxx \
  --env MAILERLITE_GROUP_ID=12345
```

### Step 4: Update CORS (Production Only)

For production, update the CORS origin in the edge script:

**File:** `bunny-edge-scripts/newsletter-handler.js` (Line 35)

```javascript
const corsHeaders = {
  "Access-Control-Allow-Origin": "https://your-production-domain.com", // Update this
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};
```

### Step 5: Build and Deploy Frontend

```bash
# Build the site with updated forms
npm run build

# Deploy to your hosting (adjust command as needed)
# For static hosting, upload the /dist folder
```

---

## 🧪 Testing Checklist

### 1. Test Newsletter Signup Flow

#### Footer Form Test

1. Navigate to any page on your site
2. Scroll to footer
3. Fill in:
   - Email: "test@example.com"
   - First name: "Test"
   - Last name: "User"
   - Interest: Select "an entrepreneur"
4. Click "Subscribe"
5. **Expected:** Success message appears, form resets

#### Full Newsletter Form Test

1. Navigate to a page with the full newsletter form
2. Fill in:
   - Email: "test2@example.com"
   - First name: "Jane" (optional)
   - Last name: "Doe" (optional)
   - Interest: Select "an investor" (required)
   - Check the consent checkbox
3. Click "Subscribe"
4. **Expected:** Success message appears, form resets

### 2. Test Validation

#### Missing Email Test
1. Leave email field empty
2. Try to submit
3. **Expected:** Browser validation error OR API error message

#### Missing Interest Test

1. Fill email and names but don't select interest
2. Submit
3. **Expected:** Error message: "Interest selection is required"

#### Missing Consent Test (Full Form)

1. Fill email and interest but don't check consent
2. Submit
3. **Expected:** Error message: "Consent is required"

#### Invalid Email Test
1. Enter "not-an-email"
2. Submit
3. **Expected:** Error message: "Please provide a valid email address"

### 3. Test Error Handling

#### Duplicate Submission Test
1. Submit the form with an email
2. **Immediately** submit again with the same email
3. **Expected:** Second submission returns success without calling MailerLite (deduplicated)
4. Check Bunny logs, should see: `Duplicate submission blocked for: test@example.com`

#### Invalid API Key Test (Optional)
1. Temporarily set wrong API key in Bunny
2. Try to submit
3. **Expected:** Generic error message (not exposing API credentials)
4. Check Bunny logs for actual error
5. Revert to correct API key

### 4. Verify in MailerLite

1. Log into MailerLite dashboard
2. Go to **Subscribers** → **All subscribers**
3. Verify your test emails appear
4. Click on a subscriber to view details
5. Check that fields are populated correctly:
   - First name (if provided)
   - Last name (if provided)
   - **Interest field** (should show value like "entrepreneur", "investor", etc.)
6. If using groups, verify subscribers are in the correct group

### 5. Test Deduplication

1. Submit form with "dedup-test@example.com"
2. Wait 6 seconds
3. Submit again with same email
4. **Expected:** Both submissions succeed (past deduplication window)
5. Check MailerLite: Should show one subscriber (MailerLite handles duplicates)

### 6. Browser Console Checks

Open browser console (F12) and check for:
- ✅ No JavaScript errors
- ✅ Form submission logs appear
- ✅ Successful response (200 status)
- ❌ No multiple network requests for single submission

### 7. Bunny Edge Script Logs

Check Bunny CDN logs for:
- ✅ Successful MailerLite API calls
- ✅ Deduplication working (if testing rapid submissions)
- ✅ No infinite loops or excessive requests
- ❌ No authentication errors
- ❌ No 500 errors

---

## 🐛 Troubleshooting

### Form Submitting Multiple Times

**Symptoms:** Network tab shows 2-3 identical requests

**Solutions:**
1. Clear browser cache
2. Check browser console for multiple form handlers initializing
3. Verify `stopImmediatePropagation()` is in place
4. Check deduplication logs in Bunny

### Validation Errors

**"Consent is required"**
- Footer form: Already fixed with hidden consent field
- Full form: User must check the checkbox

**"Email is required"**
- Field is empty or form data not parsing correctly
- Check browser console for JavaScript errors

### MailerLite API Errors

**401 Unauthorized**
- API key is wrong or expired
- Check environment variables in Bunny

**400 Bad Request**
- Invalid email format
- Missing required fields
- Check request payload in Bunny logs

### Subscribers Not Appearing in MailerLite

1. Check Bunny logs for successful 200 responses
2. Verify API key has correct permissions
3. Check MailerLite **Unconfirmed** tab (if double opt-in enabled)
4. Try a different test email

### CORS Errors

**"Access-Control-Allow-Origin" error in browser**

1. Verify CORS headers in edge script
2. Check that origin matches your domain
3. OPTIONS preflight should return 200

### Infinite Loop Detection

**Symptoms:** Excessive edge script invocations

**Check:**
1. Is the script only intercepting `/api/newsletter-signup`?
2. Does it return `void` for non-API paths?
3. Is origin URL correct?

---

## 📊 Monitoring

### Key Metrics to Watch

1. **Bunny CDN Dashboard:**
   - Edge Script invocations
   - Response times
   - Error rates

2. **MailerLite Dashboard:**
   - New subscriber rate
   - Bounce rate (invalid emails)
   - Unsubscribe rate

3. **Browser Console:**
   - Form submission success rate
   - JavaScript errors
   - Network timing

### Expected Behavior

- **Normal:** 1 edge script invocation per form submission
- **Normal:** Deduplication triggers for rapid double-clicks
- **Normal:** 200ms-500ms response time
- **Alert:** Multiple invocations per submission (check for bugs)
- **Alert:** High error rate (check API credentials)

---

## 🔒 Security Notes

1. **API Keys:** Never commit actual keys to git
2. **CORS:** Update to specific domain in production (not `*`)
3. **Rate Limiting:** Consider adding if form is publicly accessible
4. **Honeypot:** Consider adding honeypot field for spam protection
5. **CAPTCHA:** Consider adding for high-traffic sites

---

## 🎯 Success Criteria

✅ Footer form submits successfully
✅ Full newsletter form submits successfully
✅ Validation errors display correctly
✅ Success messages appear and forms reset
✅ Subscribers appear in MailerLite dashboard
✅ No duplicate submissions (deduplication working)
✅ No infinite loops in Bunny logs
✅ No JavaScript errors in browser console
✅ Response times under 1 second
✅ CORS working without errors

---

## 📞 Support Resources

- **MailerLite API Docs:** <https://developers.mailerlite.com/docs/>
- **Bunny CDN Edge Scripts:** <https://docs.bunny.net/docs/edge-scripting-introduction>
- **Bunny SDK Docs:** <https://www.npmjs.com/package/@bunny.net/edgescript-sdk>

---

## 🔄 Rollback Plan

If issues arise in production:

1. **Quick Fix:** Disable edge script in Bunny dashboard
2. **Forms will:** Fall back to default behavior (may show CORS errors)
3. **Alternative:** Point form action to temporary endpoint
4. **Debug:** Check Bunny logs for specific errors
5. **Fix and redeploy:** Update script and re-enable

---

**Last Updated:** 2025-12-12
**Status:** Ready for deployment and testing
