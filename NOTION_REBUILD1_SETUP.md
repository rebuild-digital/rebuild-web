# Notion Database Setup for Rebuild1 Registrations

This document describes how to set up the Notion database to receive submissions from the Rebuild1 registration form.

## Database Creation

1. Create a new database in Notion
2. Name it "Rebuild1 Registrations" (or your preferred name)
3. Get the database ID from the URL (the part after the workspace name and before the `?v=`)

## Required Properties

The database must have the following properties with exact names and types:

| Property Name  | Type      | Configuration                                     |
| -------------- | --------- | ------------------------------------------------- |
| `Name`         | Title     | (default title property)                          |
| `Email`        | Email     | -                                                 |
| `Organisation` | Rich Text | -                                                 |
| `Role`         | Rich Text | -                                                 |
| `Country`      | Select    | Must include all European countries from the form |
| `Status`       | Status    | Must have "New" as an option                      |
| `Submitted At` | Date      | -                                                 |

## Country Options

The `Country` select property must include these options (matching the form):

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

## Status Options

The `Status` status property must have at least:

- New (required - this is the default for new submissions)
- Reviewed (optional)
- Approved (optional)
- Declined (optional)

You can add additional status options as needed for your workflow.

## Environment Variable

After creating the database, add the database ID to your environment variables:

### Local Development

Add to `.env`:

```
NOTION_REBUILD1_DB_ID=your_database_id_here
```

### Bunny Edge Scripts

Add the environment variable in the Bunny CDN dashboard:

- Navigate to your Edge Script configuration
- Add environment variable: `NOTION_REBUILD1_DB_ID`
- Value: Your Notion database ID

### Vercel Deployment

Add to Vercel environment variables:

- Go to Project Settings > Environment Variables
- Add `NOTION_REBUILD1_DB_ID` with your database ID
- Available for: Production, Preview, Development (select as needed)

## MailerLite Confirmation Emails Setup

The form is configured to automatically add registrants who opt-in to a MailerLite group, which can trigger an automatic confirmation email.

### Step 1: Create Custom Fields in MailerLite

✅ **Already completed** - These custom fields exist in your MailerLite account:

- `organisation` (Text field)
- `role` (Text field)
- `country` (Text field) - Note: case-sensitive, must be lowercase

These fields will store additional information about Rebuild1 registrants.

### Step 2: Create a MailerLite Group

✅ **Already completed** - Group ID: `175939531088856249`

### Step 3: Create an Automation

✅ **Already completed** - Automation is set up and activated

### How It Works

When someone submits the Rebuild1 registration form:

1. Form data is validated
2. **If newsletter checkbox is checked**:
   - User is added to MailerLite with custom fields (name, organisation, role, country)
   - User is added to the Rebuild1 group (specified by `MAILERLITE_GROUP_ID`)
   - MailerLite automation triggers and sends confirmation email
3. Registration is saved to Notion database

### Environment Variables Required

Set these in Bunny CDN:

1. **MAILERLITE_REBUILD1_GROUP_ID** (for Rebuild1 event registrations)
   - Navigate to your Edge Script configuration
   - Add environment variable: `MAILERLITE_REBUILD1_GROUP_ID`
   - Value: `175939531088856249`

2. **MAILERLITE_GROUP_ID** (for general newsletter signups - already exists)
   - Current value: `173493800144995520`
   - Keep this as-is

**Note**: The Rebuild1 form will use `MAILERLITE_REBUILD1_GROUP_ID` to add registrants to the event group, which triggers the confirmation email automation. The general newsletter form continues to use `MAILERLITE_GROUP_ID`.

## Testing the Integration

1. Ensure the database is created with all required properties
2. Set the environment variable in Bunny CDN
3. Submit a test form from your site
4. Check the Notion database for a new entry
5. Verify all fields are populated correctly

## Troubleshooting

### Submission fails with 400 error

- Check that all property names match exactly (case-sensitive)
- Verify the Country value exists in the select options
- Ensure Status has "New" as an option

### Submission fails with 401 error

- Verify `NOTION_TOKEN` environment variable is set correctly
- Check that the integration has access to the database

### Submission fails with 404 error

- Verify `NOTION_REBUILD1_DB_ID` is set correctly
- Check that the database ID is valid and accessible

### Fields are empty in Notion

- Check the edge script console logs for errors
- Verify form field names match the parsing logic in edge-script.js
- Ensure the form includes the hidden field: `form_type: application_rebuild1`

## Database Access

Make sure your Notion integration has access to this database:

1. Open the database in Notion
2. Click "•••" (more options) in the top right
3. Select "Add connections"
4. Add your Rebuild integration

## Related Files

- Form component: `/src/_includes/components/forms/simple-registration-form.njk`
- Form endpoint: `/src/forms/application-rebuild1.html`
- Edge script handler: `/src/scripts/edge-script.js` (lines 252-269, 357-359, 490-500)
- Form triggers: `/src/scripts/form-triggers.js` (line 17)
