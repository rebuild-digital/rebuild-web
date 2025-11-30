/**
 * Bunny Edge Script: Builder Promotion & Application Handler
 *
 * This script processes both builder promotion and application form submissions
 * and forwards them to a Notion database.
 *
 * Setup:
 *
 * 1. Create a Notion Integration and Database:
 *    a. Go to https://www.notion.so/my-integrations
 *    b. Click "+ New integration" and give it a name (e.g., "Builder Forms")
 *    c. Copy the "Internal Integration Token" (starts with "secret_")
 *    d. Create a new database in Notion with these properties:
 *       - Name (Title)
 *       - Type (Select: "Promotion", "Standard Application", "Featured Application")
 *       - Website (URL)
 *       - Email (Email)
 *       - Phone (Phone)
 *       - Category (Select)
 *       - Location (Select)
 *       - Description (Text)
 *       - Impact (Text)
 *       - Stage (Select)
 *       - Team Size (Text)
 *       - Newsletter (Checkbox)
 *       - Submitted By (Text)
 *       - Relationship (Text)
 *       - Why Featured (Text)
 *       - Social Media (URL)
 *       - Status (Select: "New", "Reviewing", "Approved", "Rejected")
 *       - Submitted At (Date)
 *    e. Click "..." on your database → "Add connections" → Select your integration
 *    f. Copy the database ID from the URL: notion.so/workspace/DATABASE_ID?v=...
 *
 * 2. Deploy as a Bunny Edge Script:
 *    a. Log in to bunny.net dashboard
 *    b. Navigate to Edge Platform → Scripting
 *    c. Click "Add Script" and provide a name (e.g., "Builder Forms Handler")
 *    d. Select "Standalone" type with "Default standalone" template
 *    e. After creation, note the "Hostname" shown (e.g., script-abc123.b-cdn.net)
 *       This is your Edge Script URL that you'll use in step 3
 *    f. Copy this entire script into the editor
 *    g. Update lines 189-190 with your actual Notion credentials:
 *       - Replace 'your-notion-integration-token' with your integration token
 *       - Replace 'your-notion-database-id' with your database ID
 *    h. Uncomment lines 203-212 (the actual Notion API call)
 *    i. Comment out lines 216-217 (the placeholder response)
 *    j. Click "Save" then "Publish" to deploy (changes apply immediately)
 *
 *    Note: If you see a "508 Loop Detected" error in the preview pane, this is
 *    expected for standalone scripts. The script should work correctly once
 *    deployed and accessed via its hostname URL.
 *
 * 3. Configure Your Frontend:
 *    Update your form submissions to POST to:
 *    - https://[your-edge-script-url]/api/builder-promotion
 *    - https://[your-edge-script-url]/api/builder-application
 *    (The unique URL is provided after creating the Edge Script)
 *
 * 4. Update CORS Settings (Production):
 *    Change line 28 from '*' to your actual domain:
 *    'Access-Control-Allow-Origin': 'https://yourdomain.com'
 *
 * Note: The Notion API version in this script (2022-06-28) should be updated
 * to the latest version. Check https://developers.notion.com/reference/versioning
 * for the current version and update line 209 accordingly.
 */

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  // Only handle POST requests
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  // Add CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*', // Configure this to your domain in production
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(request.url);
    const formData = await request.formData();

    // Determine if this is a promotion or application
    const isPromotion = url.pathname.includes('builder-promotion');
    const isApplication = url.pathname.includes('builder-application');

    if (!isPromotion && !isApplication) {
      return new Response(
        JSON.stringify({ error: 'Invalid endpoint' }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Parse and validate form data
    const submission = parseFormData(formData, isPromotion);

    if (!submission.isValid) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields', details: submission.errors }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Send to Notion
    const notionResponse = await sendToNotion(submission.data, isPromotion);

    if (!notionResponse.ok) {
      throw new Error('Failed to create Notion entry');
    }

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        message: isPromotion
          ? 'Builder promotion submitted successfully'
          : 'Builder application submitted successfully'
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Form submission error:', error);

    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: 'Failed to process submission'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
}

/**
 * Parse and validate form data
 */
function parseFormData(formData, isPromotion) {
  const errors = [];

  if (isPromotion) {
    // Builder Promotion fields
    const data = {
      type: 'promotion',
      builderName: formData.get('builder_name'),
      builderWebsite: formData.get('builder_website'),
      builderCategory: formData.get('builder_category'),
      whyPromote: formData.get('why_promote'),
      yourName: formData.get('your_name'),
      yourEmail: formData.get('your_email'),
      yourRelationship: formData.get('your_relationship') || 'Not specified',
      submittedAt: new Date().toISOString()
    };

    // Validate required fields
    if (!data.builderName) errors.push('Builder name is required');
    if (!data.builderWebsite) errors.push('Builder website is required');
    if (!data.builderCategory) errors.push('Category is required');
    if (!data.whyPromote) errors.push('Reason for promotion is required');
    if (!data.yourName) errors.push('Your name is required');
    if (!data.yourEmail) errors.push('Your email is required');

    return {
      isValid: errors.length === 0,
      errors,
      data
    };
  } else {
    // Builder Application fields
    const data = {
      type: 'application',
      applicationType: formData.get('application_type') || 'standard',
      builderName: formData.get('builder_name'),
      email: formData.get('email'),
      phone: formData.get('phone') || 'Not provided',
      website: formData.get('website'),
      category: formData.get('category'),
      location: formData.get('location'),
      description: formData.get('description'),
      impact: formData.get('impact'),
      stage: formData.get('stage'),
      teamSize: formData.get('team_size') || 'Not specified',
      whyFeatured: formData.get('why_featured') || '',
      socialMedia: formData.get('social_media') || '',
      consent: formData.get('consent') === 'on',
      newsletter: formData.get('newsletter') === 'on',
      submittedAt: new Date().toISOString()
    };

    // Validate required fields
    if (!data.builderName) errors.push('Name/Organization is required');
    if (!data.email) errors.push('Email is required');
    if (!data.website) errors.push('Website is required');
    if (!data.category) errors.push('Category is required');
    if (!data.location) errors.push('Location is required');
    if (!data.description) errors.push('Description is required');
    if (!data.impact) errors.push('Impact is required');
    if (!data.stage) errors.push('Project stage is required');
    if (!data.consent) errors.push('Consent is required');

    return {
      isValid: errors.length === 0,
      errors,
      data
    };
  }
}

/**
 * Send data to Notion database
 */
async function sendToNotion(data, isPromotion) {
  // Get Notion credentials from environment variables
  // const NOTION_API_KEY = BunnyCDN.EdgeStorage.get('NOTION_API_KEY');
  // const NOTION_DATABASE_ID = BunnyCDN.EdgeStorage.get('NOTION_DATABASE_ID');

  // For testing, use placeholder values
  const NOTION_API_KEY = 'your-notion-integration-token';
  const NOTION_DATABASE_ID = 'your-notion-database-id';

  // Build Notion page properties based on submission type
  const properties = isPromotion
    ? buildPromotionProperties(data)
    : buildApplicationProperties(data);

  const notionPayload = {
    parent: { database_id: NOTION_DATABASE_ID },
    properties: properties
  };

  // Uncomment to send to actual Notion API
  /*
  return fetch('https://api.notion.com/v1/pages', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${NOTION_API_KEY}`,
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28'
    },
    body: JSON.stringify(notionPayload)
  });
  */

  // Placeholder: Log and return success for testing
  console.log('Notion submission:', notionPayload);
  return { ok: true };
}

/**
 * Build Notion properties for builder promotion
 */
function buildPromotionProperties(data) {
  return {
    'Name': {
      title: [{ text: { content: data.builderName } }]
    },
    'Type': {
      select: { name: 'Promotion' }
    },
    'Website': {
      url: data.builderWebsite
    },
    'Category': {
      select: { name: data.builderCategory }
    },
    'Description': {
      rich_text: [{ text: { content: data.whyPromote } }]
    },
    'Submitted By': {
      rich_text: [{ text: { content: `${data.yourName} (${data.yourEmail})` } }]
    },
    'Relationship': {
      rich_text: [{ text: { content: data.yourRelationship } }]
    },
    'Status': {
      select: { name: 'New' }
    },
    'Submitted At': {
      date: { start: data.submittedAt }
    }
  };
}

/**
 * Build Notion properties for builder application
 */
function buildApplicationProperties(data) {
  const properties = {
    'Name': {
      title: [{ text: { content: data.builderName } }]
    },
    'Type': {
      select: { name: data.applicationType === 'featured' ? 'Featured Application' : 'Standard Application' }
    },
    'Email': {
      email: data.email
    },
    'Phone': {
      phone_number: data.phone !== 'Not provided' ? data.phone : null
    },
    'Website': {
      url: data.website
    },
    'Category': {
      select: { name: data.category }
    },
    'Location': {
      select: { name: data.location }
    },
    'Description': {
      rich_text: [{ text: { content: data.description } }]
    },
    'Impact': {
      rich_text: [{ text: { content: data.impact } }]
    },
    'Stage': {
      select: { name: data.stage }
    },
    'Team Size': {
      rich_text: [{ text: { content: data.teamSize } }]
    },
    'Newsletter': {
      checkbox: data.newsletter
    },
    'Status': {
      select: { name: 'New' }
    },
    'Submitted At': {
      date: { start: data.submittedAt }
    }
  };

  // Add featured-specific fields if applicable
  if (data.whyFeatured) {
    properties['Why Featured'] = {
      rich_text: [{ text: { content: data.whyFeatured } }]
    };
  }

  if (data.socialMedia) {
    properties['Social Media'] = {
      url: data.socialMedia
    };
  }

  return properties;
}
