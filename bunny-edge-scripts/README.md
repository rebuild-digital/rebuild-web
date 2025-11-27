# Bunny Edge Scripts for Form Handling

This directory contains Bunny Edge Scripts that handle form submissions from the Rebuild website. These scripts process form data and forward it to external services (newsletter platforms, Notion databases, etc.).

## Overview

The form system consists of:

1. **Frontend Components** - Nunjucks templates in `src/_includes/components/`
2. **Edge Scripts** - JavaScript handlers that process form submissions (this directory)
3. **External Services** - Newsletter platforms (Mailchimp, ConvertKit) and Notion databases

## Scripts

### 1. Newsletter Handler (`newsletter-handler.js`)

Processes newsletter signup form submissions.

**Endpoint:** `POST /api/newsletter-signup`

**Form Fields:**

- `email` (required) - Subscriber email address
- `first_name` (optional) - Subscriber first name
- `last_name` (optional) - Subscriber last name
- `consent` (required) - Privacy consent checkbox

**Integration Options:**

- Mailchimp
- ConvertKit
- Any other newsletter service with REST API

### 2. Notion Builder Handler (`notion-builder-handler.js`)

Processes both builder promotion and application form submissions, sending them to a Notion database.

**Endpoints:**

- `POST /api/builder-promotion` - For promoting existing builders
- `POST /api/builder-application` - For builders applying to join the catalog

**Builder Promotion Fields:**

- `builder_name` (required) - Name of the builder being promoted
- `builder_website` (required) - Builder's website or LinkedIn
- `builder_category` (required) - Category of work
- `why_promote` (required) - Reason for promotion
- `your_name` (required) - Promoter's name
- `your_email` (required) - Promoter's email
- `your_relationship` (optional) - Relationship to builder

**Builder Application Fields:**

- `builder_name` (required) - Applicant name or organization
- `email` (required) - Applicant email
- `phone` (optional) - Phone number
- `website` (required) - Website or LinkedIn
- `category` (required) - Primary focus area
- `location` (required) - Primary location
- `description` (required) - Project description
- `impact` (required) - Impact metrics/stories
- `stage` (required) - Project stage
- `team_size` (optional) - Team size
- `application_type` (hidden) - 'standard' or 'featured'
- `why_featured` (optional) - Why should they be featured (for featured apps)
- `social_media` (optional) - Social media profile
- `consent` (required) - Public catalog consent
- `newsletter` (optional) - Newsletter opt-in

## Setup Instructions

### Prerequisites

1. **BunnyCDN Account** with Edge Scripting enabled
2. **Notion Account** with API access (for builder forms)
3. **Newsletter Service Account** (Mailchimp, ConvertKit, etc.)

### Step 1: Create Notion Database

Create a Notion database with the following properties:

| Property Name | Type | Description |
|--------------|------|-------------|
| Name | Title | Builder/Organization name |
| Type | Select | Promotion, Standard Application, Featured Application |
| Email | Email | Contact email (applications only) |
| Phone | Phone | Contact phone (applications only) |
| Website | URL | Builder's website |
| Category | Select | Focus area |
| Location | Select | Primary location (applications only) |
| Description | Text | Project/promotion description |
| Impact | Text | Impact metrics (applications only) |
| Stage | Select | Project stage (applications only) |
| Team Size | Text | Team size (applications only) |
| Why Featured | Text | Featured application reason |
| Social Media | URL | Social media profile |
| Submitted By | Text | Promoter info (promotions only) |
| Relationship | Text | Relationship to builder (promotions only) |
| Newsletter | Checkbox | Newsletter opt-in |
| Status | Select | New, Reviewing, Approved, Rejected |
| Submitted At | Date | Submission timestamp |

### Step 2: Create Notion Integration

1. Go to <https://www.notion.so/my-integrations>
2. Click "+ New integration"
3. Name it "Rebuild Forms" (or similar)
4. Select your workspace
5. Click "Submit"
6. Copy the "Internal Integration Token"

### Step 3: Share Database with Integration

1. Open your Notion database
2. Click "..." menu in the top right
3. Click "Add connections"
4. Select your "Rebuild Forms" integration

### Step 4: Deploy Edge Scripts to BunnyCDN

1. Log into your BunnyCDN account
2. Go to "Edge Scripting" section
3. Create a new Edge Script for each handler

**For Newsletter Handler:**

- Name: "Newsletter Signup Handler"
- Upload: `newsletter-handler.js`
- Set environment variables:
  - `MAILCHIMP_API_KEY` (or equivalent for your service)
  - `MAILCHIMP_LIST_ID`
  - `MAILCHIMP_DC`

**For Notion Builder Handler:**

- Name: "Builder Forms Handler"
- Upload: `notion-builder-handler.js`
- Set environment variables:
  - `NOTION_API_KEY` (your integration token)
  - `NOTION_DATABASE_ID` (from database URL)

### Step 5: Configure Routes

In BunnyCDN, set up Pull Zone rules to route form submissions to the Edge Scripts:

1. **Newsletter Route:**
   - Path: `/api/newsletter-signup`
   - Method: POST
   - Edge Script: Newsletter Signup Handler

2. **Builder Promotion Route:**
   - Path: `/api/builder-promotion`
   - Method: POST
   - Edge Script: Builder Forms Handler

3. **Builder Application Route:**
   - Path: `/api/builder-application`
   - Method: POST
   - Edge Script: Builder Forms Handler

### Step 6: Update CORS Settings

For production, update the `Access-Control-Allow-Origin` header in each script to match your domain:

```javascript
const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://yourdomain.com',
  // ... other headers
};
```

## Testing

### Local Testing (Development)

1. Update form actions in Nunjucks templates to point to test endpoints
2. Use tools like Postman or curl to test:

```bash
# Test newsletter signup
curl -X POST https://your-cdn-url.b-cdn.net/api/newsletter-signup \
  -F "email=test@example.com" \
  -F "first_name=Test" \
  -F "consent=on"

# Test builder promotion
curl -X POST https://your-cdn-url.b-cdn.net/api/builder-promotion \
  -F "builder_name=Test Builder" \
  -F "builder_website=https://example.com" \
  -F "builder_category=Technology & Software" \
  -F "why_promote=Great work!" \
  -F "your_name=Jane Doe" \
  -F "your_email=jane@example.com"

# Test builder application
curl -X POST https://your-cdn-url.b-cdn.net/api/builder-application \
  -F "builder_name=Test Org" \
  -F "email=org@example.com" \
  -F "website=https://example.com" \
  -F "category=Social Enterprise" \
  -F "location=Denmark" \
  -F "description=We build things" \
  -F "impact=Lots of impact" \
  -F "stage=Growing / Scaling" \
  -F "consent=on"
```

### Production Testing

1. Test each form on your live website
2. Verify data appears correctly in:
   - Newsletter service (for newsletter signups)
   - Notion database (for builder forms)
3. Check email validation and error handling

## Using the Forms

### Newsletter Form

```njk
{# Standard layout #}
{% include "components/newsletter-form.njk" %}

{# Inline compact layout (e.g., in footer) #}
{% include "components/newsletter-form.njk" with { inline: true } %}

{# Custom text #}
{% include "components/newsletter-form.njk" with {
  title: "Get Updates",
  description: "Stay informed about our work",
  submitText: "Sign Up"
} %}
```

### Builder Promotion Form

```njk
{# Default #}
{% include "components/builder-promo-form.njk" %}

{# Custom text #}
{% include "components/builder-promo-form.njk" with {
  title: "Nominate a Builder",
  description: "Know someone doing great work?"
} %}
```

### Builder Application Form

```njk
{# Standard application #}
{% include "components/builder-application-form.njk" %}

{# Featured builder application #}
{% include "components/builder-application-form.njk" with {
  featured: true
} %}
```

## Security Considerations

1. **CORS**: Configure appropriate CORS headers for production
2. **Rate Limiting**: Enable rate limiting in BunnyCDN to prevent abuse
3. **Input Validation**: All scripts include basic validation; consider additional checks
4. **API Keys**: Never commit API keys to version control
5. **HTTPS**: Always use HTTPS for form submissions
6. **Spam Protection**: Consider adding honeypot fields or CAPTCHA for public forms

## Monitoring

1. Check BunnyCDN Edge Script logs for errors
2. Monitor Notion database for new submissions
3. Set up email notifications in Notion for new entries
4. Track form submission success rates

## Troubleshooting

### Forms not submitting

- Check browser console for JavaScript errors
- Verify Edge Script routes are configured correctly
- Check CORS headers

### Data not appearing in Notion

- Verify Notion integration token is valid
- Ensure database is shared with integration
- Check property names match exactly
- Review Edge Script logs for errors

### Newsletter signups failing

- Verify newsletter service API credentials
- Check API endpoint URLs
- Review service-specific error messages

## Alternative: Direct Notion Integration

If you prefer to bypass Bunny Edge Scripts, you can submit directly to Notion from the frontend (not recommended for production due to API key exposure):

```javascript
// Example: Direct Notion API call (development only)
const response = await fetch('https://api.notion.com/v1/pages', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_NOTION_TOKEN',
    'Content-Type': 'application/json',
    'Notion-Version': '2022-06-28'
  },
  body: JSON.stringify(notionPayload)
});
```

**Warning:** Never expose API keys in frontend code in production!

## Support

For issues with:

- **BunnyCDN**: Contact BunnyCDN support or check their documentation
- **Notion API**: See <https://developers.notion.com/>
- **Newsletter Services**: Consult your service's API documentation
