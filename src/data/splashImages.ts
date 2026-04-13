export interface SplashImage {
  src: string;
  alt: string;
  showOnMobile: boolean;
}

const splashImages: SplashImage[] = [
  {
    src: "/assets/images/splash-0.jpg",
    alt: "Rebuild gathering participants collaborating",
    showOnMobile: true,
  },
  {
    src: "/assets/images/splash-2.jpg",
    alt: "European social platforms ecosystem",
    showOnMobile: true,
  },
  {
    src: "/assets/images/splash-3.jpg",
    alt: "Rebuild community building connections",
    showOnMobile: false,
  },
  {
    src: "/assets/images/splash-4.jpg",
    alt: "Social platform builders in action",
    showOnMobile: false,
  },
  {
    src: "/assets/images/splash-5.jpg",
    alt: "Collaborative innovation at Rebuild",
    showOnMobile: true,
  },
  {
    src: "/assets/images/splash-6.jpg",
    alt: "More collaborative innovation at Rebuild",
    showOnMobile: true,
  },
];

export default splashImages;
