# Simplified Media URLs

This document shows the new simplified URL format for accessing media files. These shorter URLs are easier to share and remember.

## URL Format

### New Simplified Format (Recommended)
```
https://ctg-tme.github.io/learn-cisco-devices/videos/{deployment}/{filename}
https://ctg-tme.github.io/learn-cisco-devices/images/{deployment}/{filename}
```

### Examples

#### Video Example
Instead of the long format:
```
https://ctg-tme.github.io/learn-cisco-devices/media/mtr-navigator/videos/mtr_navigator_join_room_audio.webm
```

Use the simplified format:
```
https://ctg-tme.github.io/learn-cisco-devices/videos/mtr-navigator/mtr_navigator_join_room_audio.webm
```

#### Image Example
Instead of:
```
https://ctg-tme.github.io/learn-cisco-devices/media/mtr-navigator/images/mtr_navigator_schedule_teams.png
```

Use:
```
https://ctg-tme.github.io/learn-cisco-devices/images/mtr-navigator/mtr_navigator_schedule_teams.png
```

## All Available Videos (Simplified URLs)

### Create a Meeting
- [Schedule with Teams Calendar](https://ctg-tme.github.io/learn-cisco-devices/videos/mtr-navigator/mtr_navigator_schedule_teams.webm)
- [Meet Now](https://ctg-tme.github.io/learn-cisco-devices/videos/mtr-navigator/mtr_navigator_meet_now.webm)

### Join a Meeting
- [Join Scheduled Meeting](https://ctg-tme.github.io/learn-cisco-devices/videos/mtr-navigator/mtr_navigator_join_scheduled_meeting.webm)
- [Join with QR Code](https://ctg-tme.github.io/learn-cisco-devices/videos/mtr-navigator/mtr_navigator_join_qr.webm)
- [Join Webex/Zoom with ID](https://ctg-tme.github.io/learn-cisco-devices/videos/mtr-navigator/mtr_navigator_join_webex_zoom_id.webm)
- [Add Device to Meeting (Room Audio)](https://ctg-tme.github.io/learn-cisco-devices/videos/mtr-navigator/mtr_navigator_join_room_audio.webm)

### Share Content
- [Share with Wired Connection](https://ctg-tme.github.io/learn-cisco-devices/videos/mtr-navigator/mtr_navigator_share_wired_connection.webm)
- [Share with PowerPoint Live](https://ctg-tme.github.io/learn-cisco-devices/videos/mtr-navigator/mtr_navigator_share_powerpoint.webm)
- [Share with Miracast](https://ctg-tme.github.io/learn-cisco-devices/videos/mtr-navigator/mtr_navigator_share_miracast.webm)
- [Share with Airplay](https://ctg-tme.github.io/learn-cisco-devices/videos/mtr-navigator/mtr_navigator_share_airplay.webm)

## Adding Source Tracking

Add `?source=your-identifier` to track where traffic comes from:

```
https://ctg-tme.github.io/learn-cisco-devices/videos/mtr-navigator/mtr_navigator_join_room_audio.webm?source=partner-site
```

## Backward Compatibility

The old format with `/media/` still works and will continue to work:
```
https://ctg-tme.github.io/learn-cisco-devices/media/mtr-navigator/videos/mtr_navigator_join_room_audio.webm
```

Both formats:
- Track analytics identically
- Redirect to the same actual file
- Support source tracking with `?source=` parameter
- Work on all platforms (GitHub Pages, local dev server, Apache)

## Benefits of Simplified URLs

1. **Shorter** - Easier to type and share
2. **Cleaner** - More intuitive structure
3. **Future-proof** - Avoids nested directory structure
4. **Memorable** - Follows common URL patterns

## For External Sites

When linking from external websites or domains like `roomos.cisco.com`, use the simplified format:

```html
<a href="https://ctg-tme.github.io/learn-cisco-devices/videos/mtr-navigator/mtr_navigator_join_room_audio.webm?source=roomos">
  Watch Tutorial: Add Device to Meeting
</a>
```

This gives you:
- Clean, professional-looking URLs
- Full analytics tracking
- Easy maintenance and updates
