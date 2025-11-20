# Learn Cisco Devices

A modular video tutorial platform for different Cisco device deployment types with support for multiple software versions.

## Structure

```
/
├── index.html                    # Main entry point
├── config/                       # All configuration files
│   ├── config.js                # App configuration (repo name, etc.)
│   └── pages.json               # Deployment and video configuration
├── shared/                       # Common assets and code
│   ├── assets/
│   │   └── images/              # Shared images and icons
│   ├── styles/
│   │   └── main.css            # Common styling
│   └── scripts/
│       └── app.js               # SPA routing and logic
└── deployments/                 # All deployment types
    └── mtr-navigator/           # Microsoft Teams Rooms with Navigator
        ├── images/              # Video thumbnails
        └── videos/              # Tutorial videos
```

## Development

### Running Locally

Use the Node.js development server for local testing with proper SPA routing:

```bash
node server.js
# or
npm run dev
```

The server will start at `http://localhost:8000/` and automatically handle:
- SPA routing for all deployment pages
- Path rewriting for GitHub Pages compatibility
- Proper MIME types for all assets

### Generating Thumbnails

Automatically extract PNG thumbnails from video files using FFmpeg:

```bash
# Generate thumbnails for all videos in all deployment directories
npm run thumbnails

# Process a specific deployment
node generate-thumbnails.js deployments/mtr-navigator

# Process a single video file
node generate-thumbnails.js path/to/video.webm

# Capture at a specific time (e.g., 2.5 seconds)
node generate-thumbnails.js --time 2.5

# Regenerate all thumbnails (overwrite existing)
npm run thumbnails:force
```

**Requirements:** FFmpeg must be installed
- macOS: `brew install ffmpeg`
- Linux: `apt-get install ffmpeg`

The script automatically:
- Captures a frame at 1 second (configurable with `--time`)
- Places thumbnails in the `images/` directory (sibling to `videos/`)
- Skips existing thumbnails when processing directories (unless `--force` is used)
- Always regenerates when a specific file is provided
- Supports .webm, .mp4, and .mov formats

### Adding New Deployments

1. Create a new directory in `deployments/` (e.g., `deployments/typex/`)
2. Create `videos/` subdirectory and add your video files
3. Run `npm run thumbnails` to generate thumbnails automatically
4. Add deployment configuration to `config/pages.json`:
   - Add deployment card to homepage
   - Add deployment page with sections and video metadata (title, thumbnail, video, tags, version)
5. Test locally with `npm run dev`

## URL Parameters

### Display Options
- `?theme=dark` - Switch to white text on dark grey theme
- `?qr=false` - Hide QR code (automatically shown on Cisco devices)
- `?timeout=false` - Disable auto-close after video completion
- `?debug=true` - Show debug information

### Content Filtering
- `?version=<version>` - Show videos for specific software version (e.g., `RoomOS 11`, `RoomOS 26`, `all`)
  - No parameter: Shows default videos (those with `"default": true`)
  - `?version=all`: Shows all videos regardless of version
  - `?version=RoomOS 26`: Shows only RoomOS 26 videos
- `?hide=<tag1>,<tag2>` - Hide videos with specified tags
- `?show=<tag1>,<tag2>` - Show only videos with specified tags

### Examples
- `/mtr-navigator/` - Show default videos (latest recommended version)
- `/mtr-navigator/?version=RoomOS 11` - Show RoomOS 11 videos
- `/mtr-navigator/?version=RoomOS 26` - Show RoomOS 26 videos
- `/mtr-navigator/?version=all` - Show all videos from all versions
- `/mtr-navigator/?theme=dark&qr=false` - Dark theme without QR code
- `/mtr-navigator/?hide=wirelessShare` - Hide wireless sharing videos
- `/mtr-navigator/?show=calendar,obtp` - Show only calendar and OBTP videos

## Video Versioning

Videos can be tagged with software versions to support multiple releases:

```json
{
  "title": "Join a scheduled meeting",
  "thumbnail": "deployments/mtr-navigator/images/example.png",
  "video": "deployments/mtr-navigator/videos/example.webm",
  "tags": ["obtp"],
  "version": "RoomOS 26",
  "default": true
}
```

- Videos with `"default": true` are shown by default (no version parameter needed)
- Videos with specific versions (e.g., `"RoomOS 11"`, `"RoomOS 26"`) can be filtered using `?version=<version>`
- Use actual version numbers with proper spacing (e.g., `"RoomOS 26"`) for correct marketing names
- The `default` field indicates which videos represent the recommended/latest version

This allows maintaining tutorials for customers on older software versions while updating to newer releases.

## Features

- Single-page application with client-side routing
- Responsive video grid layout
- Modal video player with accessibility support
- Software version filtering
- Tag-based content filtering
- Theme switching (Cisco brand vs classic)
- QR code generation for mobile access
- Auto-close functionality for Cisco touch devices
- Modular deployment structure
