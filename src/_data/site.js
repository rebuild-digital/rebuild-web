module.exports = {
  title: "rebuild.",
  description: "Building a better future together",
  url: process.env.SITE_URL || "https:/www.rebuild.net",
  defaultImage: "/assets/images/default-og-image.jpg",
  author: "rebuild team",
  language: "en",

  // Navigation
  main_navigation: [
    {
      name: "Home",
      url: "/",
    },
    {
      name: "Insights",
      url: "/insights/",
    },
    {
      name: "Catalog",
      url: "/catalog/",
    },
    {
      name: "Gatherings",
      url: "/gatherings/",
    },
    {
      name: "Journey",
      url: "/journey/",
    },
    {
      name: "Get in toch",
      url: "/get-in-touch/",
    },
  ],

  // Second navigation
  second_navigation: [
    {
      name: "Team",
      url: "/team/",
    },
    {
      name: "Changelog",
      url: "/changelog/",
    },
    {
      name: "Privacy",
      url: "/privacy/",
    },
  ],

  // Social links (optional)
  social: {
    // twitter: "https://twitter.com/rebuild",
    // linkedin: "https://linkedin.com/company/rebuild",
  },
};
