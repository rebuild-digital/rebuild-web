module.exports = {
  title: "Rebuild",
  description: "Building a better future together",
  url: process.env.SITE_URL || "https://yoursite.com",
  defaultImage: "/assets/images/default-og-image.jpg",
  author: "Rebuild Initiative",
  language: "en",

  // Navigation
  navigation: [
    {
      name: "Home",
      url: "/"
    },
    {
      name: "Journal",
      url: "/journal/"
    },
    {
      name: "Builders",
      url: "/builders/"
    },
    {
      name: "Gatherings",
      url: "/gatherings/"
    },
    {
      name: "About",
      url: "/about/"
    },
    {
      name: "Contact",
      url: "/contact/"
    }
  ],

  // Social links (optional)
  social: {
    // twitter: "https://twitter.com/rebuild",
    // linkedin: "https://linkedin.com/company/rebuild",
  }
};
