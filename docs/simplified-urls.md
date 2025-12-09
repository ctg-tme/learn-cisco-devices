# Simplified Media URLs

This document shows the new simplified URL formats for accessing media files. These shorter URLs are easier to share and remember.

## URL Formats

### Hierarchical Format (Most Future-Proof)
```
https://ctg-tme.github.io/learn-cisco-devices/videos/{deployment-type}/{device-type}/{filename}
https://ctg-tme.github.io/learn-cisco-devices/images/{deployment-type}/{device-type}/{filename}
```

**Examples:**
- `https://ctg-tme.github.io/learn-cisco-devices/videos/mtr/navigator/join_room_audio.webm`
- `https://ctg-tme.github.io/learn-cisco-devices/videos/mtr/touch/schedule_meeting.webm`
- `https://ctg-tme.github.io/learn-cisco-devices/videos/roomos/navigator/share_content.webm`

### Simplified Format (Also Supported)
```
https://ctg-tme.github.io/learn-cisco-devices/videos/{deployment}/{filename}
https://ctg-tme.github.io/learn-cisco-devices/images/{deployment}/{filename}
```

**Examples:**
- `https://ctg-tme.github.io/learn-cisco-devices/videos/mtr-navigator/join_room_audio.webm`

### Examples

#### Video Example - All Formats

**Hierarchical (Recommended for new content):**
```
https://ctg-tme.github.io/learn-cisco-devices/videos/mtr/navigator/join_room_audio.webm
```

**Simplified:**
```
https://ctg-tme.github.io/learn-cisco-devices/videos/mtr-navigator/join_room_audio.webm
```

**Legacy (still works):**
```
https://ctg-tme.github.io/learn-cisco-devices/media/mtr-navigator/videos/mtr_navigator_join_room_audio.webm
```

#### Image Example - All Formats

**Hierarchical (Recommended for new content):**
```
https://ctg-tme.github.io/learn-cisco-devices/images/mtr/navigator/schedule_teams.png
```

**Simplified:**
```
https://ctg-tme.github.io/learn-cisco-devices/images/mtr-navigator/mtr_navigator_schedule_teams.png
```

**Legacy (still works):**
```
https://ctg-tme.github.io/learn-cisco-devices/media/mtr-navigator/images/mtr_navigator_schedule_teams.png
```

## All Available Videos (Hierarchical URLs)

### MTR with Navigator - Create a Meeting
- [Schedule with Teams Calendar](https://ctg-tme.github.io/learn-cisco-devices/videos/mtr/navigator/mtr_navigator_schedule_teams.webm)
- [Meet Now](https://ctg-tme.github.io/learn-cisco-devices/videos/mtr/navigator/mtr_navigator_meet_now.webm)

### MTR with Navigator - Join a Meeting
- [Join Scheduled Meeting](https://ctg-tme.github.io/learn-cisco-devices/videos/mtr/navigator/mtr_navigator_join_scheduled_meeting.webm)
- [Join with QR Code](https://ctg-tme.github.io/learn-cisco-devices/videos/mtr/navigator/mtr_navigator_join_qr.webm)
- [Join Webex/Zoom with ID](https://ctg-tme.github.io/learn-cisco-devices/videos/mtr/navigator/mtr_navigator_join_webex_zoom_id.webm)
- [Add Device to Meeting (Room Audio)](https://ctg-tme.github.io/learn-cisco-devices/videos/mtr/navigator/mtr_navigator_join_room_audio.webm)

### MTR with Navigator - Share Content
- [Share with Wired Connection](https://ctg-tme.github.io/learn-cisco-devices/videos/mtr/navigator/mtr_navigator_share_wired_connection.webm)
- [Share with PowerPoint Live](https://ctg-tme.github.io/learn-cisco-devices/videos/mtr/navigator/mtr_navigator_share_powerpoint.webm)
- [Share with Miracast](https://ctg-tme.github.io/learn-cisco-devices/videos/mtr/navigator/mtr_navigator_share_miracast.webm)
- [Share with Airplay](https://ctg-tme.github.io/learn-cisco-devices/videos/mtr/navigator/mtr_navigator_share_airplay.webm)

## Adding Source Tracking

Add `?source=your-identifier` to track where traffic comes from (works with all formats):

**Hierarchical:**
```
https://ctg-tme.github.io/learn-cisco-devices/videos/mtr/navigator/join_room_audio.webm?source=partner-site
```

**Simplified:**
```
https://ctg-tme.github.io/learn-cisco-devices/videos/mtr-navigator/join_room_audio.webm?source=partner-site
```

## Backward Compatibility

All three formats work identically:

**Hierarchical (New):**
```
https://ctg-tme.github.io/learn-cisco-devices/videos/mtr/navigator/join_room_audio.webm
```

**Simplified:**
```
https://ctg-tme.github.io/learn-cisco-devices/videos/mtr-navigator/join_room_audio.webm
```

**Legacy:**
```
https://ctg-tme.github.io/learn-cisco-devices/media/mtr-navigator/videos/mtr_navigator_join_room_audio.webm
```

All formats:
- Track analytics identically
- Redirect to the same actual file
- Support source tracking with `?source=` parameter
- Work on all platforms (GitHub Pages, local dev server, Apache)

## Benefits of Hierarchical URLs

1. **Scalable** - Easily add new deployment types (mtr, roomos, etc.) and device types (navigator, touch, etc.)
2. **Organized** - Clear separation between deployment type and device type
3. **Future-proof** - Structure supports growth without breaking existing links
4. **Intuitive** - URL structure mirrors the actual deployment taxonomy

## For External Sites

When linking from external websites or domains like `roomos.cisco.com`, use the hierarchical format:

```html
<a href="https://ctg-tme.github.io/learn-cisco-devices/videos/mtr/navigator/join_room_audio.webm?source=roomos">
  Watch Tutorial: Add Device to Meeting
</a>
```

This gives you:
- Clean, professional-looking URLs
- Full analytics tracking
- Easy maintenance and updates
- Clear categorization by deployment and device type

## Future Deployment Types

The hierarchical structure supports future expansions:

**MTR Deployments:**
- `/videos/mtr/navigator/...` - MTR with Navigator (current)
- `/videos/mtr/touch/...` - MTR with Touch devices (future)

**RoomOS Deployments:**
- `/videos/roomos/navigator/...` - RoomOS with Navigator (future)
- `/videos/roomos/touch/...` - RoomOS with Touch devices (future)

## File Structure

**New Hierarchical Structure:**
- Files are stored at: `deployments/mtr/navigator/videos/...` and `deployments/mtr/navigator/images/...`
- URLs map directly: `/videos/mtr/navigator/...` → `deployments/mtr/navigator/videos/...`

**Legacy Compatibility:**
- Old URLs like `/videos/mtr-navigator/...` automatically redirect to the new structure
- The legacy `deployments/mtr-navigator/` folder is maintained for backward compatibility
- All new content uses the hierarchical structure

All URL formats track analytics identically and work seamlessly!
