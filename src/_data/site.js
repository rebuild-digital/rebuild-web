module.exports = {
  title: "Rebuild",
  description:
    "A catalyst to rebuild European social platforms by fostering connections, directing talent and getting back to building.",
  url: process.env.SITE_URL || "https:/www.rebuild.net",
  defaultImage: "/assets/images/default-og-image.jpg",
  logo: "/assets/images/logo.svg",
  author: "The Rebuild team",
  language: "en",

  // Navigation
  main_navigation: [
    {
      name: "Insights",
      url: "/insights/",
    },
    {
      name: "Directory",
      url: "/directory/",
    },
    {
      name: "Gatherings",
      url: "/gatherings/",
    },
    {
      name: "Frameworks",
      url: "/frameworks/",
    },
    {
      name: "Journey",
      url: "/journey/",
    },
    {
      name: "People",
      url: "/people/",
    },
    {
      name: "Get in touch",
      url: "/get-in-touch/",
    },
  ],

  // Second navigation
  second_navigation: [
    {
      name: "Changelog",
      url: "/changelog/",
    },
    {
      name: "Privacy",
      url: "/privacy/",
    },
  ],
};
