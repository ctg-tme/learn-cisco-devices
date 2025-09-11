// QR Code visibility control
const qrCode = document.getElementById('qrCode');
// Check for QR code parameter
const urlParams = new URLSearchParams(window.location.search);
const showQR = urlParams.get('qr');

if (showQR === 'false') {
  if (qrCode) {
    qrCode.classList.add('hidden');
  }
}

// Check for theme parameter
const theme = urlParams.get('theme');
if (theme === 'classic') {
  document.body.classList.add('classic-theme');
}

// Homepage deployment card parameter passing
const deploymentCards = document.querySelectorAll('.deployment-card');
deploymentCards.forEach(card => {
  card.addEventListener('click', (e) => {
    e.preventDefault();
    const targetUrl = card.getAttribute('onclick')?.match(/window\.location\.href='([^']+)'/)?.[1];
    if (targetUrl) {
      // Get current URL parameters
      const currentParams = new URLSearchParams(window.location.search);
      const targetUrlWithParams = new URL(targetUrl, window.location.origin);
      
      // Add all current parameters to the target URL
      currentParams.forEach((value, key) => {
        targetUrlWithParams.searchParams.set(key, value);
      });
      
      window.location.href = targetUrlWithParams.toString();
    }
  });
});

// Video modal functionality (only if modal elements exist)
const modal = document.getElementById('videoModal');
const modalVideo = document.getElementById('modalVideo');
const closeButton = document.getElementById('closeModal');
const videoCards = document.querySelectorAll('.video-card');

// Only initialize modal functionality if modal elements exist
if (modal && modalVideo && closeButton) {
  // Add click event to all video cards
  videoCards.forEach(card => {
    card.addEventListener('click', () => {
      const videoSrc = card.getAttribute('data-video');
      openModal(videoSrc);
    });
  });

  // Open modal function
  function openModal(videoSrc) {
    modalVideo.src = videoSrc;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  // Close modal function
  function closeModal() {
    modal.classList.remove('active');
    modalVideo.pause();
    modalVideo.src = '';
    document.body.style.overflow = '';
  }

  // Close button event
  closeButton.addEventListener('click', closeModal);

  // Click outside modal to close
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Escape key to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}