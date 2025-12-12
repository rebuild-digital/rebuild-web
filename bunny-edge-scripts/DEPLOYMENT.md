# Bunny Edge Script Deployment Guide

## Overview

The `bunny-edge-scripts-no-loop.js` file is a unified Edge Script that handles all form submissions for the Rebuild site.

## What It Handles

- **Builder Application** (`/api/builder-application`) → Notion
- **Builder Promotion** (`/api/builder-promotion`) → Notion
- **Newsletter Signup** (`/api/newsletter-signup`) → MailerLite

## Deployment Steps

### 1. Upload Edge Script to Bunny

1. Go to Bunny.net dashboard
2. Navigate to your Pull Zone → Edge Script section
3. Copy the contents of `bunny-edge-scripts-no-loop.js`
4. Paste into the Edge Script editor
5. Save and deploy

### 2. Configure Environment Variables

In Bunny Edge Script settings, add these environment variables:

**For Builder Forms (Notion):**
```
NOTION_TOKEN=ntn_your_token_here
NOTION_BUILDERS_DB_ID=your_database_id
```

**For Newsletter (MailerLite):**
```
MAILERLITE_API_KEY=your_mailerlite_api_key
MAILERLITE_GROUP_ID=your_group_id_optional
```

### 3. Update Origin URL

In the Edge Script (line 21), set the origin to match your environment:

**Staging:**
```javascript
origin: "https://rebuild-staging.statichost.page"
```

**Production:**
```javascript
origin: "https://www.rebuild.net"
```

### 4. Test All Forms

After deployment, test each form type:

1. **Newsletter** - Test on any page footer or newsletter page
2. **Builder Application** - Test application form
3. **Builder Promotion** - Test promotion form

Check the Bunny Edge Script logs for any errors.

## Troubleshooting

### CORS Errors

If you see CORS errors:
- Check that all API paths are included in `isFormPath` (line 34-37)
- Verify CORS headers are being returned (line 18-24)

### 404 Errors

If forms return 404:
- Verify the Edge Script is deployed and active
- Check that the path matches exactly (e.g., `/api/newsletter-signup`)
- Confirm the origin URL is correct

### Form Data Not Reaching Services

**For Notion forms:**
- Check `NOTION_TOKEN` is valid and has access to the database
- Verify `NOTION_BUILDERS_DB_ID` matches your database

**For MailerLite:**
- Check `MAILERLITE_API_KEY` is valid
- Verify the group ID exists (if using)
- Check MailerLite field names match (name, last_name, interest)

## Monitoring

View logs in Bunny dashboard → Pull Zone → Edge Script → Logs

Look for:
- `Sending to Notion:` - Builder form submissions
- `Sending to MailerLite:` - Newsletter submissions
- `Duplicate submission blocked` - Deduplication working
- Error messages from APIs

## Notion Database Configuration

**IMPORTANT:** Before forms will work, ensure these select field options are configured in your Notion database:

### Category Options (17 required)

- Bundled
- Community
- Creator platform
- Dating
- Events
- Forum
- Groups
- Location
- Social marketplace
- Messaging
- Microblogging
- Networking
- Photo sharing
- Resource sharing
- Video sharing
- Other

### Location Options (51 European countries)

- Albania
- Andorra
- Armenia
- Austria
- Azerbaijan
- Belarus
- Belgium
- Bosnia and Herzegovina
- Bulgaria
- Croatia
- Cyprus
- Czech Republic
- Denmark
- Estonia
- Finland
- France
- Georgia
- Germany
- Greece
- Hungary
- Iceland
- Ireland
- Italy
- Kazakhstan
- Kosovo
- Latvia
- Liechtenstein
- Lithuania
- Luxembourg
- Malta
- Moldova
- Monaco
- Montenegro
- Netherlands
- North Macedonia
- Norway
- Poland
- Portugal
- Romania
- Russia
- San Marino
- Serbia
- Slovakia
- Slovenia
- Spain
- Sweden
- Switzerland
- Türkiye
- Ukraine
- United Kingdom
- Vatican City

### Stage Options (4 required)

- Idea
- Alpha
- Beta
- Growth

### Type Options (3 required)

These should already be configured:

- Featured Application
- Standard Application
- Promotion

## Production Checklist

Before going to production:

- [ ] Update origin URL to production domain
- [ ] Set production environment variables in Bunny
- [ ] Configure all Notion select field options (see above)
- [ ] Test all three form types
- [ ] Verify Notion entries are created correctly
- [ ] Verify MailerLite subscribers are added
- [ ] Check that CORS headers work from production domain
- [ ] Monitor logs for first few submissions
