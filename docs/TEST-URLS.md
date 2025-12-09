# Test URLs - Comprehensive Link Testing

This document contains test links for all URL formats to verify backward compatibility and new hierarchical structure.

## Base URL
```
http://localhost:8000/learn-cisco-devices
```

---

## 1. Page Routes

### Homepage
- [Homepage](http://localhost:8000/learn-cisco-devices/)

### Deployment Pages

**New Hierarchical Route:**
- [MTR Navigator (hierarchical)](http://localhost:8000/learn-cisco-devices/mtr/navigator)

**Legacy Route (Backward Compatible):**
- [MTR Navigator (legacy)](http://localhost:8000/learn-cisco-devices/mtr-navigator)

---

## 2. Direct File Access

### New Hierarchical File Structure

**Videos:**
- [join_room_audio.webm (new structure)](http://localhost:8000/learn-cisco-devices/deployments/mtr/navigator/videos/mtr_navigator_join_room_audio.webm)
- [schedule_teams.webm (new structure)](http://localhost:8000/learn-cisco-devices/deployments/mtr/navigator/videos/mtr_navigator_schedule_teams.webm)
- [meet_now.webm (new structure)](http://localhost:8000/learn-cisco-devices/deployments/mtr/navigator/videos/mtr_navigator_meet_now.webm)

**Images:**
- [join_room_audio.png (new structure)](http://localhost:8000/learn-cisco-devices/deployments/mtr/navigator/images/mtr_navigator_join_room_audio.png)
- [schedule_teams.png (new structure)](http://localhost:8000/learn-cisco-devices/deployments/mtr/navigator/images/mtr_navigator_schedule_teams.png)
- [meet_now.png (new structure)](http://localhost:8000/learn-cisco-devices/deployments/mtr/navigator/images/mtr_navigator_meet_now.png)

### Legacy File Structure (If Still Present)

**Videos:**
- [join_room_audio.webm (legacy structure)](http://localhost:8000/learn-cisco-devices/deployments/mtr-navigator/videos/mtr_navigator_join_room_audio.webm)
- [schedule_teams.webm (legacy structure)](http://localhost:8000/learn-cisco-devices/deployments/mtr-navigator/videos/mtr_navigator_schedule_teams.webm)

**Images:**
- [join_room_audio.png (legacy structure)](http://localhost:8000/learn-cisco-devices/deployments/mtr-navigator/images/mtr_navigator_join_room_audio.png)
- [schedule_teams.png (legacy structure)](http://localhost:8000/learn-cisco-devices/deployments/mtr-navigator/images/mtr_navigator_schedule_teams.png)

---

## 3. Media Proxy URLs (With Analytics Tracking)

### Format 1: New Hierarchical Media Proxy (Recommended)

**Videos:**
- [join_room_audio.webm (hierarchical proxy)](http://localhost:8000/learn-cisco-devices/videos/mtr/navigator/mtr_navigator_join_room_audio.webm)
- [schedule_teams.webm (hierarchical proxy)](http://localhost:8000/learn-cisco-devices/videos/mtr/navigator/mtr_navigator_schedule_teams.webm)
- [meet_now.webm (hierarchical proxy)](http://localhost:8000/learn-cisco-devices/videos/mtr/navigator/mtr_navigator_meet_now.webm)
- [join_qr.webm (hierarchical proxy)](http://localhost:8000/learn-cisco-devices/videos/mtr/navigator/mtr_navigator_join_qr.webm)

**Images:**
- [join_room_audio.png (hierarchical proxy)](http://localhost:8000/learn-cisco-devices/images/mtr/navigator/mtr_navigator_join_room_audio.png)
- [schedule_teams.png (hierarchical proxy)](http://localhost:8000/learn-cisco-devices/images/mtr/navigator/mtr_navigator_schedule_teams.png)
- [meet_now.png (hierarchical proxy)](http://localhost:8000/learn-cisco-devices/images/mtr/navigator/mtr_navigator_meet_now.png)

### Format 2: Simplified Media Proxy (Backward Compatible)

**Videos:**
- [join_room_audio.webm (simplified proxy)](http://localhost:8000/learn-cisco-devices/videos/mtr-navigator/mtr_navigator_join_room_audio.webm)
- [schedule_teams.webm (simplified proxy)](http://localhost:8000/learn-cisco-devices/videos/mtr-navigator/mtr_navigator_schedule_teams.webm)
- [meet_now.webm (simplified proxy)](http://localhost:8000/learn-cisco-devices/videos/mtr-navigator/mtr_navigator_meet_now.webm)

**Images:**
- [join_room_audio.png (simplified proxy)](http://localhost:8000/learn-cisco-devices/images/mtr-navigator/mtr_navigator_join_room_audio.png)
- [schedule_teams.png (simplified proxy)](http://localhost:8000/learn-cisco-devices/images/mtr-navigator/mtr_navigator_schedule_teams.png)

### Format 3: Legacy Media Proxy (Backward Compatible)

**Videos:**
- [join_room_audio.webm (legacy proxy)](http://localhost:8000/learn-cisco-devices/media/mtr-navigator/videos/mtr_navigator_join_room_audio.webm)
- [schedule_teams.webm (legacy proxy)](http://localhost:8000/learn-cisco-devices/media/mtr-navigator/videos/mtr_navigator_schedule_teams.webm)
- [meet_now.webm (legacy proxy)](http://localhost:8000/learn-cisco-devices/media/mtr-navigator/videos/mtr_navigator_meet_now.webm)

**Images:**
- [join_room_audio.png (legacy proxy)](http://localhost:8000/learn-cisco-devices/media/mtr-navigator/images/mtr_navigator_join_room_audio.png)
- [schedule_teams.png (legacy proxy)](http://localhost:8000/learn-cisco-devices/media/mtr-navigator/images/mtr_navigator_schedule_teams.png)

---

## 4. Media Proxy URLs with Source Tracking

### Hierarchical with Source Parameter
- [join_room_audio.webm?source=test](http://localhost:8000/learn-cisco-devices/videos/mtr/navigator/mtr_navigator_join_room_audio.webm?source=test)
- [schedule_teams.webm?source=external](http://localhost:8000/learn-cisco-devices/videos/mtr/navigator/mtr_navigator_schedule_teams.webm?source=external)

### Simplified with Source Parameter
- [join_room_audio.webm?source=test](http://localhost:8000/learn-cisco-devices/videos/mtr-navigator/mtr_navigator_join_room_audio.webm?source=test)
- [schedule_teams.webm?source=external](http://localhost:8000/learn-cisco-devices/videos/mtr-navigator/mtr_navigator_schedule_teams.webm?source=external)

### Legacy with Source Parameter
- [join_room_audio.webm?source=test](http://localhost:8000/learn-cisco-devices/media/mtr-navigator/videos/mtr_navigator_join_room_audio.webm?source=test)
- [schedule_teams.webm?source=external](http://localhost:8000/learn-cisco-devices/media/mtr-navigator/videos/mtr_navigator_schedule_teams.webm?source=external)

---

## 5. All Share Content Videos

### Hierarchical Format
- [Share Wired](http://localhost:8000/learn-cisco-devices/videos/mtr/navigator/mtr_navigator_share_wired_connection.webm)
- [Share PowerPoint](http://localhost:8000/learn-cisco-devices/videos/mtr/navigator/mtr_navigator_share_powerpoint.webm)
- [Share Miracast](http://localhost:8000/learn-cisco-devices/videos/mtr/navigator/mtr_navigator_share_miracast.webm)
- [Share Airplay](http://localhost:8000/learn-cisco-devices/videos/mtr/navigator/mtr_navigator_share_airplay.webm)

### Simplified Format
- [Share Wired](http://localhost:8000/learn-cisco-devices/videos/mtr-navigator/mtr_navigator_share_wired_connection.webm)
- [Share PowerPoint](http://localhost:8000/learn-cisco-devices/videos/mtr-navigator/mtr_navigator_share_powerpoint.webm)
- [Share Miracast](http://localhost:8000/learn-cisco-devices/videos/mtr-navigator/mtr_navigator_share_miracast.webm)
- [Share Airplay](http://localhost:8000/learn-cisco-devices/videos/mtr-navigator/mtr_navigator_share_airplay.webm)

---

## Expected Behavior

### All Media Proxy URLs Should:
1. ✅ Load the SPA (index.html)
2. ✅ Track analytics (page_loaded event with media_proxy: true)
3. ✅ Redirect to actual file in `deployments/mtr/navigator/` structure
4. ✅ Support source tracking with `?source=` parameter

### All Direct File URLs Should:
1. ✅ Serve the file directly (no SPA)
2. ✅ Work for both new (`mtr/navigator`) and legacy (`mtr-navigator`) structures
3. ✅ No analytics tracking (direct file access)

### All Page Routes Should:
1. ✅ Load the deployment page with video thumbnails
2. ✅ Display videos from new file structure
3. ✅ Work for both hierarchical (`/mtr/navigator`) and legacy (`/mtr-navigator`) routes

---

## Testing Checklist

- [ ] Homepage loads correctly
- [ ] Homepage links to hierarchical route (`/mtr/navigator`)
- [ ] Both page routes work (`/mtr/navigator` and `/mtr-navigator`)
- [ ] Direct file access works for new structure (`deployments/mtr/navigator/`)
- [ ] Direct file access works for legacy structure (`deployments/mtr-navigator/`) if present
- [ ] Hierarchical media proxy URLs redirect correctly
- [ ] Simplified media proxy URLs redirect correctly
- [ ] Legacy media proxy URLs redirect correctly
- [ ] Source tracking parameter works on all proxy URLs
- [ ] All videos play correctly in the modal
- [ ] All thumbnails display correctly
- [ ] Browser console shows no 404 errors

---

## Quick Copy-Paste Test URLs

```
# Page Routes
http://localhost:8000/learn-cisco-devices/mtr/navigator
http://localhost:8000/learn-cisco-devices/mtr-navigator

# Hierarchical Media Proxy
http://localhost:8000/learn-cisco-devices/videos/mtr/navigator/mtr_navigator_join_room_audio.webm

# Simplified Media Proxy
http://localhost:8000/learn-cisco-devices/videos/mtr-navigator/mtr_navigator_join_room_audio.webm

# Legacy Media Proxy
http://localhost:8000/learn-cisco-devices/media/mtr-navigator/videos/mtr_navigator_join_room_audio.webm

# Direct File Access (New)
http://localhost:8000/learn-cisco-devices/deployments/mtr/navigator/videos/mtr_navigator_join_room_audio.webm

# Direct File Access (Legacy)
http://localhost:8000/learn-cisco-devices/deployments/mtr-navigator/videos/mtr_navigator_join_room_audio.webm
```

---

## Notes

- All media proxy URLs should redirect to files in the **new** `deployments/mtr/navigator/` structure
- Legacy `deployments/mtr-navigator/` folder can be kept for direct file access backward compatibility
- The `mtr-navigator` page route ID is maintained in `pages.json` for backward compatibility
- Homepage now links to hierarchical routes by default
