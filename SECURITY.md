# Security Policy

## Security Measures Implemented

### 1. Content Security Policy (CSP)
- Strict CSP headers in `_headers` file
- Prevents XSS attacks and unauthorized resource loading
- Allows only trusted CDN sources (jsdelivr.net for Aptabase)

### 2. Secure API Key Management
- Aptabase API key stored as GitHub repository secret
- Placeholder replacement during deployment only
- No API keys in source code or client-side storage
- Local development uses separate manifest file (gitignored)

### 3. Input Validation & Sanitization
- Video title extraction includes input validation
- HTML/JS character sanitization
- Length limits on user-generated content
- Type checking for all inputs

### 4. HTTP Security Headers
- `X-Frame-Options: DENY` - Prevents clickjacking
- `X-Content-Type-Options: nosniff` - Prevents MIME sniffing
- `X-XSS-Protection: 1; mode=block` - Browser XSS protection
- `Referrer-Policy: strict-origin-when-cross-origin` - Limits referrer info

### 5. Permissions Policy
- Restricts access to sensitive browser APIs
- Disables camera, microphone, geolocation, payment APIs
- Follows principle of least privilege

## Local Development Security

### Setup
1. Copy `manifest.local.json.example` to `manifest.local.json`
2. Add your development Aptabase key (never commit this file)
3. Use localhost for testing (debug mode automatically enabled)

### Best Practices
- Never commit API keys or secrets
- Use HTTPS even in local development when possible
- Regularly update dependencies
- Review all external CDN resources

## Reporting Security Issues

If you discover a security vulnerability, please report it privately to the repository maintainers.

## Security Considerations for Deployment

### GitHub Pages
- Static hosting reduces attack surface
- No server-side code execution
- Automatic HTTPS enforcement
- Regular security updates from GitHub

### Third-Party Dependencies
- Aptabase SDK loaded from trusted CDN (jsdelivr.net)
- Consider hosting dependencies locally for maximum security
- Monitor for security updates in dependencies

### Analytics Data
- Only non-sensitive usage analytics collected
- No personal information or credentials tracked
- Data processed by Aptabase (review their privacy policy)

## Future Security Enhancements

1. **Subresource Integrity (SRI)**
   - Add SRI hashes for all external resources
   - Ensures CDN resources haven't been tampered with

2. **Content Validation**
   - Validate JSON configuration files
   - Implement schema validation for pages.json

3. **Access Controls**
   - Consider adding authentication for sensitive deployments
   - Implement IP allowlisting if needed for corporate environments

4. **Monitoring**
   - Add security event logging
   - Monitor for unusual access patterns
   - Set up alerts for potential security issues
