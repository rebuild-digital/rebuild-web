module.exports = {
  title: "rebuild.",
  description: "A catalyst to rebuild European social platforms by fostering connections, directing talent and getting back to building.",
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
      name: "Get in touch",
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
