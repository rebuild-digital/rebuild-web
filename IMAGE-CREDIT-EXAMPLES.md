# Image Credit Component Usage

The image credit component provides a consistent way to credit images across the website.

## Basic Usage

### 1. Standalone Images

```njk
{% from "components/image-credit.njk" import imageCredit %}

<div class="relative">
  <img src="/assets/images/photo.jpg" alt="Description">
  {{ imageCredit("Photo by John Doe") }}
</div>
```

### 2. With Person Cards

Person cards automatically support image credits:

```njk
{% from "components/person-card.njk" import personCard %}

{{ personCard({
  name: "Jane Smith",
  image: "/assets/images/people/jane.jpg",
  imageCredit: "Photo by Mike Johnson",
  specialty: "Design",
  bio: "Bio text here..."
}) }}
```

### 3. Custom Positioning

The credit can be positioned in any corner:

```njk
{# Bottom right (default) #}
{{ imageCredit("Photo by John Doe") }}

{# Bottom left #}
{{ imageCredit("Photo by John Doe", position="bottom-left") }}

{# Top right #}
{{ imageCredit("Photo by John Doe", position="top-right") }}

{# Top left #}
{{ imageCredit("Photo by John Doe", position="top-left") }}
```

## Copy-Paste Templates

### Hero Image with Credit

```html
<div class="relative">
  <img src="/assets/images/hero.jpg" alt="Hero image" class="w-full h-full object-cover">
  {{ imageCredit("Photo by Photographer Name") }}
</div>
```

### Gallery Item with Credit

```html
<div class="relative aspect-video">
  <img src="/assets/images/gallery/item.jpg" alt="Gallery item" class="w-full h-full object-cover">
  {{ imageCredit("Photo by Photographer Name", position="bottom-left") }}
</div>
```

### Card Image with Credit

```html
<div class="relative aspect-square bg-muted">
  <img src="/assets/images/card.jpg" alt="Card image" class="w-full h-full object-cover">
  {{ imageCredit("Photo by Photographer Name") }}
</div>
```

## Styling Details

- **Background**: Semi-transparent black (`bg-black/50`)
- **Text**: White, small size (`text-white text-xs`)
- **Padding**: Small padding and margin (`px-2 py-1 m-2`)
- **Border**: Rounded corners for softer appearance
- **Position**: Absolute positioning within parent container

## Important Notes

1. **Parent Container**: Must have `relative` class for absolute positioning to work
2. **Image Container**: The credit sits on top of the image using absolute positioning
3. **Readability**: The semi-transparent black background ensures text is readable over any image
4. **Consistency**: Use the same format across the site (e.g., "Photo by Name" or "© Name")
