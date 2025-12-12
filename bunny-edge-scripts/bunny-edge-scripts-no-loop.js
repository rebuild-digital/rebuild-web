import * as BunnySDK from "https://esm.sh/@bunny.net/edgescript-sdk@0.11";

/**
 * Bunny Edge Script: Combined Form Handler
 *
 * Handles all form submissions for the Rebuild site:
 * - /api/builder-application (Notion)
 * - /api/builder-promotion (Notion)
 * - /api/newsletter-signup (MailerLite)
 *
 * Required Environment Variables in Bunny:
 * - NOTION_TOKEN (for builder forms)
 * - NOTION_BUILDERS_DB_ID (for builder forms)
 * - MAILERLITE_API_KEY (for newsletter)
 * - MAILERLITE_GROUP_ID (optional, for newsletter)
 */

BunnySDK.net.http

  .servePullZone({
    origin: "https://rebuild-staging.statichost.page", // ✅ Specify origin explicitly
  })

  .onOriginRequest(async (context) => {
    const request = context.request;

    const url = new URL(request.url);

    // CORS headers

    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",

      "Access-Control-Allow-Methods": "POST, OPTIONS",

      "Access-Control-Allow-Headers": "Content-Type",
    };

    // Handle OPTIONS preflight

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // Check if this is a form endpoint

    const isFormPath =
      url.pathname.includes("/api/builder-application") ||
      url.pathname.includes("/api/builder-promotion") ||
      url.pathname.includes("/api/newsletter-signup");

    // ✅ For NON-form paths, return void to let request pass through to origin

    if (!isFormPath) {
      return; // Request continues to origin automatically
    }

    // ✅ For form endpoints, only handle POST

    if (request.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed. Please use POST." }),

        {
          status: 405,

          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Handle form submission - short-circuit the request

    return await handleFormSubmission(request, url, corsHeaders);
  });

// Simple in-memory cache for deduplication (resets on edge script restart)
const recentSubmissions = new Map();
const DEDUP_WINDOW_MS = 5000; // 5 seconds

async function handleFormSubmission(request, url, corsHeaders) {
  try {
    const formData = await request.formData();

    const isNewsletter = url.pathname.includes("newsletter-signup");
    const isPromotion = url.pathname.includes("builder-promotion");

    // Handle newsletter separately (uses MailerLite, not Notion)
    if (isNewsletter) {
      return await handleNewsletterSubmission(formData, corsHeaders);
    }

    // Parse and validate (for Notion forms)

    const submission = parseFormData(formData, isPromotion);

    // Deduplicate rapid submissions based on email
    const email = submission.data?.email;
    const dedupKey = email?.toLowerCase();
    if (dedupKey) {
      const lastSubmission = recentSubmissions.get(dedupKey);
      const now = Date.now();

      if (lastSubmission && now - lastSubmission < DEDUP_WINDOW_MS) {
        console.log(
          `Duplicate submission blocked for: ${email} (within ${DEDUP_WINDOW_MS}ms)`
        );
        return new Response(
          JSON.stringify({
            success: true,
            message: isPromotion
              ? "Builder promotion submitted successfully"
              : "Builder application submitted successfully",
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

    if (!submission.isValid) {
      return new Response(
        JSON.stringify({
          error: "Missing required fields",
          details: submission.errors,
        }),

        {
          status: 400,

          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Send to Notion

    const notionResponse = await sendToNotion(
      submission.data,
      isPromotion,
      request
    );

    if (!notionResponse.ok) {
      const errorBody = await notionResponse.text();
      console.error("Notion API error:", notionResponse.status, errorBody);
      throw new Error(
        `Failed to create Notion entry: ${notionResponse.status} - ${errorBody}`
      );
    }

    return new Response(
      JSON.stringify({
        success: true,

        message: isPromotion
          ? "Builder promotion submitted successfully"
          : "Builder application submitted successfully",
      }),

      {
        status: 200,

        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Form submission error:", error);

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

function parseFormData(formData, isPromotion) {
  const errors = [];

  if (isPromotion) {
    const data = {
      type: "promotion",

      builderName: formData.get("builder_name"),

      builderWebsite: formData.get("builder_website"),

      whyPromote: formData.get("why_promote"),

      yourName: formData.get("your_name") || "Anonymous",

      yourEmail: formData.get("your_email") || "Not provided",

      yourRelationship: formData.get("your_relationship") || "Not specified",

      submittedAt: new Date().toISOString(),
    };

    if (!data.builderName) errors.push("Builder name is required");

    if (!data.builderWebsite) errors.push("Builder website is required");

    if (!data.whyPromote) errors.push("Reason for promotion is required");

    return { isValid: errors.length === 0, errors, data };
  } else {
    const data = {
      type: "application",

      applicationType: formData.get("application_type") || "standard",

      builderName: formData.get("builder_name"),

      email: formData.get("email"),

      phone: formData.get("phone") || "Not provided",

      website: formData.get("website"),

      category: formData.get("category"),

      location: formData.get("location"),

      description: formData.get("description"),

      impact: formData.get("impact"),

      stage: formData.get("stage"),

      teamSize: formData.get("team_size") || "Not specified",

      whyFeatured: formData.get("why_featured") || "",

      socialMedia: formData.get("social_media") || "",

      consent: formData.get("consent") === "on",

      newsletter: formData.get("newsletter") === "on",

      submittedAt: new Date().toISOString(),
    };

    if (!data.builderName) errors.push("Name/Organization is required");

    if (!data.email) errors.push("Email is required");

    if (!data.website) errors.push("Website is required");

    if (!data.category) errors.push("Category is required");

    if (!data.location) errors.push("Location is required");

    if (!data.description) errors.push("Description is required");

    if (!data.impact) errors.push("Impact is required");

    if (!data.stage) errors.push("Project stage is required");

    if (!data.consent) errors.push("Consent is required");

    return { isValid: errors.length === 0, errors, data };
  }
}

async function sendToNotion(data, isPromotion, request) {
  // Environment variables in Bunny EdgeScript are accessed via Deno.env
  const NOTION_API_KEY = Deno.env.get("NOTION_TOKEN");

  const NOTION_DATABASE_ID = Deno.env.get("NOTION_BUILDERS_DB_ID");

  const properties = isPromotion
    ? buildPromotionProperties(data)
    : buildApplicationProperties(data);

  const notionPayload = {
    parent: { database_id: NOTION_DATABASE_ID },

    properties: properties,
  };

  console.log("Sending to Notion:", JSON.stringify(notionPayload, null, 2));

  return fetch("https://api.notion.com/v1/pages", {
    method: "POST",

    headers: {
      Authorization: `Bearer ${NOTION_API_KEY}`,

      "Content-Type": "application/json",

      "Notion-Version": "2022-06-28",
    },

    body: JSON.stringify(notionPayload),
  });
}

function buildPromotionProperties(data) {
  return {
    Name: { title: [{ text: { content: data.builderName } }] },

    Type: { select: { name: "Promotion" } },

    Website: { url: data.builderWebsite },

    Description: { rich_text: [{ text: { content: data.whyPromote } }] },

    "Submitted By": {
      rich_text: [
        { text: { content: `${data.yourName} (${data.yourEmail})` } },
      ],
    },

    Relationship: { rich_text: [{ text: { content: data.yourRelationship } }] },

    Status: { status: { name: "New" } },

    "Submitted At": { date: { start: data.submittedAt } },
  };
}

function buildApplicationProperties(data) {
  const properties = {
    Name: { title: [{ text: { content: data.builderName } }] },

    Type: {
      select: {
        name:
          data.applicationType === "featured"
            ? "Featured Application"
            : "Standard Application",
      },
    },

    Email: { email: data.email },

    Phone: { phone_number: data.phone !== "Not provided" ? data.phone : null },

    Website: { url: data.website },

    Category: { multi_select: [{ name: data.category }] },

    Location: { select: { name: data.location } },

    Description: { rich_text: [{ text: { content: data.description } }] },

    Impact: { rich_text: [{ text: { content: data.impact } }] },

    Stage: { select: { name: data.stage } },

    "Team Size": { rich_text: [{ text: { content: data.teamSize } }] },

    Newsletter: { checkbox: data.newsletter },

    Status: { status: { name: "New" } },

    "Submitted At": { date: { start: data.submittedAt } },
  };

  if (data.whyFeatured) {
    properties["Why Featured"] = {
      rich_text: [{ text: { content: data.whyFeatured } }],
    };
  }

  if (data.socialMedia) {
    properties["Social Media"] = { url: data.socialMedia };
  }

  return properties;
}

/**
 * Newsletter Signup Handler - MailerLite Integration
 */
async function handleNewsletterSubmission(formData, corsHeaders) {
  try {
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

      if (lastSubmission && now - lastSubmission < DEDUP_WINDOW_MS) {
        console.log(
          `Duplicate newsletter submission blocked for: ${email} (within ${DEDUP_WINDOW_MS}ms)`
        );
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

    console.log(
      "Sending to MailerLite:",
      JSON.stringify(subscriberData, null, 2)
    );

    // Make API request to MailerLite
    const response = await fetch(
      "https://api.mailerlite.com/api/v2/subscribers",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-MailerLite-ApiKey": MAILERLITE_API_KEY,
        },
        body: JSON.stringify(subscriberData),
      }
    );

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
