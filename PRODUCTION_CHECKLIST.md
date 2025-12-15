# Production Deployment Checklist

This checklist covers everything needed when moving from staging to production for rebuild.net.

---

## Pre-Deployment Preparation

### Code & Build
- [ ] Merge staging branch to main
- [ ] Ensure all tests pass (if applicable)
- [ ] Run production build locally: `npm run build:production`
- [ ] Verify build output in `/dist` folder
- [ ] Check for console errors/warnings in built files
- [ ] Verify all assets are minified (CSS, JS)
- [ ] Review and clean up any debug code or console.logs

### Dependencies & Security
- [ ] Run `npm audit` and fix any vulnerabilities
- [ ] Update dependencies if needed (especially security patches)
- [ ] Review `package-lock.json` for unexpected changes
- [ ] Ensure `.env` file is NOT committed to repository
- [ ] Verify `.gitignore` includes sensitive files

---

## Environment Variables

### Production Environment Setup
- [ ] **Notion API**
  - [ ] `NOTION_TOKEN` - Production API token (different from staging)
  - [ ] `NOTION_NEWSLETTER_DB_ID` - Production database ID
  - [ ] `NOTION_CONTACT_DB_ID` - Production database ID
  - [ ] `NOTION_BUILDERS_DB_ID` - Production database ID

- [ ] **Bunny CDN**
  - [ ] `BUNNY_STORAGE_ZONE` - Production storage zone name
  - [ ] `BUNNY_API_KEY` - Production API key
  - [ ] `BUNNY_PULL_ZONE_URL` - Production videos URL (https://videos.b-cdn.net)
  - [ ] `BUNNY_FONTS_PULL_ZONE_URL` - Production fonts URL (https://fonts.b-cdn.net)

- [ ] **MailerLite**
  - [ ] `MAILERLITE_API_KEY` - Production API key
  - [ ] `MAILERLITE_GROUP_ID` - Production group ID (if different)

- [ ] **Site Configuration**
  - [ ] `SITE_URL` - Set to `https://www.rebuild.net` (production URL)
  - [ ] `API_URL` - Set to production Bunny CDN endpoint (https://rebuild.b-cdn.net)
  - [ ] `NODE_ENV` - Set to `production`

- [ ] **Analytics (Optional)**
  - [ ] `PIRSCH_CLIENT_ID` - Production client ID
  - [ ] `PIRSCH_CLIENT_SECRET` - Production client secret

### Environment Variable Checklist
- [ ] All staging values replaced with production values
- [ ] No hardcoded staging URLs in codebase
- [ ] Environment variables documented in `.env.example`
- [ ] Backup of environment variables stored securely (password manager/vault)

---

## Bunny CDN Configuration

### Storage Zone
- [ ] Create production storage zone (if not exists)
- [ ] Configure storage zone region (choose closest to target audience)
- [ ] Set up storage zone replication (if needed for redundancy)
- [ ] Configure storage zone access (FTP/API credentials)
- [ ] Test file upload to production storage zone

### Pull Zones
- [ ] **Main Site Pull Zone**
  - [ ] Create pull zone pointing to production storage zone
  - [ ] Configure custom domain: `www.rebuild.net`
  - [ ] Enable SSL/TLS certificate
  - [ ] Set cache settings (cache duration, query string handling)
  - [ ] Configure browser cache expiration headers
  - [ ] Enable Brotli compression
  - [ ] Enable Gzip compression
  - [ ] Test pull zone URL accessibility

- [ ] **Videos Pull Zone**
  - [ ] Verify videos.b-cdn.net is configured
  - [ ] Set appropriate cache headers for video files
  - [ ] Enable video optimization (if available)
  - [ ] Configure hotlink protection (if needed)

- [ ] **Fonts Pull Zone**
  - [ ] Verify fonts.b-cdn.net is configured
  - [ ] Set long cache duration for fonts (fonts rarely change)
  - [ ] Configure CORS headers for font files

### Edge Scripts
- [ ] Review all Edge Scripts for staging-specific code
- [ ] Update Edge Script environment variables (if applicable)
- [ ] **Form Submission Handler**
  - [ ] Verify API_URL points to production
  - [ ] Test newsletter subscription form
  - [ ] Test contact form submission
  - [ ] Verify Notion integration writes to production databases
  - [ ] Verify MailerLite integration adds to production list
- [ ] Test Edge Script error handling
- [ ] Verify CORS headers are correctly set
- [ ] Enable Edge Script logging (for debugging post-launch)
- [ ] Deploy Edge Scripts to production pull zone

### CDN Optimization
- [ ] Enable Bunny Optimizer (image optimization)
- [ ] Configure image quality settings
- [ ] Set up WebP conversion (if not already enabled)
- [ ] Configure lazy loading settings (if CDN-side)
- [ ] Enable HTTP/2 and HTTP/3
- [ ] Configure security headers (HSTS, X-Content-Type-Options, etc.)

### Cache Management
- [ ] Document cache purge procedure
- [ ] Set up cache purge API endpoint (for deployments)
- [ ] Configure cache key rules (query string handling)
- [ ] Test cache purge functionality
- [ ] Set up perma-cache for static assets (fonts, versioned files)

---

## DNS Configuration

### Domain Setup
- [ ] Verify domain ownership and registrar access
- [ ] Backup current DNS records

### DNS Records to Configure
- [ ] **A Record** (if using apex domain)
  - Host: `@` or `rebuild.net`
  - Value: Bunny CDN IP address
  - TTL: 3600 (1 hour) initially, then increase to 86400 (24 hours) after stable

- [ ] **CNAME Record** (for www)
  - Host: `www`
  - Value: Bunny CDN hostname (e.g., `rebuild.b-cdn.net`)
  - TTL: 3600 initially, then 86400

- [ ] **CNAME Record** (for videos subdomain, if separate)
  - Host: `videos`
  - Value: `videos.b-cdn.net`
  - TTL: 86400

- [ ] **CNAME Record** (for fonts subdomain, if separate)
  - Host: `fonts`
  - Value: `fonts.b-cdn.net`
  - TTL: 86400

- [ ] **MX Records** (if using email on this domain)
  - Verify email service provider records
  - Set appropriate priorities

- [ ] **TXT Records**
  - SPF record (for email authentication)
  - DKIM record (if applicable)
  - Domain verification records (for third-party services)
  - DMARC policy (optional but recommended)

### DNS Propagation
- [ ] Use low TTL (300-600 seconds) before cutover
- [ ] Test DNS resolution: `dig www.rebuild.net`
- [ ] Test from multiple locations (use online DNS checkers)
- [ ] Wait for full propagation (24-48 hours for global)
- [ ] Increase TTL to normal values after stable (86400)

---

## SSL/TLS Certificates

- [ ] Generate SSL certificate through Bunny CDN for www.rebuild.net
- [ ] Verify certificate covers both apex and www (if needed)
- [ ] Enable "Force SSL" on Bunny CDN pull zone
- [ ] Test HTTPS access to all domains
- [ ] Verify SSL certificate validity: `https://www.ssllabs.com/ssltest/`
- [ ] Set up certificate auto-renewal
- [ ] Configure HSTS header (Strict-Transport-Security)
- [ ] Add domain to HSTS preload list (optional but recommended)

---

## Build & Deployment Process

### Initial Production Deploy
- [ ] Clear `/dist` folder: `npm run clean`
- [ ] Run production build: `npm run build:production`
- [ ] Verify build completed without errors
- [ ] Review build output file sizes
- [ ] Upload `/dist` contents to Bunny CDN production storage zone
- [ ] Verify all files uploaded successfully
- [ ] Check file permissions on CDN storage

### Deployment Automation (Optional but Recommended)
- [ ] Set up GitHub Actions workflow for auto-deploy
- [ ] Configure deploy on push to `main` branch
- [ ] Add Bunny CDN upload step to workflow
- [ ] Add cache purge step after upload
- [ ] Test automated deployment with non-critical change

---

## Third-Party Services

### Notion Integration
- [ ] Create production Notion workspace (if separate from staging)
- [ ] Set up production databases (Newsletter, Contact, Builders)
- [ ] Configure database schemas to match staging
- [ ] Test API connection with production token
- [ ] Verify webhook integrations (if any)
- [ ] Set up appropriate Notion permissions

### MailerLite
- [ ] Create production account (if separate from staging)
- [ ] Set up production mailing list
- [ ] Import any existing subscribers (if applicable)
- [ ] Configure double opt-in settings
- [ ] Set up welcome email automation
- [ ] Test subscription flow end-to-end
- [ ] Verify unsubscribe links work
- [ ] Configure GDPR compliance settings

### Analytics (Pirsch)
- [ ] Create production site in Pirsch dashboard
- [ ] Get production API credentials
- [ ] Update tracking code with production ID
- [ ] Verify analytics data is being collected
- [ ] Set up custom events (if applicable)
- [ ] Configure data retention policies
- [ ] Test privacy compliance (cookie consent, etc.)

---

## Performance & Monitoring

### Performance Testing
- [ ] Run Lighthouse audit (target: 90+ on all metrics)
- [ ] Test PageSpeed Insights: `https://pagespeed.web.dev/`
- [ ] Verify Core Web Vitals (LCP, FID, CLS)
- [ ] Test mobile performance
- [ ] Test on slow 3G connection
- [ ] Verify images are optimized and lazy-loaded
- [ ] Check font loading performance (FOUT/FOIT prevention)

### Monitoring Setup
- [ ] Set up uptime monitoring (UptimeRobot, Pingdom, etc.)
  - Monitor: https://www.rebuild.net
  - Check interval: 5 minutes
  - Alert via: Email, SMS
- [ ] Configure error monitoring/logging
- [ ] Set up CDN bandwidth monitoring (avoid surprise bills)
- [ ] Monitor Bunny CDN storage usage
- [ ] Set up alerts for critical errors
- [ ] Configure log aggregation (if applicable)

### CDN Monitoring
- [ ] Monitor cache hit ratio (target: >90%)
- [ ] Track CDN bandwidth usage
- [ ] Monitor edge script execution times
- [ ] Set up billing alerts on Bunny CDN account

---

## Security Checklist

### Application Security
- [ ] Verify all forms have CSRF protection
- [ ] Verify all user inputs are sanitized
- [ ] Check for exposed API keys in client-side code
- [ ] Verify no sensitive data in HTML comments
- [ ] Test for XSS vulnerabilities
- [ ] Review content security policy (CSP) headers
- [ ] Enable rate limiting on form submissions (Edge Scripts)

### HTTP Security Headers
Configure these on Bunny CDN pull zone:
- [ ] `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`
- [ ] `X-Content-Type-Options: nosniff`
- [ ] `X-Frame-Options: SAMEORIGIN` or `DENY`
- [ ] `X-XSS-Protection: 1; mode=block`
- [ ] `Referrer-Policy: strict-origin-when-cross-origin`
- [ ] `Permissions-Policy` (configure as needed)
- [ ] Content-Security-Policy (if applicable)

### Access Control
- [ ] Review Bunny CDN storage zone access permissions
- [ ] Rotate any API keys that may have been exposed
- [ ] Set up 2FA on critical accounts (GitHub, Bunny, Notion, MailerLite)
- [ ] Document who has access to production systems
- [ ] Review and revoke unnecessary access tokens

---

## Testing in Production

### Smoke Tests (perform immediately after deployment)
- [ ] Homepage loads correctly
- [ ] Navigation works across all pages
- [ ] Forms submit successfully (test with real submission)
  - [ ] Newsletter signup
  - [ ] Contact form
  - [ ] Any other forms
- [ ] Videos load and play
- [ ] Fonts load correctly (no FOUT/FOIT issues)
- [ ] Images load and display properly
- [ ] Mobile responsive design works
- [ ] Test in multiple browsers
  - [ ] Chrome
  - [ ] Firefox
  - [ ] Safari
  - [ ] Edge
  - [ ] Mobile Safari (iOS)
  - [ ] Chrome Mobile (Android)

### Integration Tests
- [ ] Verify Notion database receives submissions
- [ ] Verify MailerLite receives new subscribers
- [ ] Verify analytics tracking works
- [ ] Test all external links
- [ ] Test all internal links
- [ ] Verify 404 page displays correctly
- [ ] Test robots.txt accessibility
- [ ] Test sitemap.xml accessibility

### Cross-Device Testing
- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet landscape (1024x768)
- [ ] Tablet portrait (768x1024)
- [ ] Mobile landscape (667x375)
- [ ] Mobile portrait (375x667)

---

## SEO & Content

### Meta Tags & SEO
- [ ] Verify all pages have appropriate title tags
- [ ] Verify all pages have meta descriptions
- [ ] Check Open Graph tags for social sharing
- [ ] Check Twitter Card tags
- [ ] Verify canonical URLs point to production domain
- [ ] Check robots.txt allows search engine crawling
- [ ] Submit sitemap to Google Search Console
- [ ] Submit sitemap to Bing Webmaster Tools
- [ ] Verify structured data (JSON-LD schema) if applicable
- [ ] Test social sharing preview on Facebook Debugger
- [ ] Test social sharing preview on Twitter Card Validator

### Search Console
- [ ] Add property to Google Search Console
- [ ] Verify domain ownership
- [ ] Submit sitemap.xml
- [ ] Check for crawl errors
- [ ] Set up email alerts for critical issues
- [ ] Add property to Bing Webmaster Tools

### Content Review
- [ ] Verify no "staging" or "test" content visible
- [ ] Check for broken internal links
- [ ] Check for broken external links
- [ ] Verify all images have alt text
- [ ] Verify copyright notices are current
- [ ] Review privacy policy (ensure it's accurate)
- [ ] Review terms of service (if applicable)
- [ ] Verify contact information is correct

---

## Compliance & Legal

### Privacy & GDPR
- [ ] Cookie consent banner implemented (if using cookies)
- [ ] Privacy policy published and linked
- [ ] Data processing documented
- [ ] User data deletion process documented
- [ ] MailerLite GDPR settings configured
- [ ] Analytics respects "Do Not Track"
- [ ] Terms of service published (if collecting data)

### Accessibility
- [ ] Run accessibility audit (WAVE, axe DevTools)
- [ ] Verify keyboard navigation works
- [ ] Verify screen reader compatibility
- [ ] Check color contrast ratios (WCAG AA minimum)
- [ ] Verify form labels are properly associated
- [ ] Test with VoiceOver (Mac) or NVDA (Windows)

---

## Rollback Plan

### Preparation
- [ ] Document current DNS settings
- [ ] Backup current production files (if replacing existing site)
- [ ] Keep staging environment active
- [ ] Document rollback procedure
- [ ] Test rollback on staging

### Rollback Procedure (if needed)
1. Update DNS records to point back to old hosting
2. Restore previous Bunny CDN configuration
3. Revert Edge Scripts to previous version
4. Clear CDN cache
5. Wait for DNS propagation
6. Verify old site is accessible
7. Investigate and fix issues before re-deploying

---

## Post-Launch Tasks

### Immediate (within 24 hours)
- [ ] Monitor error logs for issues
- [ ] Check analytics for unusual traffic patterns
- [ ] Verify form submissions are being received
- [ ] Monitor uptime monitoring alerts
- [ ] Check CDN bandwidth usage
- [ ] Review Edge Script logs for errors

### Week 1
- [ ] Review performance metrics
- [ ] Check Core Web Vitals in Search Console
- [ ] Monitor crawl errors in Search Console
- [ ] Review analytics data (traffic sources, bounce rate, etc.)
- [ ] Gather user feedback
- [ ] Address any bugs reported by users
- [ ] Increase DNS TTL if stable (to 86400 seconds)

### Week 2-4
- [ ] Full performance review
- [ ] SEO performance analysis
- [ ] User behavior analysis (heatmaps, session recordings if available)
- [ ] Cost analysis (CDN bandwidth, API usage)
- [ ] Security audit review
- [ ] Documentation updates based on learnings

---

## Team Communication

### Before Deployment
- [ ] Notify team of deployment schedule
- [ ] Schedule deployment during low-traffic period
- [ ] Ensure someone is available for support during/after deployment
- [ ] Prepare announcement for users (if downtime expected)

### After Deployment
- [ ] Announce successful deployment to team
- [ ] Document any issues encountered
- [ ] Share post-mortem if there were problems
- [ ] Update team documentation with new production URLs

---

## Documentation

### Update Documentation
- [ ] Update README.md with production deployment info
- [ ] Update CLAUDE.md with production-specific details
- [ ] Document production environment variables (without values)
- [ ] Document deployment process for future reference
- [ ] Create runbook for common production issues
- [ ] Document monitoring dashboard URLs
- [ ] Document emergency contacts and escalation procedures

### Archive
- [ ] Archive this checklist with deployment date
- [ ] Save configuration snapshots (DNS, CDN settings)
- [ ] Document lessons learned

---

## Emergency Contacts & Resources

### Critical Services
- **Bunny CDN Support**: [https://support.bunny.net](https://support.bunny.net)
- **Domain Registrar**: [Document your registrar contact info]
- **GitHub Status**: [https://www.githubstatus.com](https://www.githubstatus.com)
- **Notion Status**: [https://status.notion.so](https://status.notion.so)
- **MailerLite Support**: [https://www.mailerlite.com/support](https://www.mailerlite.com/support)

### Useful Tools
- DNS Checker: [https://dnschecker.org](https://dnschecker.org)
- SSL Test: [https://www.ssllabs.com/ssltest/](https://www.ssllabs.com/ssltest/)
- PageSpeed Insights: [https://pagespeed.web.dev](https://pagespeed.web.dev)
- GTmetrix: [https://gtmetrix.com](https://gtmetrix.com)
- Security Headers: [https://securityheaders.com](https://securityheaders.com)

---

## Notes

Use this section to document any site-specific considerations or deviation from the checklist:

```
Date: _______________
Deployed by: _______________
Notes:






```

---

**Last Updated**: 2025-12-15
**Next Review**: [Schedule periodic review of this checklist]
