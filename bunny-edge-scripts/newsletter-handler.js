import * as BunnySDK from "https://esm.sh/@bunny.net/edgescript-sdk@0.11";

/**
 * Bunny Edge Script: Newsletter Signup Handler - MailerLite Integration
 *
 * This script processes newsletter signup form submissions and forwards them
 * to MailerLite via their API v2.
 *
 * Setup:
 * 1. Deploy this as a Bunny Edge Script
 * 2. Configure route: POST /api/newsletter-signup
 * 3. Set environment variables in Bunny:
 *    - MAILERLITE_API_KEY (required)
 *    - MAILERLITE_GROUP_ID (optional - to add subscribers to specific group)
 * 4. Set the origin to your static site URL
 *
 * MailerLite API Documentation: https://developers.mailerlite.com/docs/
 *
 * IMPORTANT: This script uses explicit origin passthrough to prevent infinite loops.
 * Only requests to /api/newsletter-signup are intercepted.
 */

BunnySDK.net.http

  .servePullZone({
    origin: "https://rebuild-staging.statichost.page", // ✅ Update this to your origin
  })

  .onOriginRequest(async (context) => {
    const request = context.request;
    const url = new URL(request.url);

    // CORS headers
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*", // ✅ Update to your domain in production
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    // Handle OPTIONS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // ✅ CRITICAL: Only intercept newsletter signup path
    // For all other paths, return void to let request pass through to origin
    if (!url.pathname.includes("/api/newsletter-signup")) {
      return; // Request continues to origin automatically - prevents infinite loops
    }

    // ✅ Only handle POST for newsletter endpoint
    if (request.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed. Please use POST." }),
        {
          status: 405,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Handle newsletter submission - short-circuit the request
    return await handleNewsletterSubmission(request, corsHeaders);
  });

// Simple in-memory cache for deduplication (resets on edge script restart)
const recentSubmissions = new Map();
const DEDUP_WINDOW_MS = 5000; // 5 seconds

async function handleNewsletterSubmission(request, corsHeaders) {
  try {
    // Parse form data
    const formData = await request.formData();
    const email = formData.get("email");
    const firstName = formData.get("first_name");
    const lastName = formData.get("last_name");
    const interest = formData.get("interest");
    const consent = formData.get("consent");

    // Deduplicate rapid submissions of the same email
    const dedupKey = email?.toLowerCase();
    if (dedupKey) {
      const lastSubmission = recentSubmissions.get(dedupKey);
      const now = Date.now();

      if (lastSubmission && (now - lastSubmission) < DEDUP_WINDOW_MS) {
        console.log(`Duplicate submission blocked for: ${email} (within ${DEDUP_WINDOW_MS}ms)`);
        return new Response(
          JSON.stringify({
            success: true,
            message: "Successfully subscribed to newsletter",
          }),
          {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      recentSubmissions.set(dedupKey, now);

      // Clean up old entries to prevent memory bloat
      if (recentSubmissions.size > 1000) {
        const cutoff = now - DEDUP_WINDOW_MS;
        for (const [key, timestamp] of recentSubmissions.entries()) {
          if (timestamp < cutoff) {
            recentSubmissions.delete(key);
          }
        }
      }
    }

    // Validate required fields
    const validationErrors = [];
    if (!email) validationErrors.push("Email is required");
    if (!interest) validationErrors.push("Interest selection is required");
    if (!consent) validationErrors.push("Consent is required");

    if (validationErrors.length > 0) {
      return new Response(
        JSON.stringify({
          error: "Validation failed",
          details: validationErrors,
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({
          error: "Invalid email address",
          details: ["Please provide a valid email address"],
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Send to MailerLite
    const result = await sendToMailerLite({
      email,
      firstName,
      lastName,
      interest,
    });

    if (!result.success) {
      return new Response(
        JSON.stringify({
          error: result.error || "Failed to subscribe",
          details: result.details || ["Unable to complete subscription"],
        }),
        {
          status: result.status || 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        message: "Successfully subscribed to newsletter",
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Newsletter submission error:", error);

    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
}

/**
 * Send subscriber data to MailerLite
 * Uses MailerLite API v2: https://developers.mailerlite.com/docs/subscribers
 */
async function sendToMailerLite(data) {
  // ✅ CRITICAL: In Bunny Edge Scripts, use Deno.env.get() not process.env
  const MAILERLITE_API_KEY = Deno.env.get("MAILERLITE_API_KEY");
  const MAILERLITE_GROUP_ID = Deno.env.get("MAILERLITE_GROUP_ID");

  if (!MAILERLITE_API_KEY) {
    console.error("MailerLite API key not configured");
    return {
      success: false,
      error: "Service configuration error",
      details: ["Newsletter service is not properly configured"],
      status: 500,
    };
  }

  try {
    // Prepare subscriber data
    const subscriberData = {
      email: data.email,
      fields: {},
    };

    // Add name fields if provided
    if (data.firstName) {
      subscriberData.fields.name = data.firstName;
    }
    if (data.lastName) {
      subscriberData.fields.last_name = data.lastName;
    }

    // Add interest field (required)
    if (data.interest) {
      subscriberData.fields.interest = data.interest;
    }

    // Add to group if specified
    if (MAILERLITE_GROUP_ID) {
      subscriberData.groups = [MAILERLITE_GROUP_ID];
    }

    console.log("Sending to MailerLite:", JSON.stringify(subscriberData, null, 2));

    // Make API request to MailerLite
    const response = await fetch("https://api.mailerlite.com/api/v2/subscribers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-MailerLite-ApiKey": MAILERLITE_API_KEY,
      },
      body: JSON.stringify(subscriberData),
    });

    const responseData = await response.json();

    // Handle success
    if (response.ok) {
      console.log("MailerLite subscription successful:", data.email);
      return {
        success: true,
        data: responseData,
      };
    }

    // Handle MailerLite API errors
    console.error("MailerLite API error:", response.status, responseData);

    // Check for specific error cases
    if (response.status === 400) {
      const errorMessage = responseData.error?.message || "Invalid request";
      return {
        success: false,
        error: errorMessage,
        details: [errorMessage],
        status: 400,
      };
    }

    if (response.status === 401) {
      return {
        success: false,
        error: "Authentication failed",
        details: ["Invalid API credentials"],
        status: 500, // Don't expose auth issues to client
      };
    }

    // Generic error
    return {
      success: false,
      error: "Subscription failed",
      details: ["Unable to complete subscription at this time"],
      status: 500,
    };
  } catch (error) {
    console.error("MailerLite request failed:", error);
    return {
      success: false,
      error: "Network error",
      details: ["Unable to reach newsletter service"],
      status: 500,
    };
  }
}
