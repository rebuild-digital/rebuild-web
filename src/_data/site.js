module.exports = {
  title: "Rebuild",
  description: "12 months to catalyse European social platforms",
  url: process.env.SITE_URL,
  apiUrl: process.env.API_URL,
  defaultImage: "/assets/images/social-3.jpg",
  logo: "/assets/images/logo.svg",
  author: "Rebuild",
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
