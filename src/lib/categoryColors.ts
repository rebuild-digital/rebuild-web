export interface ColorSet {
  bg: string;
  text: string;
}

export const categoryColors: Record<string, ColorSet> = {
  Bundled: { bg: "bg-red-tint", text: "text-dark" },
  Community: { bg: "bg-blue-tint", text: "text-dark" },
  Groups: { bg: "bg-green-tint", text: "text-dark" },
  Networking: { bg: "bg-orange-tint", text: "text-dark" },
  Messaging: { bg: "bg-blue-tint", text: "text-dark" },
  Microblogging: { bg: "bg-red-tint", text: "text-dark" },
  Forum: { bg: "bg-red-tint", text: "text-dark" },
  Dating: { bg: "bg-blush-tint", text: "text-dark" },
  Events: { bg: "bg-orange-tint", text: "text-dark" },
  Location: { bg: "bg-green-tint", text: "text-dark" },
  "Resource sharing": { bg: "bg-blonde-tint", text: "text-dark" },
  "Photo sharing": { bg: "bg-blush-tint", text: "text-dark" },
  "Video sharing": { bg: "bg-blonde-tint", text: "text-dark" },
  "Creator platform": { bg: "bg-blue-tint", text: "text-dark" },
  "Social marketplace": { bg: "bg-orange-tint", text: "text-dark" },
  Other: { bg: "bg-blonde-tint", text: "text-dark" },
};

export const categoryOrder = [
  "Bundled",
  "Social marketplace",
  "Creator platform",
  "Location",
  "Resource sharing",
  "Dating",
  "Networking",
  "Forum",
  "Messaging",
  "Groups",
  "Video sharing",
  "Photo sharing",
  "Microblogging",
  "Community",
  "Events",
  "Other",
];

export function getCategoryColors(category: string): ColorSet {
  return categoryColors[category] ?? categoryColors["Other"];
}

export function sortCategories(categories: string[]): string[] {
  return [...categories].sort((a, b) => {
    const ia = categoryOrder.indexOf(a);
    const ib = categoryOrder.indexOf(b);
    if (ia !== -1 && ib !== -1) return ia - ib;
    if (ia !== -1) return -1;
    if (ib !== -1) return 1;
    return a.localeCompare(b);
  });
}

// Tag color palette (for insights)
export const tagColors = [
  { bg: "bg-orange", border: "border-dark", text: "text-dark" },
  { bg: "bg-green", border: "border-dark", text: "text-dark" },
  { bg: "bg-blue-tint", border: "border-dark", text: "text-dark" },
  { bg: "bg-red-tint", border: "border-dark", text: "text-dark" },
  { bg: "bg-blush", border: "border-dark", text: "text-dark" },
  { bg: "bg-light", border: "border-blue", text: "text-blue" },
];

export function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

export function getTagColor(tagName: string) {
  const hash = hashString(tagName.toLowerCase());
  return tagColors[hash % tagColors.length];
}
