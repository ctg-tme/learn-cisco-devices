# Learn Cisco Devices

A modular video tutorial platform for different Cisco device deployment types.

## Structure

```
/
├── index.html                    # Deployment selection page
├── shared/                       # Common assets and code
│   ├── assets/
│   │   └── images/              # Shared images and icons
│   ├── styles/
│   │   └── main.css            # Common styling
│   └── scripts/
│       └── scripts.js          # Common JavaScript
└── mtr-navigator/              # Microsoft Teams Rooms with Navigator
    ├── index.html              # MTR Navigator tutorials
    └── videos/                 # Deployment-specific videos
```

## Adding New Deployments

1. Create a new subdirectory (e.g., `webex-room-kit/`)
2. Copy `mtr-navigator/index.html` as a template
3. Update paths to shared assets (`../shared/`)
4. Add deployment-specific videos to the subdirectory
5. Add a new deployment card to the main `index.html`

## URL Parameters

- `?theme=classic` - Switch to white text on dark grey theme
- `?qr=false` - Hide QR code

Examples:
- `/mtr-navigator/?theme=classic&qr=false`
- `/webex-room-kit/?theme=classic`

## Features

- Responsive video grid layout
- Modal video player
- Theme switching (Cisco brand vs classic)
- QR code visibility control
- Modular deployment structure