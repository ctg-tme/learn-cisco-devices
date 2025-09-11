// Single Page Application Router and Page Renderer
class CiscoDeviceApp {
  constructor() {
    this.config = null;
    this.currentPage = null;
    this.urlParams = new URLSearchParams(window.location.search);
    this.init();
  }

  async init() {
    try {
      // Check if we have a route parameter from GitHub Pages 404 redirect
      const routeParam = this.urlParams.get('route');
      if (routeParam) {
        // Clean up the URL and navigate to the proper route
        const cleanUrl = new URL(window.location.origin + routeParam);
        this.urlParams.delete('route');
        this.urlParams.forEach((value, key) => {
          cleanUrl.searchParams.set(key, value);
        });
        window.history.replaceState({}, '', cleanUrl.toString());
      }
      
      const response = await fetch('config/pages.json');
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
    if (theme === 'classic') {
      document.body.classList.add('classic-theme');
    }

    // QR code parameter handling
    const showQR = this.urlParams.get('qr');
    const qrCode = document.getElementById('qrCode');
    if (showQR === 'false' && qrCode) {
      qrCode.style.display = 'none';
    }
  }

  handleRoute() {
    const path = window.location.pathname;
    const routeName = this.getRouteFromPath(path);
    this.renderPage(routeName);
  }

  getRouteFromPath(path) {
    // Handle GitHub Pages repository paths
    const repoName = '/learn-cisco-devices';
    let cleanPath = path;
    
    // Remove repo name from path if present
    if (path.startsWith(repoName)) {
      cleanPath = path.substring(repoName.length);
    }
    
    // Handle index.html and root paths
    if (cleanPath.endsWith('/index.html') || cleanPath === '/index.html' || 
        cleanPath === '/' || cleanPath === '' || cleanPath === repoName + '/') {
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
                  <img src="${deployment.thumbnail}" alt="${deployment.name} ${deployment.subtitle}">
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
        this.navigateTo(`/${route}`);
      });
    });
  }

  renderDeploymentPage(config) {
    // Show QR code if not disabled
    const qrCode = document.getElementById('qrCode');
    const qrImage = document.getElementById('qrImage');
    if (this.urlParams.get('qr') !== 'false' && config.qrCode) {
      qrImage.src = config.qrCode;
      qrCode.style.display = 'block';
    } else {
      qrCode.style.display = 'none';
    }

    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="header">
        <h1>${config.header.title}</h1>
        <p>${config.header.subtitle}</p>
      </div>

      <div class="container">
        ${config.sections.map(section => `
          <div class="section">
            <h2 class="section-title">${section.title}</h2>
            <div class="video-grid">
              ${section.videos.map(video => `
                <div class="video-card" data-video="${video.video}">
                  <div class="video-thumbnail">
                    <img src="${video.thumbnail}" alt="${video.title}">
                    <div class="play-button">▶</div>
                  </div>
                  <div class="video-info">
                    <h3 class="video-title">${video.title}</h3>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    `;

    // Setup video modal functionality
    this.setupVideoModal();
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

  openModal(videoSrc) {
    const modal = document.getElementById('videoModal');
    const modalVideo = document.getElementById('modalVideo');
    
    modalVideo.src = videoSrc;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Auto-play the video
    modalVideo.play().catch(e => {
      console.log('Autoplay prevented by browser:', e);
    });
  }

  closeModal() {
    const modal = document.getElementById('videoModal');
    const modalVideo = document.getElementById('modalVideo');
    
    modal.classList.remove('active');
    modalVideo.pause();
    modalVideo.src = '';
    document.body.style.overflow = '';
  }

  navigateTo(path) {
    // Preserve current URL parameters
    const currentParams = new URLSearchParams(window.location.search);
    const newUrl = new URL(path, window.location.origin);
    
    // Add all current parameters to the new URL
    currentParams.forEach((value, key) => {
      newUrl.searchParams.set(key, value);
    });
    
    // Update browser history and handle route
    history.pushState(null, '', newUrl.toString());
    this.handleRoute();
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

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new CiscoDeviceApp();
});
