# Media Proxy Implementation Summary

## What Was Implemented

A new routing system that allows external sites to link to your media files through trackable URLs that log analytics via Aptabase.

## Files Modified

### `/shared/scripts/app.js`
Added three new methods to the `CiscoDeviceApp` class:

1. **`handleMediaProxyRoute(path)`** - Intercepts URLs matching `/media/{deployment}/{type}/{filename}` pattern
2. **`renderMediaProxyPage(deployment, mediaType, filename, mediaUrl)`** - Renders a simple page displaying the image with download/navigation options
3. Modified **`handleRoute()`** - Now checks for media proxy routes before normal page routing

## Files Created

1. **`/docs/media-proxy-urls.md`** - Complete documentation on how to use the media proxy URLs
2. **`/docs/external-site-example.html`** - Live example page showing correct and incorrect usage
3. **`MEDIA_PROXY_IMPLEMENTATION.md`** - This summary document

## How It Works

### URL Pattern
```
/media/{deployment}/{type}/{filename}
```

Where:
- `{deployment}` = deployment name (e.g., "mtr-navigator")
- `{type}` = "images" or "videos"
- `{filename}` = actual filename (e.g., "mtr_navigator_schedule_teams.png")

### Behavior

**For Images:**
- Displays the image on a simple page
- Shows download button and link to view all tutorials
- Logs `media_proxy_access` event to Aptabase

**For Videos:**
- Redirects to the actual video file (browser handles playback)
- Logs `media_proxy_access` event to Aptabase

### Analytics Event

Every access logs a `media_proxy_access` event with these properties:
```javascript
{
  'deployment': 'mtr-navigator',
  'media_type': 'images',
  'filename': 'mtr_navigator_schedule_teams.png',
  'source': 'partner-site',  // from ?source= parameter or 'direct'
  'referrer': 'https://example.com',  // HTTP referrer
  'full_path': 'deployments/mtr-navigator/images/mtr_navigator_schedule_teams.png'
}
```

## Example URLs

### Old (no analytics)
```
https://ctg-tme.github.io/learn-cisco-devices/mtr-navigator/images/mtr_navigator_schedule_teams.png
```

### New (with analytics)
```
https://ctg-tme.github.io/learn-cisco-devices/media/mtr-navigator/images/mtr_navigator_schedule_teams.png
```

### With source tracking
```
https://ctg-tme.github.io/learn-cisco-devices/media/mtr-navigator/images/mtr_navigator_schedule_teams.png?source=partner-website
```

## Usage for External Sites

External sites should use these URLs as **clickable links**, not as direct `<img src="">` embeds:

```html
<!-- ✅ Correct -->
<a href="https://ctg-tme.github.io/learn-cisco-devices/media/mtr-navigator/images/mtr_navigator_schedule_teams.png?source=partner-site">
  View Tutorial Screenshot
</a>

<!-- ❌ Incorrect (won't work as image embed) -->
<img src="https://ctg-tme.github.io/learn-cisco-devices/media/mtr-navigator/images/mtr_navigator_schedule_teams.png">
```

## Backward Compatibility

The old direct URLs (`/mtr-navigator/images/...`) still work but generate **no analytics**. A copy of the `mtr-navigator` directory was placed at the repo root to maintain backward compatibility for existing links.

## Testing

To test locally:
1. Start the dev server: `npm run dev`
2. Visit: `http://localhost:8000/learn-cisco-devices/media/mtr-navigator/images/mtr_navigator_schedule_teams.png`
3. Check browser console for Aptabase event logging
4. Verify the image displays correctly with download/navigation buttons

## Next Steps

1. **Commit and push** the changes to deploy to GitHub Pages
2. **Share documentation** with external partners who want to link to your media
3. **Monitor Aptabase** dashboard for `media_proxy_access` events
4. **Encourage migration** from old direct URLs to new trackable URLs

## Limitations

- **Not for direct embeds**: These URLs serve HTML pages (for images) or redirect (for videos)
- **Requires user click**: Analytics only fire when someone visits the URL
- **GitHub Pages only**: Direct file access bypasses the SPA entirely
- **No server-side tracking**: Can't track direct file downloads or hotlinked images

## Future Enhancements

If you need more robust tracking:
- Consider using a CDN with analytics (e.g., Cloudflare)
- Implement a serverless function for true redirect tracking
- Use a custom domain with server-side redirect rules
