# Media Proxy URLs for Analytics Tracking

## Overview

To track when external sites access your images and videos, use the media proxy URLs instead of linking directly to files. These URLs route through the SPA and log analytics events via Aptabase.

## URL Format

### For Images
```
https://ctg-tme.github.io/learn-cisco-devices/media/{deployment}/images/{filename}
```

### For Videos
```
https://ctg-tme.github.io/learn-cisco-devices/media/{deployment}/videos/{filename}
```

## Examples

### Old Direct Link (no analytics)
```
https://ctg-tme.github.io/learn-cisco-devices/mtr-navigator/images/mtr_navigator_schedule_teams.png
```

### New Trackable Link (with analytics)
```
https://ctg-tme.github.io/learn-cisco-devices/media/mtr-navigator/images/mtr_navigator_schedule_teams.png
```

### With Source Tracking Parameter
```
https://ctg-tme.github.io/learn-cisco-devices/media/mtr-navigator/images/mtr_navigator_schedule_teams.png?source=partner-website
```

## How It Works

1. **Images**: When accessed, the URL displays the image on a simple page with download/navigation options
2. **Videos**: When accessed, the URL redirects to the actual video file (browsers handle playback)
3. **Analytics**: Every access logs a `media_proxy_access` event in Aptabase with:
   - `deployment` - Which deployment (e.g., "mtr-navigator")
   - `media_type` - Either "images" or "videos"
   - `filename` - The actual filename
   - `source` - Value from `?source=` parameter or "direct"
   - `referrer` - HTTP referrer if available
   - `full_path` - Complete path to the actual file

## Usage for External Sites

### Embedding Images
External sites can use these URLs in `<img>` tags, but note that:
- The image won't load directly (it's an HTML page)
- Better to link to the proxy URL and let users click through

**Recommended approach:**
```html
<a href="https://ctg-tme.github.io/learn-cisco-devices/media/mtr-navigator/images/mtr_navigator_schedule_teams.png?source=partner-site">
  View Tutorial Screenshot
</a>
```

### Linking to Videos
```html
<a href="https://ctg-tme.github.io/learn-cisco-devices/media/mtr-navigator/videos/mtr_navigator_schedule_teams.webm?source=partner-site">
  Watch Tutorial Video
</a>
```

## Source Parameter

Add `?source=identifier` to track which external site is linking:

- `?source=partner-website`
- `?source=internal-docs`
- `?source=email-campaign`
- `?source=social-media`

This helps you understand where traffic is coming from in your Aptabase dashboard.

## Limitations

- **Not for `<img>` embeds**: These URLs serve HTML pages (for images) or redirect (for videos), so they won't work as direct `<img src="">` values
- **Requires user click**: Analytics only fire when someone actually visits the URL
- **GitHub Pages only**: This relies on your SPA routing; direct file access bypasses it entirely

## Backward Compatibility

The old direct URLs (`/mtr-navigator/images/...`) still work for backward compatibility but generate **no analytics**. Encourage partners to migrate to the new `/media/...` format.
