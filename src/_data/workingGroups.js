// Working groups for the /beyond contribution form.
// The list lives in the Notion working groups catalogue (approved groups only), served by the
// Bunny edge script at API_URL/api/industry-org-working-groups. The build bakes in the current list,
// and the form refreshes it in the browser, so newly approved groups appear without a rebuild.
// FALLBACK is used when the endpoint is unavailable (local dev, catalogue not configured yet).

const FALLBACK = [
  {
    value: "Overall organization",
    label: "Overall organization",
    description: "Shape the structure, governance and membership model of the new organisation.",
  },
  {
    value: "Investments",
    label: "Investments",
    description: "Secure funding for the organisation and help platforms reach investors and capital.",
  },
  {
    value: "Social Design Principles",
    label: "Social Design Principles",
    description: "Develop shared principles for building responsible, people-first social platforms.",
  },
  {
    value: "Technology and data",
    label: "Technology and data",
    description: "Work on shared infrastructure, interoperability, open standards and data.",
  },
  {
    value: "Lobbying",
    label: "Lobbying",
    description: "Give the industry a clear voice towards European and national policymakers.",
  },
];

module.exports = async function () {
  const apiUrl = process.env.API_URL;
  if (!apiUrl) return FALLBACK;
  try {
    const res = await fetch(`${apiUrl}/api/industry-org-working-groups`, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) throw new Error(`status ${res.status}`);
    const { options } = await res.json();
    if (!Array.isArray(options) || options.length === 0) throw new Error("empty list");
    console.log(`Working groups fetched: ${options.length}`);
    return options;
  } catch (err) {
    console.warn(`Working groups fetch failed (${err.message}), using fallback list`);
    return FALLBACK;
  }
};
