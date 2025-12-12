import * as BunnySDK from "https://esm.sh/@bunny.net/edgescript-sdk@0.11";

// Middleware script with automatic origin passthrough

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
      url.pathname.includes("/api/builder-promotion");

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

    const isPromotion = url.pathname.includes("builder-promotion");

    // Parse and validate

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

    Category: { select: { name: data.category } },

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
