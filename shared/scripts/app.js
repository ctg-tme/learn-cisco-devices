// Single Page Application Router and Page Renderer
class CiscoDeviceApp {
  constructor() {
    this.config = null;
    this.currentPage = null;
    this.urlParams = new URLSearchParams(window.location.search);
    this.filters = this.parseFilters();
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

  async init() {
    try {
      // Log user agent info for debugging
      //this.logUserAgent();
      
      // Check if we have a route parameter from GitHub Pages 404 redirect
      const routeParam = this.urlParams.get('route');
      if (routeParam) {
        // Clean up the URL and navigate to the proper route
        const repoName = window.SPA_CONFIG.REPO_NAME;
        const cleanUrl = new URL(window.location.origin + repoName + routeParam);
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
    console.log('Browser Info:', info);
    return info;
  }

  handleRoute() {
    const path = window.location.pathname;
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

  renderHomepage(config) {
    // Hide QR code on homepage
    const qrCode = document.getElementById('qrCode');
    qrCode.style.display = 'none';

    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="header">
        <h1>${config.header.title}</h1>
        <p>${config.header.subtitle}</p>
      </div>

      <div class="container">
        <div class="section">
          <h2 class="section-title">Available Deployments</h2>
          <div class="video-grid">
            ${config.deployments.map(deployment => `
              <div class="deployment-card" data-route="${deployment.id}">
                <div class="deployment-thumbnail">
                  <img src="${this.getAbsolutePath(deployment.thumbnail)}" alt="${deployment.name} ${deployment.subtitle}">
                  <div class="deployment-overlay">
                    <h3>${deployment.name}</h3>
                    <p>${deployment.subtitle}</p>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    // Add click handlers for deployment cards
    const deploymentCards = app.querySelectorAll('.deployment-card');
    deploymentCards.forEach(card => {
      card.addEventListener('click', () => {
        const route = card.getAttribute('data-route');
        this.navigateTo(route);
      });
    });
  }

  filterVideo(video) {
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
      <div class="header">
        <h1>${config.header.title}</h1>
        <p>${config.header.subtitle}</p>
      </div>
    `;

    // Render sections with filtered videos
    const sectionsHtml = config.sections.map(section => {
      // Filter videos based on URL parameters
      const filteredVideos = section.videos.filter(video => this.filterVideo(video));
      
      // Skip empty sections
      if (filteredVideos.length === 0) return '';
      
      const videosHtml = filteredVideos.map(video => `
        <div class="video-card" onclick="window.ciscoApp.playVideo('${this.getAbsolutePath(video.video)}')">
          <div class="video-thumbnail">
            <img src="${this.getAbsolutePath(video.thumbnail)}" alt="${video.title}">
            <div class="play-button">▶</div>
          </div>
          <div class="video-info">
            <h3 class="video-title">${video.title}</h3>
          </div>
        </div>
      `).join('');

      return `
        <div class="section">
          <h2 class="section-title">${section.title}</h2>
          <div class="video-grid">
            ${videosHtml}
          </div>
        </div>
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

    // Add scroll indicator if content overflows
    this.addScrollIndicator();
    this.setupEventListeners();
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
      
      // Auto-play the video
      modalVideo.play().catch(e => {
        console.log('Autoplay prevented by browser:', e);
      });
    }
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

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

  playVideo(videoSrc) {
    this.openModal(videoSrc);
  }

  closeModal() {
    const modal = document.getElementById('videoModal');
    const modalVideo = document.getElementById('modalVideo');
    const modalGif = document.getElementById('modalGif');
    
    modal.classList.remove('active');
    modalVideo.pause();
    modalVideo.src = '';
    modalGif.src = '';
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
    this.handleRoute();
  }

  addScrollIndicator() {
    // Remove existing scroll indicator
    const existingIndicator = document.querySelector('.scroll-indicator');
    if (existingIndicator) {
      existingIndicator.remove();
    }

    // Check if page content is scrollable
    const hasScroll = document.body.scrollHeight > window.innerHeight;
    
    if (hasScroll) {
      const scrollIndicator = document.createElement('div');
      scrollIndicator.className = 'scroll-indicator';
      scrollIndicator.innerHTML = `
        <div class="scroll-arrow"></div>
      `;
      
      document.body.appendChild(scrollIndicator);
      
      // Hide indicator when user scrolls near bottom
      const handleScroll = () => {
        const scrollPosition = window.scrollY + window.innerHeight;
        const documentHeight = document.body.scrollHeight;
        const threshold = 200; // Hide when within 200px of bottom
        
        if (scrollPosition >= documentHeight - threshold) {
          scrollIndicator.classList.add('hidden');
        } else {
          scrollIndicator.classList.remove('hidden');
        }
      };
      
      window.addEventListener('scroll', handleScroll);
      
      // Clean up on page navigation
      const cleanup = () => {
        window.removeEventListener('scroll', handleScroll);
        if (scrollIndicator.parentNode) {
          scrollIndicator.remove();
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
}

// Initialize the app
window.ciscoApp = new CiscoDeviceApp();
