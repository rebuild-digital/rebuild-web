export interface NavItem {
  name: string;
  url: string;
  clickable?: boolean;
}

export interface SiteConfig {
  title: string;
  description: string;
  url: string;
  defaultImage: string;
  logo: string;
  author: string;
  language: string;
  main_navigation: NavItem[];
  second_navigation: NavItem[];
}

const site: SiteConfig = {
  title: "Rebuild",
  description: "Twelve months to rebuild European social platforms.",
  url: import.meta.env.VITE_SITE_URL || "https://rebuild.net",
  defaultImage: "/assets/images/social-3.jpg",
  logo: "/assets/images/logo.svg",
  author: "Rebuild",
  language: "en",

  main_navigation: [
    { name: "Journey", url: "/journey" },
    { name: "Directory", url: "/directory" },
    { name: "Tools", url: "/tools" },
    { name: "Insights", url: "/insights" },
    { name: "People", url: "/people" },
    { name: "About", url: "/about" },
    { name: "Get in touch", url: "/get-in-touch" },
  ],

  second_navigation: [
    { name: "Open positions", url: "/open-positions", clickable: true },
    { name: "Privacy", url: "/privacy", clickable: true },
    { name: "Changelog", url: "/changelog", clickable: true },
  ],
};

export default site;
