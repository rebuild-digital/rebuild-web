---
title: "Welcome to Rebuild"
date: 2025-11-19
author: "Rebuild Team"
tags:
  - Stories
  - Resources
excerpt: "Introducing Rebuild: a new initiative for collaborative building and shared learning."
featured: true
featured_image: "/assets/images/welcome-to-rebuild-cover.jpg"
---

We're excited to introduce **Rebuild**, a community-driven initiative focused on collaborative building, shared learning, and collective action.

> "The future belongs to those who build it together. Rebuild is about creating the infrastructure, both technical and social, that empowers communities to shape their own digital futures."
>
> — The Rebuild Team

## What We're Building

Rebuild brings together makers, creators, and innovators from diverse backgrounds to work on meaningful projects that shape a better future. Our approach is grounded in three core principles:

### 1. Collaboration

Working together across disciplines and perspectives. We believe that the most innovative solutions emerge when people from different backgrounds—designers, developers, activists, researchers, and community organizers—come together.

### 2. Transparency

Sharing our processes, learnings, and challenges openly. Every project we undertake is documented, and our methodologies are made available for others to learn from, adapt, and improve.

### 3. Impact

Focusing on projects that create real, measurable change. We're not interested in building for the sake of building—we want to create tools and platforms that address genuine community needs.

## Our Vision for the Future

The digital landscape is at a crossroads. We see three critical challenges:

1. **Centralization**: A handful of companies control most of our digital infrastructure
2. **Surveillance capitalism**: Our data is harvested and monetized without meaningful consent
3. **Digital divide**: Not everyone has equal access to the tools and knowledge needed to participate

We believe there's a better way forward—one built on principles of:

- **Community ownership**: Tools should be owned by the people who use them
- **Privacy by design**: Respect for user data should be the default, not an afterthought
- **Open knowledge**: Learning resources and technical documentation should be freely available

## Case Study: Our First Project

Let's look at a concrete example. When we started Rebuild, our first challenge was building this very website. We wanted it to embody our values:

```javascript
// Example: A simple, privacy-respecting analytics approach
function trackPageView() {
  // No third-party trackers
  // No personal data collection
  // Just simple, aggregated metrics
  fetch('/api/analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      page: window.location.pathname,
      timestamp: Date.now()
    })
  });
}
```

This simple approach demonstrates our commitment to transparency and privacy. The code is open source, the data collected is minimal, and users maintain control.

## Getting Involved

There are many ways to participate in Rebuild, whether you're a seasoned developer or just getting started:

### For Builders

1. **Join a gathering**: Attend one of our events to connect with other builders
2. **Contribute to projects**: Check our [GitHub repositories](https://github.com/rebuild) for open issues
3. **Share your expertise**: Lead a workshop or write a tutorial

### For Community Members

- **Share your work**: Contribute to our journal with stories and insights
- **Provide feedback**: Help us understand community needs
- **Spread the word**: Tell others about projects that might benefit them

### For Organizations

- **Partner with us**: Collaborate on research or development initiatives
- **Host a gathering**: Provide space for our community to meet
- **Sponsor builders**: Support contributors working on critical infrastructure

## Key Statistics

Here's what we've accomplished so far:

| Metric | Value |
|--------|-------|
| Gatherings Hosted | 12 |
| Active Builders | 47 |
| Open Source Projects | 8 |
| Countries Represented | 15 |

## Technical Highlights

For those interested in the technical details, here's our current stack:

- **Frontend**: Eleventy (static site generator) with Tailwind CSS
- **Hosting**: Decentralized infrastructure with fallback to traditional CDN
- **Content**: Markdown-based, version-controlled via Git
- **Analytics**: Self-hosted, privacy-preserving metrics

### Example Configuration

```json
{
  "name": "rebuild-web",
  "version": "1.0.0",
  "privacy": {
    "tracking": "none",
    "cookies": "essential-only",
    "analytics": "self-hosted"
  },
  "accessibility": {
    "wcag_level": "AA",
    "semantic_html": true
  }
}
```

## What's Next

Over the coming months, we'll be focusing on several key initiatives:

1. **Hosting gatherings across Europe** (Amsterdam, Berlin, Barcelona, Copenhagen)
2. **Publishing stories from our community** (monthly journal releases)
3. **Launching collaborative projects** (tools for community organizing)
4. **Building learning resources** (tutorials, workshops, documentation)

### Upcoming Timeline

- **December 2025**: First gathering in Amsterdam
- **January 2026**: Launch of the Rebuild Toolkit v1.0
- **February 2026**: Community survey and needs assessment
- **Q2 2026**: Regional chapters in 5 European cities

## Resources & Further Reading

### Essential Reading

- [The Rebuild Manifesto](/about/manifesto) - Our core principles and values
- [Technical Documentation](/docs) - API references and integration guides
- [Community Guidelines](/community/guidelines) - How we work together

### External Resources

- [Open Source Design](https://opensourcedesign.net/) - Design resources for open projects
- [IndieWeb](https://indieweb.org/) - Principles for decentralized web
- [The Public Interest Internet](https://publicinterest.tech/) - Research and advocacy

## Frequently Asked Questions

**Q: Is Rebuild free to join?**
A: Yes, participation in Rebuild is completely free. We're funded by grants and donations, not by monetizing our community.

**Q: Do I need to be technical to participate?**
A: Not at all! We need people with diverse skills—writers, designers, organizers, researchers, and yes, developers too.

**Q: How do you make decisions?**
A: We use a consensus-based model with clearly defined decision-making processes. Check our [governance documentation](/community/governance) for details.

**Q: Can I use Rebuild tools for commercial projects?**
A: Our code is MIT licensed, so yes! We only ask that you contribute improvements back to the community.

---

## Join the Conversation

We're just getting started, and we'd love to have you join us. Here's how to stay connected:

- **Email newsletter**: [Subscribe here](/newsletter)
- **Community forum**: [forum.rebuild.community](https://forum.rebuild.community)
- **Chat**: Join us on Matrix at `#rebuild:matrix.org`
- **Social media**: Follow [@rebuild_community](https://twitter.com/rebuild_community)

### Contributing to This Journal

Interested in writing for the Rebuild Journal? We're looking for:

- Project showcases and case studies
- Technical tutorials and how-tos
- Essays on technology and society
- Community stories and interviews

See our [submission guidelines](/contribute) for more information.

---

*Want to learn more? [Get in touch](/contact/) or explore our [upcoming gatherings](/gatherings/).*

Last updated: 2025-11-19 | [View revision history](https://github.com/rebuild/rebuild-web/commits/main/src/insights/welcome-to-rebuild.md)
