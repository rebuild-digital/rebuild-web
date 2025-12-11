addEventListener("fetch", (event) => {
  const request = event.request;

  const url = new URL(request.url);

  // CORS headers

  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",

    "Access-Control-Allow-Methods": "POST, OPTIONS",

    "Access-Control-Allow-Headers": "Content-Type",
  };

  // Handle OPTIONS preflight

  if (request.method === "OPTIONS") {
    event.respondWith(new Response(null, { headers: corsHeaders }));

    return;
  }

  // Check if this is a form endpoint

  const isFormPath =
    url.pathname.includes("/api/builder-application") ||
    url.pathname.includes("/api/builder-promotion");

  // If NOT a form path, do nothing and let the request pass through

  if (!isFormPath) {
    return; // This allows the request to continue to origin without Edge Script processing
  }

  // Only process POST requests to form endpoints

  if (isFormPath && request.method !== "POST") {
    event.respondWith(
      new Response(
        JSON.stringify({ error: "Method not allowed. Please use POST." }),

        {
          status: 405,

          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      )
    );

    return;
  }

  // Handle form submission

  event.respondWith(handleFormSubmission(request, url, corsHeaders));
});

async function handleFormSubmission(request, url, corsHeaders) {
  try {
    const formData = await request.formData();

    const isPromotion = url.pathname.includes("builder-promotion");

    // Parse and validate

    const submission = parseFormData(formData, isPromotion);

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

    const notionResponse = await sendToNotion(submission.data, isPromotion);

    if (!notionResponse.ok) {
      throw new Error("Failed to create Notion entry");
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

      builderCategory: formData.get("builder_category"),

      whyPromote: formData.get("why_promote"),

      yourName: formData.get("your_name"),

      yourEmail: formData.get("your_email"),

      yourRelationship: formData.get("your_relationship") || "Not specified",

      submittedAt: new Date().toISOString(),
    };

    if (!data.builderName) errors.push("Builder name is required");

    if (!data.builderWebsite) errors.push("Builder website is required");

    if (!data.builderCategory) errors.push("Category is required");

    if (!data.whyPromote) errors.push("Reason for promotion is required");

    if (!data.yourName) errors.push("Your name is required");

    if (!data.yourEmail) errors.push("Your email is required");

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

async function sendToNotion(data, isPromotion) {
  const NOTION_API_KEY = BunnyCDN.EdgeStorage.get("NOTION_API_KEY");

  const NOTION_DATABASE_ID = BunnyCDN.EdgeStorage.get("NOTION_DATABASE_ID");

  const properties = isPromotion
    ? buildPromotionProperties(data)
    : buildApplicationProperties(data);

  const notionPayload = {
    parent: { database_id: NOTION_DATABASE_ID },

    properties: properties,
  };

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

    Category: { select: { name: data.builderCategory } },

    Description: { rich_text: [{ text: { content: data.whyPromote } }] },

    "Submitted By": {
      rich_text: [
        { text: { content: `${data.yourName} (${data.yourEmail})` } },
      ],
    },

    Relationship: { rich_text: [{ text: { content: data.yourRelationship } }] },

    Status: { select: { name: "New" } },

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

    Status: { select: { name: "New" } },

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
