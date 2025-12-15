# Form Components Guide

This guide explains how to use the form components in the Rebuild website.

## Overview

The form system consists of:

1. **Base Form Component** ([form.njk](src/_includes/components/form.njk)) - A flexible, extensible form builder
2. **Newsletter Form** ([newsletter-form.njk](src/_includes/components/newsletter-form.njk)) - Newsletter signup with inline and standard layouts
3. **Builder Promotion Form** ([builder-promo-form.njk](src/_includes/components/builder-promo-form.njk)) - Nominate builders for the directory
4. **Builder Application Form** ([builder-application-form.njk](src/_includes/components/builder-application-form.njk)) - Apply to join the directory

All forms follow the site's design system with:

- Tailwind CSS styling
- Consistent border and shadow treatments
- Focus states and accessibility
- Built-in validation and error handling

## Quick Start

### 1. Newsletter Signup

**Standard Layout:**

```njk
{% include "components/newsletter-form.njk" %}
```

**Inline Layout (for footer/sidebar):**

```njk
{% include "components/newsletter-form.njk" with { inline: true } %}
```

### 2. Promote a Builder

```njk
{% include "components/builder-promo-form.njk" %}
```

### 3. Builder Application

**Standard Application:**

```njk
{% include "components/builder-application-form.njk" %}
```

**Featured Builder Application:**

```njk
{% include "components/builder-application-form.njk" with { featured: true } %}
```

## Base Form Component

The base form component is highly flexible and can be extended for any use case.

### Basic Usage

```njk
{% set myFormFields = [
  {
    type: 'text',
    name: 'full_name',
    label: 'Full Name',
    required: true
  },
  {
    type: 'email',
    name: 'email',
    label: 'Email Address',
    required: true
  },
  {
    type: 'textarea',
    name: 'message',
    label: 'Message',
    rows: 5,
    required: true
  }
] %}

{% include "components/form.njk" with {
  formId: 'contact-form',
  action: '/api/contact',
  title: 'Get in Touch',
  description: 'Send us a message',
  submitText: 'Send Message',
  fields: myFormFields
} %}
```

### Field Types

#### Text Input

```njk
{
  type: 'text',
  name: 'field_name',
  label: 'Field Label',
  placeholder: 'Enter text...',
  required: true,
  helpText: 'Additional help text',
  class: 'custom-class'
}
```

#### Email Input

```njk
{
  type: 'email',
  name: 'email',
  label: 'Email Address',
  placeholder: 'your@email.com',
  required: true
}
```

#### Phone Input

```njk
{
  type: 'tel',
  name: 'phone',
  label: 'Phone Number',
  placeholder: '+45 12 34 56 78',
  required: false
}
```

#### URL Input

```njk
{
  type: 'url',
  name: 'website',
  label: 'Website',
  placeholder: 'https://example.com',
  required: false
}
```

#### Textarea

```njk
{
  type: 'textarea',
  name: 'description',
  label: 'Description',
  placeholder: 'Tell us more...',
  rows: 6,
  required: true
}
```

#### Select Dropdown

```njk
{
  type: 'select',
  name: 'country',
  label: 'Country',
  placeholder: 'Select your country',
  required: true,
  options: ['Denmark', 'Sweden', 'Norway', 'Finland']
}
```

**With custom values:**

```njk
{
  type: 'select',
  name: 'category',
  label: 'Category',
  required: true,
  options: [
    { value: 'tech', label: 'Technology' },
    { value: 'social', label: 'Social Enterprise' }
  ]
}
```

#### Radio Buttons

```njk
{
  type: 'radio',
  name: 'experience',
  label: 'Experience Level',
  required: true,
  options: ['Beginner', 'Intermediate', 'Advanced']
}
```

**With custom values:**

```njk
{
  type: 'radio',
  name: 'size',
  label: 'Organization Size',
  required: true,
  options: [
    { value: 'small', label: '1-10 people' },
    { value: 'medium', label: '11-50 people' },
    { value: 'large', label: '50+ people' }
  ]
}
```

#### Checkbox

```njk
{
  type: 'checkbox',
  name: 'agree_terms',
  label: 'I agree to the terms and conditions',
  required: true
}
```

### Form Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `formId` | string | Yes | - | Unique form identifier |
| `action` | string | Yes | - | Form submission URL |
| `method` | string | No | 'POST' | HTTP method |
| `title` | string | No | - | Form title |
| `description` | string | No | - | Form description |
| `submitText` | string | No | 'Submit' | Submit button text |
| `submitVariant` | string | No | 'primary' | Button style: 'primary', 'secondary', 'outline' |
| `fields` | array | Yes | - | Array of field objects |
| `successMessage` | string | No | Default | Success message text |
| `errorMessage` | string | No | Default | Error message text |

## Creating Custom Forms

### Example: Contact Form

```njk
---
layout: layouts/default.njk
title: Contact Us
---

<section class="py-xl">
  <div class="container max-w-4xl mx-auto px-md">
    {% set contactFields = [
      {
        type: 'text',
        name: 'name',
        label: 'Your Name',
        required: true
      },
      {
        type: 'email',
        name: 'email',
        label: 'Email Address',
        required: true
      },
      {
        type: 'select',
        name: 'subject',
        label: 'Subject',
        required: true,
        options: [
          'General Inquiry',
          'Partnership Opportunity',
          'Media Request',
          'Other'
        ]
      },
      {
        type: 'textarea',
        name: 'message',
        label: 'Message',
        rows: 8,
        required: true
      },
      {
        type: 'checkbox',
        name: 'copy',
        label: 'Send me a copy of this message',
        required: false
      }
    ] %}

    {% include "components/form.njk" with {
      formId: 'contact-form',
      action: '/api/contact',
      title: 'Get in Touch',
      description: 'Have questions or want to collaborate? Send us a message.',
      submitText: 'Send Message',
      submitVariant: 'primary',
      fields: contactFields,
      successMessage: 'Thanks for reaching out! We\'ll get back to you soon.',
      errorMessage: 'Failed to send message. Please try emailing us directly.'
    } %}
  </div>
</section>
```

### Example: Event Registration

```njk
{% set eventFields = [
  {
    type: 'text',
    name: 'full_name',
    label: 'Full Name',
    required: true
  },
  {
    type: 'email',
    name: 'email',
    label: 'Email',
    required: true
  },
  {
    type: 'tel',
    name: 'phone',
    label: 'Phone Number',
    required: false
  },
  {
    type: 'select',
    name: 'ticket_type',
    label: 'Ticket Type',
    required: true,
    options: [
      { value: 'early', label: 'Early Bird - €50' },
      { value: 'regular', label: 'Regular - €75' },
      { value: 'vip', label: 'VIP - €150' }
    ]
  },
  {
    type: 'radio',
    name: 'dietary',
    label: 'Dietary Requirements',
    options: ['None', 'Vegetarian', 'Vegan', 'Gluten-free', 'Other']
  },
  {
    type: 'textarea',
    name: 'special_requirements',
    label: 'Special Requirements',
    placeholder: 'Any accessibility needs or other requirements?',
    rows: 3,
    required: false
  },
  {
    type: 'checkbox',
    name: 'terms',
    label: 'I agree to the event terms and conditions',
    required: true
  }
] %}

{% include "components/form.njk" with {
  formId: 'event-registration',
  action: '/api/register-event',
  title: 'Register for Event',
  submitText: 'Complete Registration',
  fields: eventFields
} %}
```

## Styling and Customization

### Custom Field Classes

Add custom CSS classes to individual fields:

```njk
{
  type: 'text',
  name: 'custom_field',
  label: 'Custom Field',
  class: 'bg-gray text-dark'
}
```

### Button Variants

Choose from three button styles:

- `primary` - Blue background (default)
- `secondary` - Red background
- `outline` - Transparent with border

```njk
{% include "components/form.njk" with {
  submitVariant: 'secondary'
} %}
```

## Form Handling

### JavaScript

Each form includes built-in JavaScript that:

1. Prevents default form submission
2. Sends data via `fetch` API
3. Shows success/error messages
4. Resets form on success
5. Re-enables submit button after completion

### Backend Integration

Forms submit to the specified `action` URL. You'll need to:

1. **Set up Bunny Edge Scripts** (see [bunny-edge-scripts/README.md](bunny-edge-scripts/README.md))
2. **Configure API endpoints** to match form actions
3. **Test submissions** to ensure data flows correctly

### AJAX Form Submission

Forms automatically use AJAX. To customize the submission handler:

```javascript
// Get form element
const form = document.getElementById('your-form-id');

// Add custom logic after the built-in handler
form.addEventListener('submit', async (e) => {
  // Your custom code here
}, true); // Use capture phase
```

## Accessibility

All forms include:

- Proper label associations
- Required field indicators
- Focus states
- Error messages
- Screen reader support
- Keyboard navigation

## Best Practices

1. **Always provide labels** for form fields
2. **Mark required fields** explicitly
3. **Use appropriate input types** (email, tel, url, etc.)
4. **Add help text** for complex fields
5. **Test on mobile devices** to ensure usability
6. **Validate on both client and server**
7. **Provide clear error messages**
8. **Show success confirmation** after submission

## Troubleshooting

### Form not submitting

- Check browser console for errors
- Verify the `action` URL is correct
- Ensure all required fields are filled

### Styling issues

- Check for CSS conflicts
- Verify Tailwind classes are compiling
- Inspect elements in browser dev tools

### Data not reaching backend

- Test API endpoint directly
- Check CORS headers
- Verify Edge Script configuration

## Examples in the Codebase

See these files for working examples:

- [newsletter-form.njk](src/_includes/components/newsletter-form.njk)
- [builder-promo-form.njk](src/_includes/components/builder-promo-form.njk)
- [builder-application-form.njk](src/_includes/components/builder-application-form.njk)

## Further Reading

- [Bunny Edge Scripts README](bunny-edge-scripts/README.md) - Backend setup
- [Notion API Documentation](https://developers.notion.com/) - Notion integration
- [Tailwind CSS Documentation](https://tailwindcss.com/) - Styling reference
