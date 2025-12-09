// Single Page Application Router and Page Renderer
class CiscoDeviceApp {
  constructor() {
    this.config = null;
    this.urlParams = new URLSearchParams(window.location.search);
    this.filters = this.parseFilters();
    this.versionFilter = this.parseVersionFilter();
    this.autoCloseTimer = null;
    this.focusedElementBeforeModal = null;
    this.init();
  }

  parseFilters() {
    const filters = {
      hide: [],
      show: []
    };
    
    // Parse hide parameter - supports multiple comma-separated values
    const hideParam = this.urlParams.get('hide');
    if (hideParam) {
      filters.hide = hideParam.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    }
    
    // Parse show parameter - supports multiple comma-separated values  
    const showParam = this.urlParams.get('show');
    if (showParam) {
      filters.show = showParam.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    }
    
    return filters;
  }

  parseVersionFilter() {
    // Parse version parameter
    // If not specified, return null to show default videos (those with default: true)
    // If set to "all", show all versions
    // Otherwise, show videos matching the specific version (e.g., "RoomOS11", "RoomOS26")
    const versionParam = this.urlParams.get('version');
    return versionParam || null;
  }

  async init() {
    try {
      // Log user agent info for debugging
      //this.logUserAgent();
      
      // Check if we have a route parameter from GitHub Pages 404 redirect
      const routeParam = this.urlParams.get('route');
      if (routeParam) {
        // Clean up the URL and navigate to the proper route
        const repoName = window.SPA_CONFIG.REPO_NAME;
        const decodedRoute = decodeURIComponent(routeParam);
        // Ensure proper slash separation between repo name and route
        const cleanPath = repoName + (decodedRoute.startsWith('/') ? decodedRoute : '/' + decodedRoute);
        const cleanUrl = new URL(window.location.origin + cleanPath);
        this.urlParams.delete('route');
        this.urlParams.forEach((value, key) => {
          cleanUrl.searchParams.set(key, value);
        });
        window.history.replaceState({}, '', cleanUrl.toString());
      }
      
      const response = await fetch(this.getAbsolutePath('config/pages.json'));
      this.config = await response.json();
      
      // Handle initial route
      this.handleRoute();
      
      // Listen for browser navigation
      window.addEventListener('popstate', () => this.handleRoute());
      
    } catch (error) {
      console.error('Failed to load configuration:', error);
      this.render404();
    }
  }

  setupRouting() {
    // Handle browser back/forward buttons
    window.addEventListener('popstate', () => this.handleRoute());
  }

  setupEventListeners() {
    // Theme parameter handling
    const theme = this.urlParams.get('theme');
    if (theme === 'dark') {
      document.body.classList.add('dark-theme');
    }

    // QR code parameter handling
    const showQR = this.urlParams.get('qr');
    const qrCode = document.getElementById('qrCode');
    if (showQR === 'false' && qrCode) {
      qrCode.style.display = 'none';
    }

    // Setup close button for video modal
    const closeButton = document.getElementById('closeModal');
    if (closeButton) {
      closeButton.addEventListener('click', () => this.closeModal());
    }
  }

  getUserAgentInfo() {
    return {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine
    };
  }

  logUserAgent() {
    const info = this.getUserAgentInfo();
    return info;
  }

  handleMediaProxyRoute(path) {
    // Handle routes like:
    // - /media/{deployment}/{type}/{filename} (legacy URL format, redirects to new structure)
    // - /{type}/{deployment}/{filename} (simplified format with type prefix)
    // - /{deployment-type}/{device-type}/{filename} (hierarchical format - NEW PREFERRED)
    // Example legacy: /learn-cisco-devices/media/mtr-navigator/images/mtr_navigator_schedule_teams.png
    // Example simplified: /learn-cisco-devices/videos/mtr-navigator/join_room_audio.webm
    // Example hierarchical: /learn-cisco-devices/mtr/navigator/join_room_audio.webm
    const repoName = window.SPA_CONFIG.REPO_NAME;
    let cleanPath = path;
    
    // Remove repo name from path if present
    if (path.startsWith(repoName)) {
      cleanPath = path.substring(repoName.length);
    }
    
    let actualPath, mediaType, filename;
    
    // Try legacy pattern first: /media/{deployment}/{type}/{filename}
    const legacyMatch = cleanPath.match(/^\/media\/([^\/]+)\/(images|videos)\/(.+)$/);
    
    if (legacyMatch) {
      const [, deployment, type, file] = legacyMatch;
      mediaType = type;
      filename = file;
      
      // Map legacy deployments to new structure
      if (deployment === 'mtr-navigator') {
        actualPath = `deployments/mtr/navigator/${mediaType}/${filename}`;
      } else {
        // For other legacy deployments, keep old structure
        actualPath = `deployments/${deployment}/${mediaType}/${filename}`;
      }
    } else {
      // Try new hierarchical pattern WITHOUT type prefix: /{deployment-type}/{device-type}/{filename}
      // This needs to be checked before the pattern with type prefix to avoid conflicts with page routes
      const newHierarchicalMatch = cleanPath.match(/^\/([^\/]+)\/([^\/]+)\/([^\/]+\.(webm|png|jpg|jpeg|gif|mp4))$/);
      
      if (newHierarchicalMatch) {
        const [, deploymentType, deviceType, file] = newHierarchicalMatch;
        filename = file;
        // Determine media type from file extension
        mediaType = file.match(/\.(webm|mp4)$/) ? 'videos' : 'images';
        // Use new hierarchical structure directly
        actualPath = `deployments/${deploymentType}/${deviceType}/${mediaType}/${filename}`;
      } else {
        // Try hierarchical pattern WITH type prefix: /{type}/{deployment-type}/{device-type}/{filename}
        const hierarchicalWithTypeMatch = cleanPath.match(/^\/(images|videos)\/([^\/]+)\/([^\/]+)\/(.+)$/);
        
        if (hierarchicalWithTypeMatch) {
          const [, type, deploymentType, deviceType, file] = hierarchicalWithTypeMatch;
          mediaType = type;
          filename = file;
          // Use new hierarchical structure directly
          actualPath = `deployments/${deploymentType}/${deviceType}/${mediaType}/${filename}`;
        } else {
          // Try simplified pattern: /{type}/{deployment}/{filename}
          const simplifiedMatch = cleanPath.match(/^\/(images|videos)\/([^\/]+)\/(.+)$/);
          
          if (simplifiedMatch) {
            const [, type, deployment, file] = simplifiedMatch;
            mediaType = type;
            filename = file;
            
            // Map simplified format to appropriate structure
            if (deployment === 'mtr-navigator') {
              // Redirect old mtr-navigator to new mtr/navigator structure
              actualPath = `deployments/mtr/navigator/${mediaType}/${filename}`;
            } else {
              // For other deployments, use as-is
              actualPath = `deployments/${deployment}/${mediaType}/${filename}`;
            }
          } else {
            return false; // Not a media proxy route
          }
        }
      }
    }
    
    const fullUrl = this.getAbsolutePath(actualPath);
    
    // Use meta refresh instead of immediate redirect to give analytics time to send
    // This is more reliable than setTimeout for analytics tracking
    const head = document.head || document.getElementsByTagName('head')[0];
    const meta = document.createElement('meta');
    meta.httpEquiv = 'refresh';
    meta.content = `0;url=${fullUrl}`;
    head.appendChild(meta);
    
    return true; // Handled as media proxy route
  }

  renderMediaProxyPage(deployment, mediaType, filename, mediaUrl) {
    const app = document.getElementById('app');
    const deploymentName = deployment.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    
    document.title = `${filename} - Learn Cisco Devices`;
    
    app.innerHTML = `
      <div class="header">
        <h1>Media: ${filename}</h1>
        <p>From ${deploymentName}</p>
      </div>
      <div class="container">
        <div class="media-proxy-container" style="text-align: center; padding: 2rem;">
          <img src="${mediaUrl}" alt="${filename}" style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <div style="margin-top: 2rem;">
            <a href="${mediaUrl}" download="${filename}" class="button" style="display: inline-block; padding: 0.75rem 1.5rem; background: #0d6efd; color: white; text-decoration: none; border-radius: 4px; margin-right: 1rem;">Download Image</a>
            <a href="${this.getAbsolutePath(deployment)}" class="button" style="display: inline-block; padding: 0.75rem 1.5rem; background: #6c757d; color: white; text-decoration: none; border-radius: 4px;">View All Tutorials</a>
          </div>
        </div>
      </div>
    `;
  }

  handleRoute() {
    const path = window.location.pathname;
    
    // Check if this is a media proxy route first
    if (this.handleMediaProxyRoute(path)) {
      return;
    }
    
    const routeName = this.getRouteFromPath(path);
    this.renderPage(routeName);
  }

  getRouteFromPath(path) {
    // Handle GitHub Pages repository paths
    const repoName = window.SPA_CONFIG.REPO_NAME;
    let cleanPath = path;
    
    // Remove repo name from path if present
    if (path.startsWith(repoName)) {
      cleanPath = path.substring(repoName.length);
    }
    
    // Handle index.html and root paths - be more explicit
    if (cleanPath === '/' || cleanPath === '' || cleanPath === '/index.html' || 
        cleanPath.endsWith('/index.html') || path === repoName + '/' || path === repoName) {
      return 'homepage';
    }
    
    // Remove leading/trailing slashes and get the route
    cleanPath = cleanPath.replace(/^\/+|\/+$/g, '');
    
    // Remove index.html from the path if it exists
    const pathWithoutIndex = cleanPath.replace(/^index\.html\/?/, '');
    
    if (!pathWithoutIndex || pathWithoutIndex === '' || cleanPath === 'index.html') {
      return 'homepage';
    }
    
    // Handle hierarchical route structure: map /mtr/navigator to mtr-navigator
    // This allows both /mtr-navigator and /mtr/navigator to work
    const hierarchicalRouteMatch = pathWithoutIndex.match(/^([^\/]+)\/([^\/]+)$/);
    if (hierarchicalRouteMatch) {
      const [, deploymentType, deviceType] = hierarchicalRouteMatch;
      // Check if this maps to a known deployment (e.g., mtr/navigator -> mtr-navigator)
      const mappedRoute = `${deploymentType}-${deviceType}`;
      // Return the mapped route if it exists in config, otherwise return as-is
      return mappedRoute;
    }
    
    return pathWithoutIndex;
  }

  renderPage(routeName) {
    if (!this.config || !this.config[routeName]) {
      this.render404();
      return;
    }

    const pageConfig = this.config[routeName];
    this.currentPage = routeName;
    
    // Update page title
    document.title = pageConfig.title;
    
    // Update body class for styling
    document.body.className = '';
    if (this.urlParams.get('theme') === 'classic') {
      document.body.classList.add('classic-theme');
    }
    
    if (pageConfig.type === 'selector') {
      this.renderHomepage(pageConfig);
    } else if (pageConfig.type === 'deployment') {
      this.renderDeploymentPage(pageConfig);
    }
  }

  convertToHierarchicalRoute(deploymentId) {
    // Convert deployment IDs like "mtr-navigator" to hierarchical format "mtr/navigator"
    // This makes URLs cleaner and more future-proof
    if (deploymentId.includes('-')) {
      return deploymentId.replace('-', '/');
    }
    return deploymentId;
  }

  renderHomepage(config) {
    const app = document.getElementById('app');
    
    // Handle QR code display (same logic as deployment pages)
    const qrCode = document.getElementById('qrCode');
    const qrImage = document.getElementById('qrImage');
    
    // Determine if QR code should be shown
    const qrParam = this.urlParams.get('qr');
    const isCiscoNavigator = navigator.userAgent.includes('Cisco Room Navigator');
    const isRoomOS = navigator.userAgent.includes('RoomOS');
    
    let showQRCode = false;
    
    // URL parameter takes precedence
    if (qrParam === 'true') {
      showQRCode = true;
    } else if (qrParam === 'false') {
      showQRCode = false;
    } else {
      // No URL parameter set, use user agent detection
      showQRCode = isCiscoNavigator || isRoomOS;
    }
    
    if (showQRCode) {
      // Generate dynamic QR code based on current URL with qr=false parameter
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.set('qr', 'false');
      const urlWithQrFalse = encodeURIComponent(currentUrl.toString());
      const qrSize = '200x200'; // Default size, can be made configurable
      qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?data=${urlWithQrFalse}&size=${qrSize}`;
      qrImage.alt = 'QR Code for current page';
      qrCode.style.display = 'block';
    } else {
      qrCode.style.display = 'none';
    }
    
    const deployments = config.deployments || [];
    
    app.innerHTML = `
      <header class="header">
        <h1>${config.header.title}</h1>
        <p class="subtitle">${config.header.subtitle}</p>
      </header>
      <div class="container">
        <ul class="deployment-grid" aria-label="Available device tutorials">
          ${deployments.map(deployment => {
            const hierarchicalRoute = this.convertToHierarchicalRoute(deployment.id);
            return `
            <li class="deployment-card" data-route="${hierarchicalRoute}" tabindex="0" 
                aria-label="Open ${deployment.name} ${deployment.subtitle} tutorials">
              <img data-src="${this.getAbsolutePath(deployment.thumbnail)}" alt="" class="deployment-thumbnail lazy-load" role="presentation">
              <div class="deployment-info">
                <h2 class="deployment-name">${deployment.name}</h2>
                <p class="deployment-subtitle">${deployment.subtitle}</p>
              </div>
            </li>
          `}).join('')}
        </ul>
      </div>
    `;
    
    // Add click and keyboard handlers for deployment cards
    const deploymentCards = document.querySelectorAll('.deployment-card');
    deploymentCards.forEach(card => {
      // Click handler
      card.addEventListener('click', () => {
        const route = card.getAttribute('data-route');
        this.navigateTo(route);
      });
      
      // Keyboard handler
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const route = card.getAttribute('data-route');
          this.navigateTo(route);
        }
      });
    });
    
    // Initialize lazy loading for images
    this.initLazyLoading();
  }

  filterVideo(video) {
    // First check version filter
    if (this.versionFilter === 'all') {
      // Show all videos regardless of version
    } else if (this.versionFilter) {
      // Specific version requested (e.g., "RoomOS11", "RoomOS26")
      if (video.version !== this.versionFilter) {
        return false;
      }
    } else {
      // No version filter specified - show only default videos
      if (!video.default) {
        return false;
      }
    }
    
    // Then check tag filters
    if (!video.tags) return true; // Show videos without tags by default
    
    const { hide, show } = this.filters;
    
    // If show filter is specified, video must have at least one matching tag
    if (show.length > 0) {
      const hasShowTag = video.tags.some(tag => show.includes(tag));
      if (!hasShowTag) return false;
    }
    
    // If hide filter is specified, video must not have any matching tags
    if (hide.length > 0) {
      const hasHideTag = video.tags.some(tag => hide.includes(tag));
      if (hasHideTag) return false;
    }
    
    return true;
  }

  renderDeploymentPage(config) {
    // Show QR code if not disabled
    const qrCode = document.getElementById('qrCode');
    const qrImage = document.getElementById('qrImage');
    
    // Determine if QR code should be shown
    const qrParam = this.urlParams.get('qr');
    const isCiscoNavigator = navigator.userAgent.includes('Cisco Room Navigator');
    const isRoomOS = navigator.userAgent.includes('RoomOS');
    
    let showQRCode = false;
    
    // URL parameter takes precedence
    if (qrParam === 'true') {
      showQRCode = true;
    } else if (qrParam === 'false') {
      showQRCode = false;
    } else {
      // No URL parameter set, use user agent detection
      showQRCode = isCiscoNavigator || isRoomOS;
    }
    
    if (showQRCode) {
      // Generate dynamic QR code based on current URL with qr=false parameter
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.set('qr', 'false');
      const urlWithQrFalse = encodeURIComponent(currentUrl.toString());
      const qrSize = '200x200'; // Default size, can be made configurable
      qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?data=${urlWithQrFalse}&size=${qrSize}`;
      qrImage.alt = 'QR Code for current page';
      qrCode.style.display = 'block';
    } else {
      qrCode.style.display = 'none';
    }

    // Show debug info if requested
    const showDebug = this.urlParams.get('debug') === 'true';
    const debugHtml = showDebug ? `
      <div style="background: #f0f0f0; padding: 10px; margin: 10px 0; border-radius: 5px; font-family: monospace; font-size: 12px; color: black;">
        <strong>Debug Info:</strong><br>
        User Agent: ${navigator.userAgent}<br>
        Platform: ${navigator.platform}<br>
        Language: ${navigator.language}<br>
        Screen: ${screen.width}x${screen.height}<br>
        Viewport: ${window.innerWidth}x${window.innerHeight}
      </div>
    ` : '';

    // Set page title
    document.title = config.title;

    // Render header
    const headerHtml = `
      <header class="header">
        <h1>${config.header.title}</h1>
        <p class="subtitle">${config.header.subtitle}</p>
      </header>
    `;

    // Render sections with filtered videos
    const sectionsHtml = config.sections.map(section => {
      // Filter videos based on URL parameters
      const filteredVideos = section.videos.filter(video => this.filterVideo(video));
      
      // Skip empty sections
      if (filteredVideos.length === 0) return '';
      
      const videosHtml = filteredVideos.map((video, index) => {
        const versionBadge = this.getVersionBadgeHtml(video);
        return `
        <li class="video-card">
          <button class="video-button" 
                  aria-label="Play tutorial: ${video.title}"
                  data-video-src="${this.getAbsolutePath(video.video)}"
                  onclick="window.ciscoApp.playVideo('${this.getAbsolutePath(video.video)}')">
            <div class="video-thumbnail">
              <img data-src="${this.getAbsolutePath(video.thumbnail)}" alt="" class="lazy-load" role="presentation">
              ${versionBadge}
              <div class="play-button" aria-hidden="true"></div>
            </div>
            <div class="video-info">
              <h3 class="video-title">${video.title}</h3>
            </div>
          </button>
        </li>
      `}).join('');

      return `
        <section class="section">
          <h2 class="section-title">${section.title}</h2>
          <ul class="video-grid" aria-label="${section.title} tutorials">
            ${videosHtml}
          </ul>
        </section>
      `;
    }).filter(sectionHtml => sectionHtml !== '').join('');

    const appContainer = document.getElementById('app');
    appContainer.innerHTML = `
      ${headerHtml}
      ${debugHtml}
      <div class="container">
        ${sectionsHtml}
      </div>
    `;
    
    // Announce page changes to screen readers
    this.announcePageChange(config.title);

    // Add scroll indicator if content overflows
    this.addScrollIndicator();
    this.setupEventListeners();
    
    // Initialize lazy loading for images
    this.initLazyLoading();
  }

  setupVideoModal() {
    const modal = document.getElementById('videoModal');
    const modalVideo = document.getElementById('modalVideo');
    const closeButton = document.getElementById('closeModal');
    const videoCards = document.querySelectorAll('.video-card');

    if (!modal || !modalVideo || !closeButton) return;

    // Add click event to all video cards
    videoCards.forEach(card => {
      card.addEventListener('click', () => {
        const videoSrc = card.getAttribute('data-video');
        this.openModal(videoSrc);
      });
    });

    // Close button event
    closeButton.addEventListener('click', () => this.closeModal());

    // Click outside modal to close
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        this.closeModal();
      }
    });

    // Escape key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        this.closeModal();
      }
    });
  }

  openModal(mediaSrc) {
    const modal = document.getElementById('videoModal');
    const modalVideo = document.getElementById('modalVideo');
    const modalGif = document.getElementById('modalGif');
    const modalTitle = document.getElementById('modal-title');
    const videoDescription = document.getElementById('video-description');
    
    // Store the currently focused element to restore later
    this.focusedElementBeforeModal = document.activeElement;
    
    // Clear any existing auto-close timers
    if (this.autoCloseTimer) {
      clearTimeout(this.autoCloseTimer);
      this.autoCloseTimer = null;
    }
    
    // Check if the file is a GIF
    const isGif = mediaSrc.toLowerCase().endsWith('.gif');
    
    if (isGif) {
      // Show GIF, hide video
      modalVideo.style.display = 'none';
      modalGif.style.display = 'block';
      modalGif.src = mediaSrc;
    } else {
      // Show video, hide GIF
      modalGif.style.display = 'none';
      modalVideo.style.display = 'block';
      modalVideo.src = mediaSrc;
      
      // Set up video end detection and auto-close for Cisco devices
      const handleVideoEnd = () => {
        // For completed videos, use the video duration as viewing time
        // This prevents inflated metrics if user leaves video open and walks away
        const videoDuration = modalVideo.duration || 0;
        
        // Track video completion
        if (window.aptabaseEvent) {
          window.aptabaseEvent('video_completed', {
            'video_src': mediaSrc,
            'video_title': this.getVideoTitle(mediaSrc),
            'current_route': window.location.pathname,
            'duration': videoDuration,
            'viewing_time': Math.round(videoDuration * 100) / 100, // Use video duration, not wall-clock time
            'completion_percentage': 100
          });
        }
        
        if (this.shouldAutoClose()) {
          this.startAutoCloseTimer();
        }
      };
      
      // Remove any existing event listeners
      modalVideo.removeEventListener('ended', handleVideoEnd);
      modalVideo.addEventListener('ended', handleVideoEnd);
      
      // Auto-play the video
      modalVideo.play().then(() => {
        // Track video start time for viewing duration calculation
        modalVideo.startTime = Date.now();
        
        // Track video play event (most important analytics event)
        if (window.aptabaseEvent) {
          window.aptabaseEvent('video_played', {
            'video_src': mediaSrc,
            'video_title': this.getVideoTitle(mediaSrc),
            'current_route': window.location.pathname,
            'auto_play': true
          });
        }
      }).catch(e => {
        // Track autoplay failure - important for understanding user experience
        if (window.aptabaseEvent) {
          window.aptabaseEvent('video_autoplay_failed', {
            'video_src': mediaSrc,
            'video_title': this.getVideoTitle(mediaSrc),
            'current_route': window.location.pathname,
            'error': e.message
          });
        }
      });
    }
    
    // Set up accessibility attributes and content
    const videoTitle = this.getVideoTitle(mediaSrc);
    modalTitle.textContent = videoTitle;
    videoDescription.textContent = `Tutorial video: ${videoTitle}. Use video controls to play, pause, or adjust volume. Press Escape or click Back to close.`;
    
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    
    // Only apply focus management for non-touch devices to avoid conflicts with auto-close
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isCiscoDevice = navigator.userAgent.includes('Cisco Room Navigator') || navigator.userAgent.includes('RoomOS');
    
    if (!isTouchDevice && !isCiscoDevice) {
      // Focus management - focus the close button for keyboard users
      const closeButton = document.getElementById('closeModal');
      setTimeout(() => closeButton.focus(), 100);
      
      // Trap focus within modal
      this.trapFocus(modal);
    }
    
    // Announce video opening to screen readers
    this.announceToScreenReader(`Video opened: ${videoTitle}. Use video controls or press Escape to close.`);

    // Close modal when clicking on background or pressing Escape
    const handleModalClick = (e) => {
      if (e.target === modal) {
        this.closeModal();
        modal.removeEventListener('click', handleModalClick);
        document.removeEventListener('keydown', handleEscapeKey);
      }
    };
    
    const handleEscapeKey = (e) => {
      if (e.key === 'Escape') {
        this.closeModal();
        modal.removeEventListener('click', handleModalClick);
        document.removeEventListener('keydown', handleEscapeKey);
      }
    };
    
    modal.addEventListener('click', handleModalClick);
    document.addEventListener('keydown', handleEscapeKey);
  }

  shouldAutoClose() {
    // Check URL parameter first - it takes precedence
    const timeoutParam = this.urlParams.get('timeout');
    if (timeoutParam === 'true') {
      return true;
    } else if (timeoutParam === 'false') {
      return false;
    }
    
    // No URL parameter set, check user agent for Cisco devices
    const isCiscoNavigator = navigator.userAgent.includes('Cisco Room Navigator');
    const isRoomOS = navigator.userAgent.includes('RoomOS');
    
    return isCiscoNavigator || isRoomOS;
  }

  playVideo(videoSrc) {
    this.openModal(videoSrc);
  }

  startAutoCloseTimer() {
    // Clear any existing timer
    if (this.autoCloseTimer) {
      clearTimeout(this.autoCloseTimer);
    }
    
    // Set up user activity detection
    let lastActivity = Date.now();
    
    const resetActivityTimer = () => {
      lastActivity = Date.now();
    };
    
    // Listen for user activity - enhanced for touch devices
    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'touchmove', 'touchend', 'click', 'pointerdown', 'pointermove'];
    activityEvents.forEach(event => {
      document.addEventListener(event, resetActivityTimer, { passive: true });
    });
    
    // Check for inactivity every 5 seconds
    const checkInactivity = () => {
      const inactiveTime = Date.now() - lastActivity;
      const inactivityThreshold = 30000; // 30 seconds of inactivity
      
      if (inactiveTime >= inactivityThreshold) {
        // Clean up activity listeners
        activityEvents.forEach(event => {
          document.removeEventListener(event, resetActivityTimer);
        });
        this.closeModal();
      } else {
        // Continue checking
        this.autoCloseTimer = setTimeout(checkInactivity, 5000);
      }
    };
    
    // Start the inactivity check
    this.autoCloseTimer = setTimeout(checkInactivity, 5000);
  }

  closeModal() {
    const modal = document.getElementById('videoModal');
    const modalVideo = document.getElementById('modalVideo');
    const modalGif = document.getElementById('modalGif');
    
    // Clear auto-close timer
    if (this.autoCloseTimer) {
      clearTimeout(this.autoCloseTimer);
      this.autoCloseTimer = null;
    }
    
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    
    // Restore focus to the element that was focused before opening modal
    if (this.focusedElementBeforeModal) {
      this.focusedElementBeforeModal.focus();
      this.focusedElementBeforeModal = null;
    }
    
    // Properly stop and clean up video to prevent "Invalid URI" errors
    if (modalVideo.src) {
      // Track viewing time for incomplete videos
      if (modalVideo.startTime && window.aptabaseEvent) {
        const viewingTime = (Date.now() - modalVideo.startTime) / 1000;
        const currentTime = modalVideo.currentTime || 0;
        const duration = modalVideo.duration || 0;
        
        // Only track if user actually watched some of the video (more than 1 second)
        if (viewingTime > 1) {
          window.aptabaseEvent('video_viewing_time', {
            'video_src': modalVideo.src,
            'video_title': this.getVideoTitle(modalVideo.src),
            'current_route': window.location.pathname,
            'viewing_time': Math.round(viewingTime * 100) / 100,
            'video_position': Math.round(currentTime * 100) / 100,
            'video_duration': Math.round(duration * 100) / 100,
            'completion_percentage': duration > 0 ? Math.round((currentTime / duration) * 100) : 0,
            'completed': false
          });
        }
      }
      
      modalVideo.pause();
      modalVideo.removeAttribute('src');
      modalVideo.load(); // This resets the video element
      modalVideo.startTime = null; // Clear the start time
    }
    
    // Clean up GIF
    modalGif.src = '';
    
    // Reset display states
    modalVideo.style.display = 'block';
    modalGif.style.display = 'none';
    document.body.style.overflow = '';
  }

  getAbsolutePath(relativePath) {
    // Convert relative paths to absolute paths for GitHub Pages
    const repoName = window.SPA_CONFIG.REPO_NAME;
    if (relativePath.startsWith('/')) {
      return relativePath;
    }
    return repoName + '/' + relativePath;
  }

  navigateTo(path) {
    // Preserve current URL parameters
    const currentParams = new URLSearchParams(window.location.search);
    
    // Ensure we maintain the GitHub Pages repository path
    const repoName = window.SPA_CONFIG.REPO_NAME;
    let fullPath = path;
    
    // If path doesn't start with repo name, prepend it
    if (!path.startsWith(repoName)) {
      fullPath = repoName + (path.startsWith('/') ? path : '/' + path);
    }
    
    const newUrl = new URL(fullPath, window.location.origin);
    
    // Add all current parameters to the new URL
    currentParams.forEach((value, key) => {
      newUrl.searchParams.set(key, value);
    });
    
    // Update browser history and handle route
    history.pushState(null, '', newUrl.toString());
    
    // Track navigation event
    if (window.aptabaseEvent) {
      window.aptabaseEvent('page_navigation', {
        'from_route': window.location.pathname,
        'to_route': fullPath,
        'navigation_type': 'internal'
      });
    }
    
    this.handleRoute();
  }

  trapFocus(modal) {
    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement = focusableElements[focusableElements.length - 1];

    modal.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstFocusableElement) {
            lastFocusableElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastFocusableElement) {
            firstFocusableElement.focus();
            e.preventDefault();
          }
        }
      }
    });
  }

  announcePageChange(pageTitle) {
    this.announceToScreenReader(`Navigated to ${pageTitle}. Page content updated.`);
  }

  announceToScreenReader(message) {
    // General purpose screen reader announcement
    const announcements = document.getElementById('sr-announcements');
    if (announcements) {
      announcements.textContent = message;
      setTimeout(() => {
        announcements.textContent = '';
      }, 3000);
    }
  }

  getVideoTitle(mediaSrc) {
    // Extract a readable title from the video file path with input validation
    if (!mediaSrc || typeof mediaSrc !== 'string') {
      return 'Unknown Video';
    }
    
    // Sanitize the input to prevent potential issues
    const sanitizedSrc = mediaSrc.replace(/[<>'"&]/g, '');
    const filename = sanitizedSrc.split('/').pop(); // Get filename
    
    if (!filename) {
      return 'Unknown Video';
    }
    
    const nameWithoutExt = filename.split('.')[0]; // Remove extension
    // Convert underscores to spaces and title case, limit length
    const title = nameWithoutExt.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    return title.length > 100 ? title.substring(0, 100) + '...' : title;
  }

  getVersionBadgeHtml(video) {
    // Generate HTML for version badge on video thumbnail
    if (!video || !video.version) return '';
    
    // Show "Latest" for default videos, otherwise show version number
    const displayText = video.default ? 'Latest' : video.version;
    
    // Normalize version string for CSS class (e.g., "RoomOS11" -> "roomos11")
    const versionClass = video.version.toLowerCase().replace(/\s+/g, '');
    
    return `<span class="version-badge ${versionClass}" aria-label="Software version: ${video.version}">${displayText}</span>`;
  }

  getVersionIndicatorHtml() {
    // Generate HTML for version filter indicator in header
    let message = '';
    
    if (this.versionFilter === 'all') {
      message = 'Showing videos from <strong>all versions</strong>';
    } else if (this.versionFilter) {
      message = `Showing <strong>${this.versionFilter}</strong> videos`;
    } else {
      message = 'Showing <strong>default</strong> videos (latest recommended version)';
    }
    
    return `<div class="version-filter-indicator" role="status" aria-live="polite">${message}</div>`;
  }

  addScrollIndicator() {
    // Remove existing scroll indicators
    const existingIndicators = document.querySelectorAll('.scroll-indicator');
    existingIndicators.forEach(indicator => indicator.remove());

    // Check if page content is scrollable and device is Cisco
    const hasScroll = document.body.scrollHeight > window.innerHeight;
    const isCiscoNavigator = navigator.userAgent.includes('Cisco Room Navigator');
    const isRoomOS = navigator.userAgent.includes('RoomOS');
    const shouldShowScrollArrows = isCiscoNavigator || isRoomOS;
    
    if (hasScroll && shouldShowScrollArrows) {
      // Create down arrow indicator
      const downIndicator = document.createElement('div');
      downIndicator.className = 'scroll-indicator down';
      downIndicator.innerHTML = `<div class="scroll-arrow down"></div>`;
      
      // Create up arrow indicator
      const upIndicator = document.createElement('div');
      upIndicator.className = 'scroll-indicator up hidden';
      upIndicator.innerHTML = `<div class="scroll-arrow up"></div>`;
      
      document.body.appendChild(downIndicator);
      document.body.appendChild(upIndicator);
      
      // Handle scroll events
      const handleScroll = () => {
        const scrollPosition = window.scrollY + window.innerHeight;
        const documentHeight = document.body.scrollHeight;
        const threshold = 200; // Hide when within 200px of bottom
        const topThreshold = 100; // Show up arrow when scrolled down 100px
        
        // Down arrow logic
        if (scrollPosition >= documentHeight - threshold) {
          downIndicator.classList.add('hidden');
        } else {
          downIndicator.classList.remove('hidden');
        }
        
        // Up arrow logic
        if (window.scrollY > topThreshold) {
          upIndicator.classList.remove('hidden');
        } else {
          upIndicator.classList.add('hidden');
        }
      };
      
      window.addEventListener('scroll', handleScroll);
      
      // Clean up on page navigation
      const cleanup = () => {
        window.removeEventListener('scroll', handleScroll);
        if (downIndicator.parentNode) {
          downIndicator.remove();
        }
        if (upIndicator.parentNode) {
          upIndicator.remove();
        }
      };
      
      // Store cleanup function for later use
      this.scrollIndicatorCleanup = cleanup;
    }
  }

  render404() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="header">
        <h1>Page Not Found</h1>
        <p>The requested page could not be found.</p>
      </div>
      <div class="container">
        <div class="section">
          <button onclick="window.location.href='/'">Return to Homepage</button>
        </div>
      </div>
    `;
  }

  initLazyLoading() {
    // Check if Intersection Observer is supported
    if (!('IntersectionObserver' in window)) {
      // Fallback: load all images immediately
      this.loadAllImages();
      return;
    }

    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          const src = img.getAttribute('data-src');
          
          if (src) {
            // Create a new image to preload
            const newImg = new Image();
            newImg.onload = () => {
              // Once loaded, set the src and remove data-src
              img.src = src;
              img.removeAttribute('data-src');
              img.classList.remove('lazy-load');
              img.classList.add('lazy-loaded');
            };
            newImg.onerror = () => {
              // Handle error - show placeholder or remove lazy-load class
              img.classList.remove('lazy-load');
              img.classList.add('lazy-error');
            };
            newImg.src = src;
          }
          
          // Stop observing this image
          observer.unobserve(img);
        }
      });
    }, {
      // Load images when they're 100px away from viewport
      rootMargin: '100px 0px',
      threshold: 0.01
    });

    // Observe all lazy-load images
    const lazyImages = document.querySelectorAll('img.lazy-load');
    lazyImages.forEach(img => {
      imageObserver.observe(img);
    });
  }

  loadAllImages() {
    // Fallback for browsers without Intersection Observer
    const lazyImages = document.querySelectorAll('img.lazy-load');
    lazyImages.forEach(img => {
      const src = img.getAttribute('data-src');
      if (src) {
        img.src = src;
        img.removeAttribute('data-src');
        img.classList.remove('lazy-load');
        img.classList.add('lazy-loaded');
      }
    });
  }
}

// Initialize the app
window.ciscoApp = new CiscoDeviceApp();
