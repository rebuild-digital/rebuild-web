# Carousel Component

A fully functional, accessible carousel component for the Rebuild website inspired by the design with image and text content side-by-side.

## Features

- **Data-driven content**: All carousel slides are controlled from a JSON data file
- **Responsive design**: Works seamlessly across desktop, tablet, and mobile devices
- **Automatic rotation**: Slides auto-advance every 5 seconds
- **Multiple navigation methods**:
  - Navigation dots at the bottom
  - Previous/Next arrow buttons
  - Keyboard arrows (left/right)
  - Touch/swipe gestures on mobile
- **Accessibility features**:
  - ARIA labels for screen readers
  - Keyboard navigation support
  - Focus management
  - Live region announcements
- **User-friendly interactions**:
  - Pause on hover
  - Pause when page is hidden
  - Restart autoplay after manual navigation

## Files Created

1. **[src/_data/carousel.json](src/_data/carousel.json)** - Data file containing carousel slides
2. **[src/_includes/components/carousel.njk](src/_includes/components/carousel.njk)** - Nunjucks component template
3. **[src/scripts/carousel.js](src/scripts/carousel.js)** - JavaScript for carousel functionality
4. **[src/styles/main.css](src/styles/main.css)** - Carousel styles (added to existing file)

## Usage

### Including the Carousel

To add the carousel to any page, simply include the component:

```njk
{% include "components/carousel.njk" %}
```

### Updating Carousel Content

Edit the [src/_data/carousel.json](src/_data/carousel.json) file to add, remove, or modify slides:

```json
{
  "slides": [
    {
      "id": "slide-1",
      "headline": "Your Headline Here",
      "subheader": "Your descriptive text here",
      "image": "/assets/images/your-image.jpg",
      "ctaText": "Button Text",
      "ctaLink": "/your-link/"
    }
  ]
}
```

### Slide Properties

Each slide in the carousel requires these properties:

| Property | Type | Description | Example |
|----------|------|-------------|---------|
| `id` | String | Unique identifier for the slide | `"slide-1"` |
| `headline` | String | Main title/heading | `"Social Platform Taxonomy"` |
| `subheader` | String | Descriptive text below headline | `"Our preliminary taxonomy..."` |
| `image` | String | Path to image file | `"/assets/images/example.jpg"` |
| `ctaText` | String | Call-to-action button text | `"See the frameworks"` |
| `ctaLink` | String | URL for the CTA button (internal or external) | `"/frameworks/"` |
| `bgColor` | String | Background color for the slide (hex, rgb, or CSS color name) | `"#e8e8e8"` or `"rgb(232, 232, 232)"` |

## Customization

### Styling

All carousel styles are defined in [src/styles/main.css](src/styles/main.css) under the "Carousel Component" section. Key customizable aspects:

- **Background**: Change the gradient in `.carousel-container`
- **Colors**: Modify text colors, button styles, navigation dots
- **Spacing**: Adjust padding, margins, gaps
- **Transitions**: Change animation duration and timing
- **Responsive breakpoints**: Modify mobile/tablet layouts

### Autoplay Timing

To change the autoplay delay, edit the `autoplayDelay` constant in [src/scripts/carousel.js](src/scripts/carousel.js):

```javascript
const autoplayDelay = 5000; // 5 seconds (change to desired milliseconds)
```

### Image Layout

To change which side the image appears on, modify the `order-` classes in [carousel.njk](src/_includes/components/carousel.njk):

```njk
<!-- Image on left (current) -->
<div class="carousel-image-col order-1 md:order-1">

<!-- Image on right -->
<div class="carousel-image-col order-2 md:order-2">
```

## Browser Support

The carousel works in all modern browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Accessibility

The carousel includes several accessibility features:

1. **Keyboard Navigation**: Use arrow keys to navigate between slides
2. **ARIA Labels**: All interactive elements have descriptive labels
3. **Focus Management**: Proper focus indicators for keyboard users
4. **Screen Reader Support**: Live region announces slide changes
5. **Reduced Motion**: Respects user's motion preferences

## Examples

### Example 1: Homepage Carousel

The carousel is currently used on the homepage at [src/index.html](src/index.html):

```njk
<section id="explore" class="py-4xl">
  {% include "components/carousel.njk" %}
</section>
```

### Example 2: Custom Section

You can include the carousel in any section:

```njk
<section class="my-custom-section">
  <h1>Featured Content</h1>
  {% include "components/carousel.njk" %}
</section>
```

## Troubleshooting

### Carousel not appearing

1. Ensure [carousel.json](src/_data/carousel.json) has valid data
2. Check that images exist at the specified paths
3. Verify the carousel script is loaded in [base.njk](src/_includes/layouts/base.njk)

### Navigation not working

1. Check browser console for JavaScript errors
2. Ensure [carousel.js](src/scripts/carousel.js) is being served correctly
3. Verify the carousel container has the correct class names

### Styles not applying

1. Run `npm run build:css` to rebuild CSS
2. Clear browser cache
3. Check that [main.css](src/styles/main.css) includes carousel styles

## Future Enhancements

Potential improvements for the carousel:

- [ ] Add fade transition option
- [ ] Support for video backgrounds
- [ ] Multiple images per slide
- [ ] Progress bar indicator
- [ ] Thumbnail navigation
- [ ] Lazy loading for images
- [ ] Integration with CMS for dynamic content

## Support

For issues or questions about the carousel component, refer to:
- [CLAUDE.md](CLAUDE.md) - Project guidelines
- Component code comments
- This documentation file
