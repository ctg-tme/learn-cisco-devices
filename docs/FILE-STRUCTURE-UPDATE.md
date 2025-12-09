# File Structure Update - Hierarchical Organization

## Overview

The project now uses a hierarchical file structure that mirrors the URL structure, making the codebase more intuitive and scalable.

## New File Structure

### Current Implementation
```
deployments/
├── mtr/
│   └── navigator/
│       ├── images/
│       │   ├── mtr_navigator_schedule_teams.png
│       │   ├── mtr_navigator_join_room_audio.png
│       │   └── ... (all images)
│       └── videos/
│           ├── mtr_navigator_schedule_teams.webm
│           ├── mtr_navigator_join_room_audio.webm
│           └── ... (all videos)
└── mtr-navigator/  (legacy - kept for backward compatibility)
    ├── images/
    └── videos/
```

### Future Structure
```
deployments/
├── mtr/
│   ├── navigator/  (current)
│   └── touch/      (future)
├── roomos/
│   ├── navigator/  (future)
│   └── touch/      (future)
└── mtr-navigator/  (legacy - maintained for compatibility)
```

## URL Mapping

### All Three URL Formats Now Point to New Structure

**1. Hierarchical Format (Recommended)**
```
URL:  /videos/mtr/navigator/mtr_navigator_join_room_audio.webm
File: deployments/mtr/navigator/videos/mtr_navigator_join_room_audio.webm
```

**2. Simplified Format (Backward Compatible)**
```
URL:  /videos/mtr-navigator/mtr_navigator_join_room_audio.webm
File: deployments/mtr/navigator/videos/mtr_navigator_join_room_audio.webm
      (automatically redirects to new structure)
```

**3. Legacy Format (Backward Compatible)**
```
URL:  /media/mtr-navigator/videos/mtr_navigator_join_room_audio.webm
File: deployments/mtr/navigator/videos/mtr_navigator_join_room_audio.webm
      (automatically redirects to new structure)
```

## What Changed

### 1. File Organization
- **New:** Files stored in `deployments/mtr/navigator/`
- **Old:** Files were in `deployments/mtr-navigator/`
- **Status:** Old folder maintained for backward compatibility

### 2. pages.json
- All thumbnail and video paths updated to use new structure
- Example: `deployments/mtr/navigator/videos/...` instead of `deployments/mtr-navigator/videos/...`

### 3. app.js Routing Logic
- Hierarchical URLs map directly to new structure
- Legacy URLs (`mtr-navigator`) automatically redirect to new structure (`mtr/navigator`)
- All URL formats work seamlessly with analytics tracking

### 4. Documentation
- Updated to show new file structure
- Examples use hierarchical format as recommended
- Legacy compatibility clearly documented

## Backward Compatibility

✅ **All existing URLs continue to work:**
- `/media/mtr-navigator/videos/...` → redirects to `deployments/mtr/navigator/videos/...`
- `/videos/mtr-navigator/...` → redirects to `deployments/mtr/navigator/videos/...`
- `/videos/mtr/navigator/...` → maps directly to `deployments/mtr/navigator/videos/...`

✅ **No breaking changes:**
- External links remain functional
- Analytics tracking works identically
- Users see no difference in behavior

## Benefits

1. **Scalable Structure** - Easy to add new deployment types and device types
2. **Intuitive Organization** - URL structure matches file structure
3. **Future-Proof** - Supports growth without breaking existing links
4. **Clean URLs** - Hierarchical format is shorter and more professional
5. **Backward Compatible** - All existing integrations continue to work

## For Developers

### Adding New Deployments

To add a new deployment type (e.g., `mtr/touch`):

1. Create directory structure:
   ```
   deployments/mtr/touch/
   ├── images/
   └── videos/
   ```

2. Add files to the directories

3. Update `pages.json` with new deployment configuration

4. URLs automatically work:
   - `/videos/mtr/touch/filename.webm`
   - `/images/mtr/touch/filename.png`

### URL Format Priority

The routing logic checks patterns in this order:
1. Legacy format: `/media/{deployment}/{type}/{filename}`
2. Hierarchical format: `/{type}/{deployment-type}/{device-type}/{filename}`
3. Simplified format: `/{type}/{deployment}/{filename}`

Special handling for `mtr-navigator`:
- Always redirects to `mtr/navigator` structure
- Maintains backward compatibility

## Testing

Test all URL formats work correctly:

```bash
# Hierarchical (new)
http://localhost:8000/videos/mtr/navigator/mtr_navigator_join_room_audio.webm

# Simplified (backward compatible)
http://localhost:8000/videos/mtr-navigator/mtr_navigator_join_room_audio.webm

# Legacy (backward compatible)
http://localhost:8000/media/mtr-navigator/videos/mtr_navigator_join_room_audio.webm
```

All should:
1. Load the SPA
2. Track analytics
3. Redirect to `deployments/mtr/navigator/videos/mtr_navigator_join_room_audio.webm`

## Migration Complete

✅ File structure updated to hierarchical organization
✅ All app links point to new structure
✅ URL routing updated with backward compatibility
✅ Documentation updated
✅ Legacy folder maintained for safety

**No action required from users or external integrations.**
