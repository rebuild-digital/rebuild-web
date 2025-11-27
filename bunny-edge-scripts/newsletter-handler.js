/**
 * Bunny Edge Script: Newsletter Signup Handler
 *
 * This script processes newsletter signup form submissions and forwards them
 * to your marketing newsletter service (e.g., Mailchimp, ConvertKit, etc.)
 *
 * Setup:
 * 1. Deploy this as a Bunny Edge Script
 * 2. Configure the route: POST /api/newsletter-signup
 * 3. Set environment variables for your newsletter service API
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
    // Parse form data
    const formData = await request.formData();
    const email = formData.get('email');
    const firstName = formData.get('first_name');
    const lastName = formData.get('last_name');
    const consent = formData.get('consent');

    // Validate required fields
    if (!email || !consent) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email address' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Example: Send to Mailchimp
    // Replace with your actual newsletter service API
    const newsletterServiceResponse = await sendToNewsletterService({
      email,
      firstName,
      lastName
    });

    if (!newsletterServiceResponse.ok) {
      throw new Error('Newsletter service error');
    }

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Successfully subscribed to newsletter'
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Newsletter signup error:', error);

    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: 'Failed to process newsletter signup'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
}

/**
 * Send data to newsletter service
 * Replace this with your actual newsletter service integration
 */
async function sendToNewsletterService(data) {
  // Example: Mailchimp API integration
  // const MAILCHIMP_API_KEY = BunnyCDN.EdgeStorage.get('MAILCHIMP_API_KEY');
  // const MAILCHIMP_LIST_ID = BunnyCDN.EdgeStorage.get('MAILCHIMP_LIST_ID');
  // const MAILCHIMP_DC = BunnyCDN.EdgeStorage.get('MAILCHIMP_DC'); // e.g., 'us1'

  /* Example Mailchimp request:
  return fetch(`https://${MAILCHIMP_DC}.api.mailchimp.com/3.0/lists/${MAILCHIMP_LIST_ID}/members`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${MAILCHIMP_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email_address: data.email,
      status: 'subscribed',
      merge_fields: {
        FNAME: data.firstName || '',
        LNAME: data.lastName || ''
      }
    })
  });
  */

  // Example: ConvertKit API integration
  // const CONVERTKIT_API_KEY = BunnyCDN.EdgeStorage.get('CONVERTKIT_API_KEY');
  // const CONVERTKIT_FORM_ID = BunnyCDN.EdgeStorage.get('CONVERTKIT_FORM_ID');

  /* Example ConvertKit request:
  return fetch(`https://api.convertkit.com/v3/forms/${CONVERTKIT_FORM_ID}/subscribe`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      api_key: CONVERTKIT_API_KEY,
      email: data.email,
      first_name: data.firstName || '',
      last_name: data.lastName || ''
    })
  });
  */

  // Placeholder: Log and return success for testing
  console.log('Newsletter signup:', data);
  return { ok: true };
}
