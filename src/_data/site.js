module.exports = {
  title: "Rebuild",
  description:
    "A catalyst to rebuild European social platforms by fostering connections, directing talent and getting back to building.",
  url: process.env.SITE_URL || "https://www.rebuild.net",
  apiUrl: process.env.API_URL || "https://rebuild.b-cdn.net",
  defaultImage: "/assets/images/default-og-image.jpg",
  logo: "/assets/images/logo.svg",
  author: "The Rebuild team",
  language: "en",

  // Navigation
  main_navigation: [
    {
      name: "Journey",
      url: "/journey/",
    },
    {
      name: "Directory",
      url: "/directory/",
    },
    {
      name: "Tools",
      url: "/tools/",
    },
    {
      name: "Insights",
      url: "/insights/",
    },
    {
      name: "People",
      url: "/people/",
    },
    {
      name: "About",
      url: "/about/",
    },
    {
      name: "Get in touch",
      url: "/get-in-touch/",
    },
  ],

  // Second navigation
  second_navigation: [
    {
      name: "Privacy",
      url: "/privacy/",
      clickable: true,
    },
    {
      name: "Changelog",
      url: "/changelog/",
      clickable: false,
    },
  ],
};
