/**
 * Portfolio Interactive Scripts
 * Handles header blur, inline aspect-ratio video playback,
 * format filtering, and scroll micro-animations.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Header scroll effect
  const siteHeader = document.getElementById('site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  });

  // 2. Direct Native Video Playback (Directly in-place, zero alignment shifts, no popups)
  const videoCards = document.querySelectorAll('.inline-video-card');
  const allVideos = document.querySelectorAll('.native-video-player');

  videoCards.forEach(card => {
    const video = card.querySelector('.native-video-player');
    const overlay = card.querySelector('.video-overlay');

    if (!video) return;

    // Clicking overlay/play button triggers native play
    if (overlay) {
      overlay.addEventListener('click', (e) => {
        e.stopPropagation();
        // Pause any other playing video
        allVideos.forEach(v => {
          if (v !== video && !v.paused) {
            v.pause();
          }
        });

        card.classList.add('is-playing');
        video.play().catch(err => console.log('Playback error:', err));
      });
    }

    // Handle native video events
    video.addEventListener('play', () => {
      // Pause all other videos
      allVideos.forEach(v => {
        if (v !== video && !v.paused) {
          v.pause();
        }
      });
      card.classList.add('is-playing');
    });

    video.addEventListener('pause', () => {
      // Keep overlay hidden while user is interacting with controls
    });

    video.addEventListener('ended', () => {
      card.classList.remove('is-playing');
    });
  });

  // 3. Showcase Format Filtering (Widescreen vs. Vertical vs. All)
  const filterButtons = document.querySelectorAll('.filter-btn');
  const groupWidescreen = document.getElementById('group-widescreen');
  const groupVertical = document.getElementById('group-vertical');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filter = button.getAttribute('data-filter');

      if (filter === 'all') {
        if (groupWidescreen) groupWidescreen.style.display = 'block';
        if (groupVertical) groupVertical.style.display = 'block';
      } else if (filter === 'widescreen') {
        if (groupWidescreen) groupWidescreen.style.display = 'block';
        if (groupVertical) {
          groupVertical.style.display = 'none';
          groupVertical.querySelectorAll('video').forEach(v => v.pause());
        }
      } else if (filter === 'vertical') {
        if (groupWidescreen) {
          groupWidescreen.style.display = 'none';
          groupWidescreen.querySelectorAll('video').forEach(v => v.pause());
        }
        if (groupVertical) groupVertical.style.display = 'block';
      }
    });
  });

  // 4. Smooth scroll for internal links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });

  // 5. Subtle entrance observer for timeline cards & sections
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  };

  const entranceObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.timeline-entry, .result-card, .inline-video-card, .stack-item').forEach(el => {
    entranceObserver.observe(el);
  });
});
