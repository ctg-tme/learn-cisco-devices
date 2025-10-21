# Admin Guide: Hiding Video Content

## Overview
You can control which tutorial videos are displayed to users by adding URL parameters to hide specific content types.

## Hiding Sharing Modes

### Hide PowerPoint Live Videos
To hide PowerPoint Live sharing tutorials, add this parameter to your URL:
```
?hide=powerpoint
```

**Example:**
```
https://ctg-tme.github.io/learn-cisco-devices/mtr-navigator?hide=powerpoint
```

### Hide Miracast Videos  
To hide Miracast wireless sharing tutorials, add this parameter:
```
?hide=miracast
```

**Example:**
```
https://ctg-tme.github.io/learn-cisco-devices/mtr-navigator?hide=miracast
```

### Hide Both PowerPoint and Miracast
To hide both sharing modes at once, separate the tags with commas:
```
?hide=powerpoint,miracast
```

**Example:**
```
https://ctg-tme.github.io/learn-cisco-devices/mtr-navigator?hide=powerpoint,miracast
```

## URL Encoding Note
When you use commas in URLs, browsers automatically encode them as `%2C`. This is normal behavior:
- `?hide=powerpoint,miracast` becomes `?hide=powerpoint%2Cmiracast`
- The filtering still works correctly

## Combining with Other Parameters
You can combine hiding parameters with other settings:
```
https://ctg-tme.github.io/learn-cisco-devices/mtr-navigator?hide=powerpoint,miracast&theme=classic&qr=false
```

## Available Tags
- `powerpoint` - PowerPoint Live sharing videos
- `miracast` - Miracast wireless sharing videos  
- `wired` - Wired connection sharing videos
- `wirelessShare` - General wireless sharing videos
- `qr` - QR code joining videos

## Testing
After adding the URL parameters, verify that:
1. The targeted videos no longer appear in the "Share Content" section
2. If all videos in a section are hidden, the entire section disappears
3. Other sections remain unaffected
